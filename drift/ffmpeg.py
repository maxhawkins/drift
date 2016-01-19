import wave
from StringIO import StringIO
import sys
import subprocess

def pcm16le_to_wav(audio_bytes, framerate=8000, nchannels=1):
    out_buf = StringIO()

    wav = wave.open(out_buf, 'wb')
    wav.setparams((nchannels, 2, framerate, 0, 'NONE', 'NONE'))
    wav.writeframes(audio_bytes)
    wav.close()

    wav_data = out_buf.getvalue()
    out_buf.close()

    return wav_data

def to_wav(filename, framerate=8000, nchannels=1):
    '''
    Use FFMPEG to convert a media file to a wav file with the given
    sample format.

    Returns an IO object so the results can be streamed.
    '''
    cmd = ['ffmpeg',
           '-i', filename,
           '-loglevel', 'panic',
           '-vn',
           '-ar', str(framerate),
           '-ac', str(nchannels),
           '-f', 's16le',
           '-acodec', 'pcm_s16le',
           '-']
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stdin=subprocess.PIPE, stderr=sys.stderr)

    stdout, _ = proc.communicate()

    return pcm16le_to_wav(stdout, framerate=framerate, nchannels=nchannels)
