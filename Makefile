
build : 
		docker compose --file docker-compose-dev.yml up --build

all : 
		docker compose --file docker-compose-dev.yml up