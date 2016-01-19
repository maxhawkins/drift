FROM python:2.7

ADD . /drift

VOLUME /drift/uploads
VOLUME /drift/db

EXPOSE 9876

RUN apt-get update && \
	 apt-get install -y libblas-dev liblapack-dev libatlas-base-dev gfortran && \
	 apt-get clean

RUN cd /drift && pip install -r requirements.txt

CMD cd /drift && python2 serve.py
