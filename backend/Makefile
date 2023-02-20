all:
	docker-compose up -d

run: all
	npm run start

dev: all
	npm run start:dev

setup:
	npm install -g npm@9.2.0
	npm add -D prisma@latest
	npm install @prisma/client
# npm add bcrypt
# npm add -D @types/bcrypt
# npm add @nestjs/jwt passport-jwt
# npm add -D @types/passport-jwt
# npm install passport-42
# npm add @nestjs/passport passport
# npx prisma generate
	npm install

# stuff for authentication
#	npm install --save @nestjs/passport passport passport-local
#	npm install --save-dev @types/passport-local
#	npm install --save @nestjs/passport passport passport-google-oauth20 dotenv
#	npm install -D @types/passport-google-oauth20
#	npm install otplib


migrate:
	npx prisma migrate dev --create-only
	npx prisma db push

studio:
	npx prisma studio 