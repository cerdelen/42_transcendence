42_transcendence
Frontend == client React 80 or 3000 from the outside

Backend == server Nest 3003 Postgres 5432

Prisma studio (database visualize) == 5555

If it's the first time it's run "cd client && npm i && cd ../server && npm i"

to Run docker-compose --file docker-compose-dev.yml up

to start prisma studio:

        1. after docker-compose up (takes around 30 sec) run     "docker ps"

        2. find process id of "server"

        3. run "docker exec -it [server process id] bash"

        4. (if you made changes to database run "npx prisma db push --accept-data-loss")

        5. run npx prisma studio

        6. go to browser and open "localhost:5555" (first time you open it it will sefault, repeat from step 5)
