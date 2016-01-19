import math
import wave

import numpy as np

def generate(filename):
	'''Generates a waveform for the specified 8kHz wav file'''
	data_str = load_wav_raw(filename)

	data_float = np.fromstring(data_str, dtype=np.int16).astype(np.float)
	data_float /= (1<<15) - 1

	return peaks_rms(data_float)

def peaks_rms(audio_array, chunk_size_secs=0.01, framerate = 8000):
	'''Takes an array of floating point audio samples and calculates
	the peak amplitude and RMS average amplitude for each 10ms chunk.
	Return value is an array of [start, duration, peak, rms] values.'''
	chunk_size_frames = math.ceil(chunk_size_secs * framerate)
	chunk_count = math.ceil(float(len(audio_array)) / chunk_size_frames)

	output = []

	chunks = np.array_split(audio_array, chunk_count)
	for i, chunk in enumerate(chunks):
		start = i * chunk_size_secs
		duration = (i + 1) * chunk_size_secs - start
		peak = np.max(np.absolute(chunk))
		rms = np.sqrt(np.mean(np.absolute(chunk) ** 2))
		output.append([start, duration, peak, rms])

	return output

def load_wav_raw(filename):
	'''Loads the 8kHz, 16bit unsigned integer PCM wav file at the specified
	filename and returns its data (without the header) as a byte string.'''
	data_str = ''
	with open(filename, 'r') as f:
		wav = wave.open(f, 'r')
		if wav.getframerate() != 8000:
			raise RuntimeError('wrong framerate %d' % wav.getframerate())
		if wav.getsampwidth() != 2:
			raise RuntimeError('wrong sample width %d' % wav.getsampwidth())
		while True:
			chunk = wav.readframes(1 << 15)
			if len(chunk) == 0:
				break
			data_str += chunk
	return data_str
