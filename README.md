# Sistemas Operativos 1 Grupo 23
## Integrantes
|Carnet|Nombre|
|:-----|:-----|
|201403552|Juan Carlos Aragón Bámaca|
|201404006|Oscar Alejandro Rodríguez Calderón|
|201403546|Josué Carlos Pérez Montenegro|
|201403532|Ever Eduardo Chicas Prado|
---

## ![Manual de usuario](https://github.com/echicasprado/SO1A_G23_Proyecto1/blob/main/images/README.md)

## Flujo

![flujo](https://github.com/echicasprado/SO1A_G23_Proyecto1/blob/main/images/flujo.png)

---
## Estructura del repositorio

``` bash
├── api
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── src
│       ├── models
│       │   └── case.js
│       ├── routes
│       │   └── routes.js
│       ├── server.js
│       └── utils
│           └── region.js
├── data_tracker
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   └── src
│       ├── App.css
│       ├── App.js
│       ├── App.test.js
│       ├── BarChart.js
│       ├── DataTable.js
│       ├── DeptosInfectados.js
│       ├── Edad.js
│       ├── FunnelChart.js
│       ├── HamburgerMenu.js
│       ├── Home.js
│       ├── index.js
│       ├── InfectadosState.js
│       ├── InfectadosTipo.js
│       ├── LastCases.js
│       ├── logo.svg
│       ├── Menu.js
│       ├── PieChart.js
│       ├── Region.js
│       ├── reportWebVitals.js
│       ├── resources
│       │   ├── img
│       │   │   ├── bottom-blur-circle.svg
│       │   │   └── top-blur-circle.svg
│       │   ├── js
│       │   │   └── SidebarData.js
│       │   └── styles
│       │       ├── barchart.css
│       │       ├── funnelChart.css
│       │       ├── index.css
│       │       ├── Navbar.css
│       │       └── showData.css
│       ├── setupTests.js
│       ├── ShowData.js
│       └── TableLastCases.js
|
├── docker-compose.yml
|
├── mensajeria
│   ├── google_pubsub
│   │   ├── docker-compose.yml
│   │   ├── publisher
│   │   │   ├── Dockerfile
│   │   │   ├── go.mod
│   │   │   ├── go.sum
│   │   │   ├── publisher.go
│   │   │   └── pubsub.key.json
│   │   └── subscriber
│   │       ├── Dockerfile
│   │       ├── go.mod
│   │       ├── go.sum
│   │       ├── pubsub.key.json
│   │       └── subscriber.go
│   ├── gRPC
│   │   ├── client
│   │   │   ├── client.go
│   │   │   ├── Dockerfile
│   │   │   ├── go.mod
│   │   │   └── go.sum
│   │   ├── docker-compose.yml
│   │   └── server
│   │       ├── Dockerfile
│   │       ├── go.mod
│   │       ├── go.sum
│   │       └── server.go
│   ├── nats
│   │   ├── docker-compose.yml
│   │   ├── publisher
│   │   │   ├── Dockerfile
│   │   │   ├── go.mod
│   │   │   ├── go.sum
│   │   │   └── main.go
│   │   └── subscribe
│   │       ├── Dockerfile
│   │       ├── go.mod
│   │       ├── go.sum
│   │       └── main.go
│   └── rabbitmq
│       ├── docker-compose.yml
│       ├── receiver
│       │   ├── Dockerfile
│       │   ├── go.mod
│       │   ├── go.sum
│       │   └── receive.go
│       └── sender
│           ├── Dockerfile
│           ├── go.mod
│           ├── go.sum
│           └── send.go
├── modulos
│   ├── cpu
│   │   ├── Makefile
│   │   └── process_info.c
│   └── memoria
│       ├── Makefile
│       └── memory_info.c
└── mongoDB
    └── Dockerfile

```
---
## API

### modelo de mongodb
```
const CaseSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    location:String,
    region:String,
    age:Number,
    infectedtype:String,
    state:String,
    type:String
}
```

### routes
- ``` /api/data ```
- ``` /api/cases/departments/top5 ```
- ``` /api/cases/regiontop ```
- ``` /api/cases/state/all ```
- ``` /api/cases/infectedtype/all ```
- ``` /api/cases/lastfive ```
- ``` /api/cases/agerange ```
- ``` /api/cpu ```
- ``` /api/memoria ```
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

---
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

---
## Mensajeria

### Google Pub/Sub

#### Publisher

##### dockerfile
```
FROM golang
WORKDIR /
COPY . .
ENV GOOGLE_APPLICATION_CREDENTIALS="./pubsub.key.json"
RUN go mod download
EXPOSE 3000
CMD ["go", "run", "publisher.go"]
```

#### Subscriber

##### dockerfile
```
FROM golang
WORKDIR /
COPY . .
CMD ["export GOOGLE_APPLICATION_CREDENTIALS='./pubsub.key.json'"]
ENV GOOGLE_APPLICATION_CREDENTIALS="./pubsub.key.json"
ENV TIMEOUT = 3600
ENV TOPIC_ID = "topic-p1"
ENV PROJECT_ID = "proyecto1-so1"
RUN go mod download
CMD ["go", "run", "subscriber.go"]
```

#### docker-compose
```
version: "3.3"
services:

  publisher:
    build: ./publisher
    restart: always
    ports:
      - "3000:3000"
    networks:
      - pubsub
  
  subscriber:
    build: ./subscriber
    restart: always
    networks:
      - pubsub

networks:
  pubsub:
    driver: "bridge"

```

##### correr docker-compose
- ```sudo docker-compose up -d```
### gRPC

#### client
```
FROM golang
WORKDIR /
COPY . .
RUN go mod download
EXPOSE 3000
CMD ["go", "run", "client.go"]
```
#### server
```
FROM golang
WORKDIR /
COPY . .
RUN go mod download
EXPOSE 50051
CMD ["go", "run", "server.go"]
```

#### docker-compose
```
version: "3.3"
services:
  grpcserver:
    build: ./server
    ports:
      - "50051:50051"
    networks:
      - grpcapp

  grpcclient:
    build: ./client
    ports:
      - "3000:3000"
    networks:
      - grpcapp

networks:
  grpcapp:
    driver: "bridge"
```
##### correr docker-compose
- ```sudo docker-compose up -d```
### nats

#### publisher
```
FROM golang

WORKDIR /

COPY . .

RUN go mod download

EXPOSE 3000

CMD ["go", "run", "main.go"]
```
#### subscribe
```
FROM golang

WORKDIR /

COPY . .

RUN go mod download

CMD ["go", "run", "main.go"]
```

#### docker-compose
```
version: "3.3"
services:
  nats:
      image : nats:latest
      ports: 
          - "4222:4222"
          - "8222:8222"
          - "6222:622"

  publisher:
      build: ./publisher
      restart: on-failure
      ports:
        - "3000:3000"
      networks:
        - NATS

  subscribe:
      build: ./subscribe
      restart: on-failure
      networks:
        - NATS
networks:
  NATS:
    driver: "bridge"
```

### rabbitmq

#### receiver
```
FROM golang

WORKDIR /

COPY . .

RUN go mod download

CMD ["go", "run", "receive.go"]
```

#### sender
```
FROM golang

WORKDIR /

COPY . .

RUN go mod download

EXPOSE 3000

CMD ["go", "run", "send.go"]
```

#### docker-compose
```
version: "3.3"
services:
  rabbitmq:
      image : rabbitmq:3-management
      ports: 
          - "5672:5672"
          - "15672:15672"

  publisher-rmq:
      build: ./sender
      restart: on-failure
      ports:
        - "80:3000"
      depends_on:
        - rabbitmq

  consumer-rmq:
      build: ./receiver
      restart: on-failure
      depends_on:
        - rabbitmq
```
---

## modulos
### cpu
```
obj-m += process_info.o

all:
		make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
		make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```
### memoria
```
obj-m += memo_201408470.o

all:
		make -C /lib/modules/$(shell uname -r)/build M=$(PWD) modules

clean:
		make -C /lib/modules/$(shell uname -r)/build M=$(PWD) clean
```
