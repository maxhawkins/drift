import hashlib
import os

class BlobStore(object):
	def __init__(self, base_folder):
		self.base_folder = base_folder
                if not os.path.exists(base_folder):
                        os.makedirs(base_folder)
	def put(self, data):
		id = 'sha1-' + hashlib.sha1(data).hexdigest()
		dest_path = os.path.join(self.base_folder, id)
		if not os.path.exists(dest_path):
			with open(dest_path, 'wb') as f:
				f.write(data)
		return id
	def filename(self, id):
		return os.path.join(self.base_folder, id)
	def get(self, id):
		with open(self.filename(id), 'rb') as f:
			return f.read()
