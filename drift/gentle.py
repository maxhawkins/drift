import urlparse
import requests

class Client(object):
	def __init__(self, gentle_url):
		self.gentle_url = gentle_url
	def transcribe(self, audio, transcript):
		url = urlparse.urljoin(self.gentle_url, '/transcriptions?async=false')
		resp = requests.post(
			url,
			files=dict(audio=audio),
			data=dict(transcript=transcript))
		return resp.json()
