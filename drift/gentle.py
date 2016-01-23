import requests
import socket
import urlparse

class Client(object):
	def __init__(self, gentle_url):
		self.gentle_url = gentle_url
	def ping(self):
		'''Contacts the Gentle server at the given URL
		to make sure it's running. Returns True if it worked
		For now just opens a TCP connection.'''
		url = urlparse.urlparse(self.gentle_url)
		try:
			sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
			sock.connect((url.hostname, url.port))
			sock.close()
		except IOError, e:
			return False
		return True

	def transcribe(self, audio, transcript):
		url = urlparse.urljoin(self.gentle_url, '/transcriptions?async=false')
		resp = requests.post(
			url,
			files=dict(audio=audio),
			data=dict(transcript=transcript))
		return resp.json()
