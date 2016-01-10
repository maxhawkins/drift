FROM python

ADD . /drift

VOLUME /gentle/storage

EXPOSE 9876

CMD cd /gentle && python serve.py
