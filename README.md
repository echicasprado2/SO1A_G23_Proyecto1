# Sistemas Operativos 1 Grupo 23 

![Alt text](https://github.com/echicasprado/SO1A_G23_Proyecto1/images/main/flujo.png)
## API

### Dockerfile
```
FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm","start"]
```
#### Crear imagen
Para crear la imagen la subimos a docker hub, para luego agregar la imagen al docker-compose, y que este fuera a traerla a docker hub

- ``` sudo docker build -t servernodejs . ```
- ``` sudo docker tag servernodejs everchicas/servernodejs ```
- ``` sudo docker push everchicas/servernodejs ```
## Mongo DB

### Dockerfile
`FROM mongo:latest`

## Levantar servidor Nodejs y mongodb

### docker-compose
```
version: "3.9"
services:
  server:
    container_name: serverNodejs
    image: everchicas/servernodejs
    ports:
      - 3001:3001
    volumes:
      - /proc:/proc
    networks:
      - networkapi
    # links:
    #   - mongodb

  mongodb:
    image: mongo
    container_name: mongodb
    environment:
      - PUID=1000
      - PGID=1000
    ports:
      - 27017:27017
    volumes:
      - db-data:/data/db
    networks:
      - networkapi

volumes:
  db-data:
    driver: local

networks:
  networkapi: 
    driver: bridge
```

### correr docker-compose
- ```sudo docker-compose up -d```

## APP React

### dockerfile
```
FROM node:12.16.3-alpine as build

WORKDIR /app

COPY . ./

# ---
FROM fholzer/nginx-brotli:v1.12.2

WORKDIR /etc/nginx
ADD nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### correr app
```npm start```

## Mensajeria

### Google Pub/Sub

### gRPC

### nats

### rabbitmq

## modulos


