all:
	npm install
	npm install @prisma/client
	npx prisma generate
	docker-compose up -d

run: all
	npm run start

dev: all
	npm run start:dev