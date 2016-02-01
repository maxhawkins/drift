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
    by_time = {}

    if 'transcript' in session:
        tokens = session['transcript']['words']
        for token in tokens:
            if token['case'] != 'success':
                continue
            word = token['word']
            time = token['start']

            row = by_time.get(time, [time, None, None])
            row[2] = word
            by_time[time] = row

    if 'freq_hz' in session:
        pitches = session['freq_hz']
        for time, freq in pitches:
            row = by_time.get(time, [time, None, None])
            row[1] = freq
            by_time[time] = row

    rows = sorted(by_time.values(), key=lambda xs: xs[0])

    csv = 'seconds,hertz,word\n'
    for time, freq, word in rows:
        freq_str = ''
        if freq:
            freq_str = '%f' % freq
        word_str = ''
        if word:
            word_str = word
        csv += '%f,%s,%s\n' % (time, freq_str, word_str)

    return csv
