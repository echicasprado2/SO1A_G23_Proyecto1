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