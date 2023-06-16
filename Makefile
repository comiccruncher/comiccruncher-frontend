.PHONY: install
install:
	docker-compose run -e NODE_ENV=development --rm node yarn install --frozen-lockfile

.PHONY: install-production
install-production:
	docker-compose run -e NODE_ENV=production --rm node yarn install --frozen-lockfile --production=true

# Builds the prodution build.
.PHONY: build
build:
	docker-compose run -e NODE_ENV=production --rm node yarn build

# Uploads statics to s3.
.PHONY: s3
s3: 
	docker-compose run --rm aws s3 cp ./build s3://appearances-us-east-1/_next --recursive
	docker-compose run --rm aws s3 cp ./static s3://appearances-us-east-1/static --recursive
