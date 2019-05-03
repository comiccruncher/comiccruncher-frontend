#!/usr/local/bin/bash
eval $(aws ecr get-login --no-include-email)
docker-compose pull
HOSTNAME=${HOSTNAME} docker-compose up -d --build --remove-orphans
docker system prune -af
