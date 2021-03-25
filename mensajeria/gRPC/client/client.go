package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"

	"google.golang.org/grpc"
	pb "google.golang.org/grpc/examples/helloworld/helloworld"
)

type caso struct {
	Name         string `json:"name"`
	Location     string `json:"location"`
	Age          int    `json:"age"`
	InfectedType string `json:"infectedtype"`
	State        string `json:"state"`
	Type         string `json:"type"`
}

const (
	address     = "grpcserver:50051"
	defaultName = "world"
)

func CasoNuevo(w http.ResponseWriter, r *http.Request) {

	body, err := ioutil.ReadAll(r.Body)

	if err != nil {

		panic(err)

	}

	var nuevo caso

	err = json.Unmarshal(body, &nuevo)

	if err != nil {

		panic(err)

	}

	//Variable que almacenará el nuevo caso en formato json
	var jsonstr = string(`{"name":"` + nuevo.Name + `","location":"` + nuevo.Location + `","age":` + strconv.Itoa(nuevo.Age) + `,"infectedtype":"` + nuevo.InfectedType + `","state":"` + nuevo.State + `","type":"gRPC"` + `}`)

	//Metodo gRPC

	/*
		Crea una conexión con el servidor
		grpc.WithInsecure() os permite realizar una conexión sin tener que suar SSL
	*/
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())

	if err != nil {
		log.Printf("No se conectó: %v", err)
	}

	//Realiza la desconexión al final de la ejecución
	defer conn.Close()

	//Crea un cliente con el cual podemos escuchar
	//Se envía como parametro el Dial de gRPC
	c := pb.NewGreeterClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	ra, err := c.SayHello(ctx, &pb.HelloRequest{Name: jsonstr})

	if err != nil {

		log.Printf("could not greet: %v", err)

	}
	log.Printf("Greeting: %s", ra.GetMessage())
}

func Inicio(w http.ResponseWriter, r *http.Request) {

	fmt.Fprintf(w, "Conexión exitosa...")
	log.Println("Si inicio el server")

}

//Función principal
func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", Inicio).Methods("GET")
	router.HandleFunc("/CasoNuevo", CasoNuevo).Methods("POST")
	http.ListenAndServe(":3000", router)
}
