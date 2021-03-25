package main

import (
	"context"
	"fmt"
	"os"
	"log"
	"net/http" //Libreria para peticiones GET Y POST
	"encoding/json" 
	"github.com/joho/godotenv"
	"io/ioutil"
	//Google pub/sub
	"cloud.google.com/go/pubsub"
	"strconv"
)

//Funcion para obtener variables de entorno
func EnvVar(key string) string {

	err:= godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Error al cargar variables de entonrno")
	}

	return os.Getenv(key)
}

//estructura del mensaje
type Message struct {
	Name string `json: "name"`
	Location string `json: "location"`
	Age int `json: "age"`
	Infectedtype string `json: "infectedtype"`
	State string `json: "state"`
}

func publicar(mensaje string) error {
	//variables 
	idProyecto := "proyecto1-so1"
	idTopic := "topic-p1"

	contexto := context.Background()

	//se crea un nuevo cliente
	cliente, err := pubsub.NewClient(contexto,idProyecto)
	if err != nil {
		fmt.Println("ERROR**")
		fmt.Println("pubsub.NewClient: %v", err)
		return fmt.Errorf("pubsub.NewClient: %v", err)
	}

	topic := cliente.Topic(idTopic)

	result := topic.Publish(contexto, &pubsub.Message { Data: []byte(mensaje), })

	id, err := result.Get(contexto)
	if err != nil {
		fmt.Println("ERROR --")
		fmt.Println(err)
		return fmt.Errorf("Error: %v", err)
	}

	//si no hay errores el mensaje se publica correctamente
	fmt.Println("Se publico el mensaje con id %v \n", id)
	return nil
}


//Servidor para peticiones get y post de los mensajes
func http_server(w http.ResponseWriter, r *http.Request) {
	r.Header.Set("Accept", "application/json")
	// Comprobamos que el path sea exactamente '/' sin parámetros
    if r.URL.Path != "/pubsub" {
        http.Error(w, "404 not found.", http.StatusNotFound)
        return
    }
	
	// Comprobamos el tipo de peticion HTTP
    switch r.Method {
		
		// Publicar un mensaje a Google PubSub
		case "POST":
			// Si existe un error con la forma enviada entonces no seguir
			if err := r.ParseForm(); err != nil {
				fmt.Fprintf(w, "ParseForm() err: %v", err)
				return
			}

			bodyBytes, err := ioutil.ReadAll(r.Body)
			if err != nil {
				log.Fatal(err)
			}

			var data Message
    		err = json.Unmarshal(bodyBytes, &data)
			msg := string(`{"name":"`+data.Name+`", "location":"`+data.Location+`", "age":`+strconv.Itoa(data.Age)+
							`, "infectedtype":"`+data.Infectedtype+`", "state":"`+data.State+`", "type":"google pub/sub"}`)
			fmt.Println(msg)
			// Publicar el mensaje, convertimos el objeto JSON a String
			publicar(msg)

			// Enviamos informacion de vuelta, indicando que fue generada la peticion
			fmt.Fprintf(w, "¡Mensaje Publicado!\n")
			fmt.Fprintln(w, msg)
		
		// Cualquier otro metodo no sera soportado
		default:
			fmt.Fprintf(w, "Metodo %s no soportado \n", r.Method)
			return
    }
}

func main() {

	fmt.Println("Server Google PubSub iniciado")

	// Asignar la funcion que controlara las llamadas http
	http.HandleFunc("/pubsub", http_server)

	// Obtener el puerto al cual conectarse desde una variable de ambiente
	http_port := ":3000" 
	
	// Levantar el server, si existe un error levantandolo hay que apagarlo
    if err := http.ListenAndServe(http_port, nil); err != nil {
        log.Fatal(err)
    }
}