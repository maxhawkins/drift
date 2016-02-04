from ellis.SAcC import SAcC, default_config
from StringIO import StringIO

def generate(wav_data):
    '''Runs SAcC to generate the pitch contours for an audio file.
    Provided audio file should be an 8kHz 16bit unsigned integer PCM
    wav file encoded as a byte string. The return value has the format
    [time in seconds, frequency in hertz].'''

    config = default_config()
    config['thop'] = 0.001

    classifier = SAcC(config)

    wav_stream = StringIO(wav_data)
    features = classifier.process_wav(wav_stream)

    pitches = []
    for line in features:
        time, freq, p_voiced = line
        if freq == 0:
        	continue
        pitches.append([time, freq])
    return pitches
