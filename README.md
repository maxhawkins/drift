# Drift
**Pitch tracker explorer**

![Beta](https://img.shields.io/badge/status-beta-red.svg)
[![Build Status](https://img.shields.io/travis/lowerquality/drift.svg)](https://travis-ci.org/lowerquality/drift)

## Installing

First, have an instance of [Gentle](https://github.com/lowerquality/gentle) running. Follow the instructions on the Gentle page.

Then grab the dependencies for Drift and run it:

```
apt-get install ffmpeg
pip install -r requirements.txt
python serve.py --gentle_url <url for your gentle instance>
```

By default the server listens at http://localhost:9876.

## Developing

The backend is written in Python. The frontend is written in JavaScript/React. Use [webpack](https://webpack.github.io/) to build the JavaScript sources. Running `webpack -p` produces a minified production build.

## How It Works

This project makes it easy to see the [F0 pitch](https://en.wikipedia.org/wiki/Fundamental_frequency) of your audio recordings.

It uses the [Python version](https://github.com/dpwe/calc_sbpca) of Dan Ellis's excellent [Subband PCA](http://www.ee.columbia.edu/~dpwe/pubs/LeeEllis12-SAcC.pdf) algorithm ([license MIT](https://github.com/dpwe/calc_sbpca/blob/master/LICENSE)) for pitch tracking. It uses [Gentle](https://github.com/lowerquality/gentle) (MIT) for aligning audio with text.

You can use the web browser interface to upload, process, and view audio files with their pitch traces.
