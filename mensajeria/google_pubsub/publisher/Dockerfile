FROM golang
WORKDIR /
COPY . .
ENV GOOGLE_APLICACION_CREDENTIALS = "./pubsub.key.json"
RUN go mod download
EXPOSE 5001
CMD ["go", "run", "publiser.go"]