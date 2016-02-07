
* Package [upstream pitch analyzer](https://github.com/dpwe/calc_sbpca) as a disttools Python package and install it with Pip. Then remove the vendored dependency from this repo.
* Re-write the JS sources using React/JSX for a performance boost. I didn't use React to avoid an extra dependency, but I think it will be way faster. The current source was written in pseudo-React style to make the transition easy.
* Refine and document the HTTP API. The current ?sideload parameter is a bit awkward in practice.
* Add a task queue to enable scale and true batching. [Celery](http://www.celeryproject.org/) is probably the best bet.
* Cache transcoding and processing results for fast re-running with different parameters. All audio is stored as immutable, content-addressible blobs so cache can be done with a key-value store.
* Create a production front-end build. Minify/optimize Javascript and CSS.
