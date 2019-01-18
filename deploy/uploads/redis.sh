#!/bin/bash

redis-cli -h ${CC_REDIS_HOST} -p ${CC_REDIS_PORT} -a ${CC_REDIS_PASSWORD} --scan --pattern 'frontend:*' | xargs redis-cli -h ${CC_REDIS_HOST} -p ${CC_REDIS_PORT} -a ${CC_REDIS_PASSWORD} DEL
