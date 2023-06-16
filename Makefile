.PHONY: install
install:
	docker-compose run --rm node NODE_ENV=development yarn install --frozen-lockfile

# Builds the prodution build.
.PHONY: build
build:
	docker-compose run --rm NODE_ENV=production node yarn build

# Uploads statics to s3.
.PHONY: s3
s3: 
	docker-compose run --rm aws s3 cp ./build s3://appearances-us-east-1/_next --recursive
	docker-compose run --rm aws s3 cp ./static s3://appearances-us-east-1/static --recursive
