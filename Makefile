all:
	npm install -g npm@9.2.0
	npm install
	npm install @prisma/client
	npx prisma generate
	docker-compose up -d

run: all
	npm run start

dev: all
	npm run start:dev

setup:
	sh eaccess_script.sh
	npm install -g npm@9.2.0
	npm install
	npm add -D prisma@latest
	npm install @prisma/client
	npx prisma generate
	docker-compose up -d

migrate:
	npx prisma migrate dev --create-only
	npx prisma db push

studio:
	npx prisma studio