package main

import (
	
	"fmt"
	"context"
	//"io"
	"sync"
	"log"
	"time"
	"io/ioutil"
	"net/http"
	"bytes"
	//Google pub/sub
	"cloud.google.com/go/pubsub"
)

var ctx = context.Background()

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func create(client *pubsub.Client, name string, topic *pubsub.Topic) error {
	ctx := context.Background()
	// [START pubsub_create_pull_subscription]
	sub, err := client.CreateSubscription(ctx, name, pubsub.SubscriptionConfig{
		Topic:       topic,
		AckDeadline: 20 * time.Second,
	})
	if err != nil {
		return err
	}
	fmt.Printf("Created subscription: %v\n", sub)
	// [END pubsub_create_pull_subscription]
	return nil
}


func pullMsgs(client *pubsub.Client, name string, topic *pubsub.Topic, testPublish bool) error {
	ctx := context.Background()

	if testPublish {
		// Publish 10 messages on the topic.
		var results []*pubsub.PublishResult
		for i := 0; i < 10; i++ {
			res := topic.Publish(ctx, &pubsub.Message{
				Data: []byte(fmt.Sprintf("hello world #%d", i)),
			})
			results = append(results, res)
		}

		// Check that all messages were published.
		for _, r := range results {
			_, err := r.Get(ctx)
			if err != nil {
				return err
			}
		}
	}
	var mu sync.Mutex
	received := 0
	sub := client.Subscription(name)
	cctx, cancel := context.WithCancel(ctx)
	err := sub.Receive(cctx, func(ctx context.Context, msg *pubsub.Message) {
		msg.Ack()
		fmt.Printf("Got message: %q\n", string(msg.Data))

		//***** enviar mensaje a la API
		postBody := []byte(string(msg.Data))
		req, err := http.Post("http://104.154.113.215:3001/api/data", "application/json", bytes.NewBuffer(postBody))
		req.Header.Set("Content-Type", "application/json")
		failOnError(err, "POST new document")
		defer req.Body.Close()
	
		//Read the response body
		newBody, err := ioutil.ReadAll(req.Body)
		failOnError(err, "Reading response from HTTP POST")
		sb := string(newBody)
		log.Printf(sb)
		//****
		mu.Lock()
		defer mu.Unlock()
		received++
		if received == 10 {
			cancel()
		}
	})
	if err != nil {
		return err
	}
	return nil
}


func main() {
	ctx := context.Background()
	proj := "proyecto1-so1"
	idTopic := "topic-p1"

	//Credenciales
	//jsonPath:= "./pubsub.key.json"

	client, err := pubsub.NewClient(ctx, proj)
	if err != nil {
		log.Fatalf("Could not create pubsub Client: %v", err)
	}
	sub := "data-p1"
	t := client.Topic(idTopic)

	
	// Pull messages via the subscription.
	if err := pullMsgs(client, sub, t, false); err != nil {
		log.Fatal(err)
	}
}
