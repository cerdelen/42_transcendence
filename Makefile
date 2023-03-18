
build : 
		cd server; npm i; cd ../client; npm i; cd ../
		docker compose --file docker-compose-dev.yml up --build
		



all : 
		cd server; npm i; cd ../client; npm i; cd ../
		docker compose --file docker-compose-dev.yml up