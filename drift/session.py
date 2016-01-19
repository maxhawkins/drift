try:
    import simplejson as json
except ImportError:
    import json

import uuid

def new():
	return {
		'name': '',
		'id': str(uuid.uuid4())[:8],
		'status': 'NEW',
		'original_id': None,
		'recording_id': None,
	}

def marshal_json(session):
	return json.dumps(session)

def marshal_csv(session):
    pitches = session['freq_hz']
    csv = 'seconds,hertz\n'
    for time, freq in pitches:
        csv += '%f,%f\n' % (time, freq)
    return csv
