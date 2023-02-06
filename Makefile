all:
	docker-compose up -d

run: all
	npm run start

dev: all
	npm run start:dev

#setup:
#	npm install -g npm@9.2.0
#	npm install
#	npm add -D prisma@latest
#	npm install @prisma/client
#	npm add bcrypt
#	npm add -D @types/bcrypt
#	npm add @nestjs/jwt passport-jwt
#	npm add -D @types/passport-jwt
#	npm add @nestjs/passport passport
#	npx prisma generate

migrate:
	npx prisma migrate dev --create-only
	npx prisma db push

studio:
	npx prisma studio