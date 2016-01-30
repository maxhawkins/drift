import os.path
import json

import tornado.web

import drift.session as session
import drift.processor as processor

class SessionHandler(tornado.web.RequestHandler):
    def initialize(self, db, pool, blob_store, gentle_client):
        self.db = db
        self.pool = pool
        self.gentle_client = gentle_client
        self.blob_store = blob_store
    def get(self, path):
        id, ext = os.path.splitext(path)
        try:
            sess = self.db.get_session(id)
        except KeyError, e:
            raise tornado.web.HTTPError(404)

        respJSON = '{"session": %s}' % session.marshal_json(sess)
        if ext == '':
            return self.render('../templates/view.html', data=respJSON)
        elif ext == '.json':

            # HACK(maxhawkins): This sideload paramter is a temporary measure.
            # Later these heavy resources should be stored separately
            # from the session object. This will allow more efficient
            # storage and caching. For now, though, we can save bandwidth
            # by not sending them unless they're explicitly requested.
            to_sideload = self.get_arguments('sideload')
            if 'freq_hz' in sess and not 'freq_hz' in to_sideload:
                del sess['freq_hz']
            if 'waveform' in sess and not 'waveform' in to_sideload:
                del sess['waveform']
            respJSON = '{"session": %s}' % session.marshal_json(sess)

            self.set_header('Content-Type', 'text/json')
            return self.write(respJSON)
        elif ext == '.csv':
            self.set_header('Content-Type', 'text/csv')
            self.set_header('Content-Disposition', 'attachment; filename=%s.csv' % id)
            return self.write(session.marshal_csv(sess))
    def patch(self, path):
        # TODO(maxhawkins): maybe just make sessions immutable and cache
        # transcoding results instead?
        
        id, ext = os.path.splitext(path)
        sess = self.db.get_session(id)

        if sess['status'] != 'DONE':
            self.set_status(400)
            return self.write('session status must be "DONE" before aligning')

        body = json.loads(self.request.body)
        transcript = body['transcript']

        sess['status'] = 'ALIGNING'
        self.db.save_session(sess)

        self.pool.apply_async(
            processor.transcribe,
            (self.gentle_client, self.blob_store, sess, transcript),
            callback=self.db.save_session)

        return self.write(session.marshal_json(sess))

class UploadHandler(tornado.web.RequestHandler):
    def initialize(self, blob_store, db, pool):
        self.blob_store = blob_store
        self.db = db
        self.pool = pool
    def get(self):
        self.render("../templates/upload.html")
    def post(self):
        upload = self.request.files['file'][0]
        original_id = self.blob_store.put(upload['body'])

        sess = session.new()
        sess['name'] = upload['filename']
        sess['original_id'] = original_id
        sess['status'] = 'PROCESSING'
        self.db.save_session(sess)

        self.pool.apply_async(
            processor.process,
            (sess, self.blob_store),
            callback=self.db.save_session)

        return self.write(session.marshal_json(sess))

class BlobHandler(tornado.web.StaticFileHandler):
    def get(self, path, include_body=True):
        key, ext = os.path.splitext(path)
        self.set_header('Content-Disposition', 'attachment')
        return tornado.web.StaticFileHandler.get(self, key, include_body)
