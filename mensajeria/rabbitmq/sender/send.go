package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/streadway/amqp"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func newElement(w http.ResponseWriter, r *http.Request) {
	// Adding headers
	w.Header().Set("Content-Type", "application/json")
	if r.Method == "GET" {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("{\"message\": \"ok\"}"))
		return;
	}

	// Parsing body
	var body map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&body)
	failOnError(err, "Parsing JSON")
	body["way"] = "RabbitMQ"
	data, err := json.Marshal(body)

	// Connecting to server
	conn, err := amqp.Dial("amqp://guest:guest@rabbitmq:5672/")
	failOnError(err, "RabbitMQ connection")
	defer conn.Close()

	// Opening a channel
	ch, err := conn.Channel()
	failOnError(err, "New channel connection")
	defer ch.Close()

	// Declaring a new Queue
	q, err := ch.QueueDeclare(
		"labso1", // name
		false,    // durable
		false,    // delete when unused
		false,    // exclusive
		false,    // no-wait
		nil,      // arguments
	)
	failOnError(err, "Failed to declare a queue")

	// Publishing a new message
	newData := string(data)
	err = ch.Publish(
		"",     // exchange
		q.Name, // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: "text/plain",
			Body:        []byte(newData),
		})
	failOnError(err, "Failed to publish a message")
	log.Printf(" [x] Sent %s", newData)

	// Setting status and send response
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(newData))
}

func handleRequests() {
	http.HandleFunc("/", newElement)
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func main() {
	handleRequests()
}