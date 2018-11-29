CC_AWS_BUCKET = appearances-us-east-1

NEXT_STATIC_DIR = _next/static

DOCKER_RUN_AWSCLI = docker run --rm \
	-e "AWS_ACCESS_KEY_ID=${CC_AWS_ACCESS_KEY_ID}" \
	-e "AWS_SECRET_ACCESS_KEY=${CC_AWS_SECRET_ACCESS_KEY}" \
	-e "AWS_DEFAULT_REGION=us-east-1" \
	-v "$$(pwd):/project" \
	mesosphere/aws-cli	

NGINX_SERVER = aimee@68.183.27.114

NGINX_CONTAINER_NAME = uploads_nginx_1_5a4d01086d34

DOCKER_COMPOSE_NGINX = docker-compose -f ./deploy/uploads/docker-compose.nginx.yml

DOCKER_COMPOSE_DEV = docker-compose -f docker-compose.yml

DEPLOY_NGINX_COMMAND = ${DOCKER_COMPOSE_NGINX} up \
	-d \
	--build \
	--remove-orphans \
	--force-recreate

DOCKER_COMPOSE_PM2 = docker-compose -f ./deploy/uploads/docker-compose.pm2.yml

DOCKER_COMPOSE_PM2_UP_CMD = ${DOCKER_COMPOSE_PM2} up -d --build --remove-orphans --force-recreate

PM2_IMAGE = comiccruncher/frontend:test

PM2_SERVER1 = aimee@167.99.157.206
PM2_SERVER2 = aimee@68.183.143.225

# Installs the S3 image.
.PHONY: docker-pull-awscli
docker-pull-awscli:
	docker pull mesosphere/aws-cli

# Uploads static assets to S3.
.PHONY: docker-upload-static
docker-upload-static:
	${DOCKER_RUN_AWSCLI} s3 cp ./static s3://${CC_AWS_BUCKET}/static --recursive

# Uploads the NextJS build to S3.
.PHONY: docker-upload-next-build
docker-upload-next-build:
	${DOCKER_RUN_AWSCLI} s3 cp ./.next/static/$(shell cat ./.next/BUILD_ID) s3://$${CC_AWS_BUCKET}/${NEXT_STATIC_DIR}/$(shell cat ./.next/BUILD_ID) \
		--recursive \
		--content-type "application/json" \
		--cache-control "public, max-age=86400"

# Uploads the NextJS static chunks to S3.
.PHONY: docker-upload-next-chunks
docker-upload-next-chunks:
	${DOCKER_RUN_AWSCLI} s3 cp ./.next/static/chunks s3://$${CC_AWS_BUCKET}/${NEXT_STATIC_DIR}/chunks \
		--recursive \
		--content-type "application/json"

# Uploads the NextJS static runtime to S3.
.PHONY: docker-upload-next-runtime
docker-upload-next-runtime:
	${DOCKER_RUN_AWSCLI} s3 cp ./.next/static/runtime s3://$${CC_AWS_BUCKET}/${NEXT_STATIC_DIR}/runtime \
		--recursive \
		--content-type "application/json"

# Uploads all the static assets to S3.
.PHONY: docker-upload-s3
docker-upload-s3: docker-pull-awscli docker-upload-static docker-upload-next-build docker-upload-next-chunks docker-upload-next-runtime

# Builds the Docker image for PM2.
# Make sure to build the yarn build first..
.PHONY: docker-build-pm2
docker-build-pm2:
	docker build -t ${PM2_IMAGE} -f deploy/Dockerfile .

.PHONY: docker-push-pm2
docker-push-pm2:
	docker push ${PM2_IMAGE}

.PHONY: docker-pull-pm2
docker-pull-pm2:
	docker pull ${PM2_IMAGE}

.PHONY: docker-compose-nginx
docker-compose-up-nginx:
	${DEPLOY_NGINX_COMMAND} ${DOCKER_COMPOSE_PM2_UP_CMD}

.PHONY: docker-compose-nginx-stop
docker-compose-nginx-stop:
	${DOCKER_COMPOSE_NGINX} stop

.PHONY: docker-compose-nginx-rm
docker-compose-nginx-rm:
	${DOCKER_COMPOSE_NGINX} rm

.PHONY: remote-upload-nginx
remote-upload-nginx:
	scp -r ./deploy/uploads ${NGINX_SERVER}:~/deploy

.PHONY: remote-deploy-nginx
remote-deploy-nginx-initial:
	ssh ${NGINX_SERVER} "${DEPLOY_NGINX_COMMAND}"

.PHONY: remote-deploy-pm2
remote-deploy-pm2:
	scp -r ./deploy/uploads ${PM2_SERVER1}:~/deploy
	ssh ${PM2_SERVER1} "docker pull ${PM2_IMAGE} && ${DOCKER_COMPOSE_PM2_UP_CMD}"
	scp -r ./deploy/uploads ${PM2_SERVER2}:~/deploy
	ssh ${PM2_SERVER2} "docker pull ${PM2_IMAGE} && ${DOCKER_COMPOSE_PM2_UP_CMD}"

.PHONY: docker-compose-pm2
docker-compose-pm2:
	${DOCKER_COMPOSE_PM2} -d --build --remove-orphans

.PHONY: docker-reload-nginx
docker-reload-nginx:
	scp -r ./deploy/uploads ${NGINX_SERVER}:~/deploy
	ssh ${NGINX_SERVER} "sh ~/deploy/uploads/nginx.sh"

# Deploy pm2 and nginx Docker containers. 
.PHONY: remote-deploy
remote-deploy-all: remote-deploy-pm2 docker-reload-nginx
