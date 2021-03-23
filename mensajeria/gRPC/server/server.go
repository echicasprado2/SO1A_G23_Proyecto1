package main

import (
	"context"
	"encoding/json"
	"log"
	"net"
	"fmt"

	"google.golang.org/grpc"
	pb "google.golang.org/grpc/examples/helloworld/helloworld"
)

type casoJSON struct {
	Name          string `json:"name"`
	Location      string `json:"location"`
	Age           int    `json:"age"`
	InfectedType string `json:"infectedtype"`
	State         string `json:"state"`
}

var ctx = context.Background()

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
