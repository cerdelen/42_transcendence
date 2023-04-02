all:
	docker compose up

build: 
	docker compose up --build

down:
	docker compose down

re: down all
