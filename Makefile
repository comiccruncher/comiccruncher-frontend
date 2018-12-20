CC_AWS_BUCKET = appearances-us-east-1

NEXT_STATIC_DIR = _next/static

NGINX_SERVER = aimee@68.183.27.114

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

S3_UPLOAD_STATIC = s3 cp ./static s3://${CC_AWS_BUCKET}/static --recursive

S3_UPLOAD_NEXT_BUILD = s3 cp ./.next/static/$(shell cat ./.next/BUILD_ID) s3://${CC_AWS_BUCKET}/${NEXT_STATIC_DIR}/$(shell cat ./.next/BUILD_ID) \
		--recursive \
		--content-type "application/json" \
		--cache-control "public, max-age=86400"
S3_UPLOAD_NEXT_CHUNKS = s3 cp ./.next/static/chunks s3://${CC_AWS_BUCKET}/${NEXT_STATIC_DIR}/chunks \
		--recursive \
		--content-type "application/json"
S3_UPLOAD_NEXT_RUNTIME = s3 cp ./.next/static/runtime s3://${CC_AWS_BUCKET}/${NEXT_STATIC_DIR}/runtime \
		--recursive \
		--content-type "application/json"

DOCKER_COMPOSE_DEV = docker-compose -f docker-compose.yml 

DOCKER_COMPOSE_BUILD = docker-compose -f docker-compose.build.yml

DOCKER_COMPOSE_BUILD_RUN = ${DOCKER_COMPOSE_BUILD} run --rm build

DOCKER_COMPOSE_AWSCLI_RUN = ${DOCKER_COMPOSE_BUILD} run --rm awscli

# Runs the dev environment.
.PHONY: docker-yarn-dev
docker-yarn-dev:
	${DOCKER_COMPOSE_DEV} up --build --remove-orphans

# Runs yarn install through the Docker container.
.PHONY: docker-yarn-install
docker-yarn-install:
	CC_NODE_ENV=development ${DOCKER_COMPOSE_BUILD_RUN} yarn install

docker-yarn-install-circleci:
	CC_NODE_ENV=development ${DOCKER_COMPOSE_BUILD_RUN} yarn install --frozen-lockfile

# Builds the prodution build.
.PHONY: docker-yarn-build
docker-yarn-build:
	${DOCKER_COMPOSE_BUILD_RUN} yarn build

# Uploads the static assets to s3.
.PHONY: docker-upload-static
docker-upload-static:
	${DOCKER_COMPOSE_AWSCLI_RUN} ${S3_UPLOAD_STATIC}

# Uploads the next build to s3.
.PHONY: docker-upload-next-build
docker-upload-next-build:
	${DOCKER_COMPOSE_AWSCLI_RUN} ${S3_UPLOAD_NEXT_BUILD}

# Uploads the next chunks to s3.
.PHONY: docker-upload-next-chunks
docker-upload-next-chunks:
	${DOCKER_COMPOSE_AWSCLI_RUN} ${S3_UPLOAD_NEXT_CHUNKS}

# Uploads the next runtime to s3.
.PHONY: docker-upload-next-runtime
docker-upload-next-runtime:
	${DOCKER_COMPOSE_AWSCLI_RUN} ${S3_UPLOAD_NEXT_RUNTIME}

# Uploads all the statics and next statics to s3.
.PHONY: docker-upload-s3
docker-upload-s3: docker-upload-static docker-upload-next-build docker-upload-next-chunks docker-upload-next-runtime

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
