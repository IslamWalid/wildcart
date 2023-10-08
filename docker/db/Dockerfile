FROM postgres:alpine

RUN echo "CREATE DATABASE wildcart" > /docker-entrypoint-initdb.d/initdb.sql

CMD ["postgres"]
