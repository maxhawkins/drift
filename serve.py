import subprocess
import hashlib
import os
import json
import uuid
import logging

from StringIO import StringIO
from tempfile import NamedTemporaryFile

from twisted.web.static import File
from twisted.internet import reactor as default_reactor
from twisted.web.server import Site, NOT_DONE_YET
from twisted.web._responses import ACCEPTED, NOT_FOUND, FOUND
from twisted.web.resource import Resource
from twisted.internet import threads

import ellis.SAcC
from ellis.SAcC import SAcC

__version__ = '0.0.1'

def to_wav(infile, R=8000, depth=16, nchannels=1, start=0):
    '''
    Use FFMPEG to convert a media file to a wav file with the given
    sample format.

    Returns an IO object so the results can be streamed.
    '''
    cmd = ['ffmpeg',
           '-ss', "%f" % (start),
           '-i', infile,
           '-loglevel', 'panic',
           '-ss', "%f" % (start),
           '-vn',
           '-ar', str(R),
           '-ac', str(nchannels),
           '-f', 'wav',
           '-acodec', 'pcm_s16le',
           '-']
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)

    return p.stdout

def new_session_id(storage):
    uid = None
    while uid is None:
        uid = uuid.uuid4().get_hex()[:8]
    return uid

def get_pitches(wav_data):
    classifier = SAcC(ellis.SAcC.default_config())

    wav_stream = StringIO(wav_data)
    features = classifier.process_wav(wav_stream)

    freqs = []
    p_voiceds = []
    for line in features:
        time, freq, p_voiced = line
        freqs.append(freq)
        p_voiceds.append(p_voiced)
    return {
        "freq_hz": freqs,
        "p_voiced": p_voiceds,
    }

class FileStorage(object):
    def __init__(self, base_path):
        self.base_path = base_path
    def __setitem__(self, key, value):
        path = self._path(key)
        with NamedTemporaryFile(delete=False) as f:
            f.write(value)
            os.renames(f.name, path)
    def __getitem__(self, key):
        if not self.exists(key):
            return None
        path = self._path(key)
        with open(path, 'r') as f:
            return f.read()
    def exists(self, key):
        return os.path.isfile(self._path(key))
    def _path(self, key):
        return os.path.join(self.base_path, key)

class ServeStorage(Resource):
    def __init__(self, storage, key):
        Resource.__init__(self)
        self.storage = storage
        self.key = key
    def render_GET(self, req):
        resp = self.storage[self.key]
        if resp is None:
            req.setResponseCode(NOT_FOUND)
            return 'not found'
        return resp

class SessionController(Resource):
    def __init__(self, storage, session_id):
        Resource.__init__(self)

        self.session_id = session_id
        self.storage = storage

        self.putChild('', File('templates/view.html'))
        self.putChild('status.json', ServeStorage(
            storage, '%s/status.json' % session_id))
        self.putChild('pitch.json', ServeStorage(
            storage, '%s/pitch.json' % session_id))
        self.putChild('audio.wav', ServeStorage(
            storage, '%s/audio.wav' % session_id))
    def render_GET(self, req):
        req.setHeader('Location', '/sessions/%s/' % self.session_id)
        req.setResponseCode(FOUND)
        return ''

class SessionsController(Resource):
    def __init__(self, storage, reactor=default_reactor):
        Resource.__init__(self)
        self.reactor = reactor
        self.storage = storage

    def getChild(self, path, req):
        session_id = path.split('.')[0]
        return SessionController(self.storage, session_id)

    def render_POST(self, req):
        audio = req.args['audio'][0]

        session_id = new_session_id(self.storage)

        status = {
            'session_id': session_id,
            'status': 'STARTED',
        }

        status_key = '%s/status.json' % session_id
        self.storage[status_key] = json.dumps(status)

        def async():
            status['status'] = 'ENCODING'
            self.storage[status_key] = json.dumps(status)

            wav_key = '%s/audio.wav' % session_id
            wav = self.storage[wav_key]
            if wav is None:
                with NamedTemporaryFile() as f:
                    f.write(audio)
                    wav = to_wav(f.name).read()
                self.storage[wav_key] = wav

            status['status'] = 'PROCESSING'
            self.storage[status_key] = json.dumps(status)

            pitches = get_pitches(wav)
            pitches_key = '%s/pitch.json' % session_id
            self.storage[pitches_key] = json.dumps(pitches)

            status['status'] = 'DONE'
            self.storage[status_key] = json.dumps(status)

        result_promise = threads.deferToThreadPool(
            self.reactor, self.reactor.getThreadPool(),
            async)

        def on_error(err):
            status['status'] = 'ERROR'
            logging.error(err)
            self.storage[status_key] = json.dumps(status)
        result_promise.addErrback(on_error)

        req.setResponseCode(ACCEPTED)
        return json.dumps(status)

def serve(port=8765, interface='0.0.0.0', installSignalHandlers=0, data_dir='storage'):
    static_handler = Resource()
    static_handler.putChild('', File('templates/index.html'))
    static_handler.putChild('js', File('www/js'))
    static_handler.putChild('style', File('www/style'))

    storage = FileStorage(data_dir)

    sess_controller = SessionsController(storage)
    static_handler.putChild('sessions', sess_controller)

    site = Site(static_handler)

    default_reactor.listenTCP(port, site, interface=interface)
    logging.info('listening at %s:%d\n' % (interface, port))

    default_reactor.run(installSignalHandlers=installSignalHandlers)

def main():
    import argparse

    parser = argparse.ArgumentParser(
        description='Server for Drift pitch tracker.')
    parser.add_argument('--host', default="0.0.0.0",
                       help='host to run http server on')
    parser.add_argument('--port', default=9876, type=int,
                        help='port number to run http server on')
    parser.add_argument('--log', default="INFO",
                        help='the log level (DEBUG, INFO, WARNING, ERROR, or CRITICAL)')

    args = parser.parse_args()

    log_level = args.log.upper()
    logging.getLogger().setLevel(log_level)

    logging.info('drift %s' % (__version__))

    serve(args.port, args.host, installSignalHandlers=1)
    

if __name__=='__main__':
    main()