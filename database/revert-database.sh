export MAIN_DIR=$(pwd)
export MIGRATIONS=${MAIN_DIR}/database/revert-migrations

for file in `find ${MIGRATIONS} -type f -name "*.sql"`
do
   echo $(cat -- ${file})
   cat -- ${file} | docker exec -i postgres_ofhc_bot psql -U user ofhc-bot-db;
done