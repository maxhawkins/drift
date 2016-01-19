import traceback

import drift.ffmpeg as ffmpeg
import drift.pitches as pitches
import drift.waveform as waveform

def transcribe(gentle_client, blob_store, sess, transcript):
	try:
		wav = blob_store.get(sess['recording_id'])
		result = gentle_client.transcribe(wav, transcript)
		sess['transcript'] = result
		sess['status'] = 'DONE'
		return sess
	except Exception, e:
		sess['status'] = 'ERROR'
		sess['error'] = traceback.format_exc()
		return sess

def process(session, blob_store):
	try:
		original_file = blob_store.filename(session['original_id'])
		wav = ffmpeg.to_wav(original_file)
		rec_id = blob_store.put(wav)
		session['recording_id'] = rec_id

		playback_wav = ffmpeg.to_wav(original_file, framerate=44100)
		playback_id = blob_store.put(playback_wav)
		session['playback_id'] = playback_id

		rec_filename = blob_store.filename(rec_id)
		wform = waveform.generate(rec_filename)
		session['waveform'] = wform

		pitch = pitches.generate(wav)
		session['freq_hz'] = pitch

		session['status'] = 'DONE'
		return session
	except Exception, e:
		session['status'] = 'ERROR'
		session['error'] = traceback.format_exc()
		return session
