all:
	npm install
	docker-compose up -d

run: all
	npm run start

dev: all
	npm run start:dev