// Copyright 2012-2019 The NATS Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package main

import (
	"flag"
	"log"
	"os"
	"encoding/json"
	"net/http"

	"github.com/nats-io/nats.go"
)

// NOTE: Can test with demo servers.
// nats-pub -s demo.nats.io <subject> <msg>
// nats-pub -s demo.nats.io:4443 <subject> <msg> (TLS version)

var urls = flag.String("s", "demo.nats.io", "The nats server URLs (separated by comma)")
	var userCreds = flag.String("creds", "", "User Credentials File")
	//var showHelp = flag.Bool("h", false, "Show help message")
	var reply = flag.String("reply", "", "Sets a specific reply subject")

func usage() {
	log.Printf("Usage: nats-pub [-s server] [-creds file] <subject> <msg>\n")
	flag.PrintDefaults()
}

func showUsageAndExit(exitcode int) {
	usage()
	os.Exit(exitcode)
}

func failOnError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func newMessage(w http.ResponseWriter, r *http.Request) {
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
	body["type"] = "NATS"
	data, err := json.Marshal(body)


	

	log.SetFlags(0)
	flag.Usage = usage
	flag.Parse()

	/*if *showHelp {
		showUsageAndExit(0)
	}*/

	//args := flag.Args()
	/*if len(args) != 2 {
		showUsageAndExit(1)
	}*/

	// Connect Options.
	opts := []nats.Option{nats.Name("NATS Sample Publisher")}

	// Use UserCredentials
	if *userCreds != "" {
		opts = append(opts, nats.UserCredentials(*userCreds))
	}

	// Connect to NATS
	nc, err := nats.Connect(*urls, opts...)
	if err != nil {
		log.Fatal(err)
	}
	defer nc.Close()

	subj := "msg.test"
	//msg := []byte(args[1])
	msg := string(data)
	if reply != nil && *reply != "" {
		nc.PublishRequest(subj, *reply, []byte(msg))
	} else {
		nc.Publish(subj, []byte(msg))
	}

	nc.Flush()

	if err := nc.LastError(); err != nil {
		log.Fatal(err)
	} else {
		log.Printf("Published [%s] : '%s'\n", subj, msg)
	} 



	// Setting status and send response
	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(msg))
}

func serverRequests() {
	http.HandleFunc("/", newMessage)
	log.Fatal(http.ListenAndServe(":3000", nil))
}

func main() {
	serverRequests()
	
}
