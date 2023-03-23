DEPENDENIES = NPM

all: $(DEPENDENIES)
	docker compose --file docker-compose-dev.yml up

build: $(DEPENDENIES)
	docker compose --file docker-compose-dev.yml up --build

down:
	docker compose --file docker-compose-dev.yml down

$(DEPENDENIES):
	cd server; npm i; cd ../client; npm i; cd ../