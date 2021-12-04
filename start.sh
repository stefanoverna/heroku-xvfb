#!/bin/sh

# build the docker
docker build -t scraper .

# comment if you don't want to run and remove on exit
docker run -p 3000:3000 -v /tmp:/tmp --rm -it scraper