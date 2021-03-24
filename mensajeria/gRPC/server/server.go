package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"

	"google.golang.org/grpc"
	pb "google.golang.org/grpc/examples/helloworld/helloworld"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

type casoJSON struct {
	Name         string `json:"name"`
	Location     string `json:"location"`
	Age          int    `json:"age"`
	InfectedType string `json:"infectedtype"`
	State        string `json:"state"`
	Type         string `json:"type"`
}

//var ctx = context.Background()

const (
	port = ":50051"
)

// server is used to implement helloworld.GreeterServer.
type server struct {
	pb.UnimplementedGreeterServer
}

// SayHello implements helloworld.GreeterServer
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	log.Printf("Received: %v", in.GetName())

	//************************************************************MONGO
	//Toma el json y lo deserealiza
	data := in.GetName()
	info := casoJSON{}
	json.Unmarshal([]byte(data), &info)
	log.Printf("----- Recibido: %v", info.Name)

	postBody := []byte(string(data))
	req, err := http.Post("http://104.154.113.215:3001/api/data", "application/json", bytes.NewBuffer(postBody))
	req.Header.Set("Content-Type", "application/json")
	failOnError(err, "POST new document")
	defer req.Body.Close()

	//Read the response body
	newBody, err := ioutil.ReadAll(req.Body)
	failOnError(err, "Reading response from HTTP POST")
	sb := string(newBody)
	log.Printf(sb)

	return &pb.HelloReply{Message: "Hello " + in.GetName()}, nil
}

func main() {

	lis, err := net.Listen("tcp", port)

	if err != nil {
		log.Printf("Falló al escuchar: %v", err)
	}

	s := grpc.NewServer()

	pb.RegisterGreeterServer(s, &server{})

	fmt.Println(">> SERVER: El servidor está escuchando...")

	if err := s.Serve(lis); err != nil {
		log.Printf("Falló el servidor: %v", err)
	}
}
