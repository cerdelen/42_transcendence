DEPENDENIES = NPM

all:
	docker compose up

build: 
	docker compose up --build

down:
	docker compose down

re: down all

$(DEPENDENIES):
	cd server; npm i; cd ../client; npm i; cd ../