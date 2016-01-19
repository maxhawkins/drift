from ellis.SAcC import SAcC
from StringIO import StringIO
import drift.ffmpeg as ffmpeg
import ellis
import time
import array
import wave
import math
import numpy as np
import sys
import traceback
import requests
import urlparse

def transcribe(gentle_client, blob_store, sess, transcript):
	try:
		wav = blob_store.get(sess['recording_id'])
		result = gentle_client.transcribe(wav, transcript)
		sess['transcript'] = result
		return sess
	except Exception, e:
		sess['status'] = 'ERROR'
		sess['error'] = traceback.format_exc()
		return sess

def get_pitches(wav_data):
    classifier = SAcC(ellis.SAcC.default_config())

    wav_stream = StringIO(wav_data)
    features = classifier.process_wav(wav_stream)

    pitches = []
    for line in features:
        time, freq, p_voiced = line
        if freq == 0:
        	continue
        pitches.append([time, freq])
    return pitches

def peaks_rms(data):
	chunk_size_secs = 0.01
	framerate = 8000
	chunk_size_frames = math.ceil(chunk_size_secs * framerate)
	chunk_count = math.ceil(float(len(data)) / chunk_size_frames)

	output = []

	chunks = np.array_split(data, chunk_count)
	for i, chunk in enumerate(chunks):
		start = i * chunk_size_secs
		duration = (i + 1) * chunk_size_secs - start
		peak = np.max(np.absolute(chunk))
		rms = np.sqrt(np.mean(np.absolute(chunk) ** 2))
		output.append([start, duration, peak, rms])

	return output

def get_waveform(blob_store, blob_id):
	filename = blob_store.filename(blob_id)

	data_str = ''
	with open(filename, 'r') as f:
		wav = wave.open(f, 'r')
		if wav.getframerate() != 8000:
			raise RuntimeError('wrong framerate %d' % wav.getframerate())
		while True:
			chunk = wav.readframes(1 << 15)
			if len(chunk) == 0:
				break
			data_str += chunk

	data = np.fromstring(data_str, dtype=np.int16).astype(np.float)
	data /= (1<<15) - 1

	return peaks_rms(data)

def process(session, blob_store):
	try:
		original_file = blob_store.filename(session['original_id'])
		wav = ffmpeg.to_wav(original_file)
		rec_id = blob_store.put(wav)
		session['recording_id'] = rec_id

		playback_wav = ffmpeg.to_wav(original_file, framerate=44100)
		playback_id = blob_store.put(playback_wav)
		session['playback_id'] = playback_id

		waveform = get_waveform(blob_store, rec_id)
		session['amplitude'] = waveform

		pitches = get_pitches(wav)
		session['freq_hz'] = pitches

		session['status'] = 'DONE'
		return session
	except Exception, e:
		session['status'] = 'ERROR'
		session['error'] = traceback.format_exc()
		return session
