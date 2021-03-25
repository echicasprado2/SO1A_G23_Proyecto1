FROM golang
WORKDIR /
COPY . .
ENV GOOGLE_APPLICATION_CREDENTIALS="./pubsub.key.json"
RUN go mod download
EXPOSE 3000
CMD ["go", "run", "publisher.go"]