#!/bin/bash

docker kill -s HUP $(docker ps | awk '/nginx/{print $1}')
