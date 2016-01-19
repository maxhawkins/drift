import pickledb
import json

class DB(object):
	def __init__(self, filename):
		self.db = pickledb.load(filename, True)
	def save_session(self, session):
		key = 'sessions/' + session['id']
		self.db.set(key, json.dumps(session))
	def get_session(self, session_id):
		key = 'sessions/' + session_id
		return json.loads(self.db.get(key))
