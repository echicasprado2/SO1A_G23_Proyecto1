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
	"runtime"
	"time"
	"bytes"
	//"encoding/json"
	"net/http"
	//"fmt"

	"github.com/nats-io/nats.go"
)

// NOTE: Can test with demo servers.
// nats-sub -s demo.nats.io <subject>
// nats-sub -s demo.nats.io:4443 <subject> (TLS version)

func usage() {
	log.Printf("Usage: nats-sub [-s server] [-creds file] [-t] <subject>\n")
	flag.PrintDefaults()
}

func showUsageAndExit(exitcode int) {
	usage()
	os.Exit(exitcode)
}

func printMsg(m *nats.Msg, i int) {
	log.Printf("[#%d] Received on [%s]: '%s'", i, m.Subject, string(m.Data))
}

type Case struct {
	name string
	location string
	age string
	infectedtype string
    state string
  }

func main() {
	var urls = flag.String("s", "demo.nats.io", "The nats server URLs (separated by comma)")
	var userCreds = flag.String("creds", "", "User Credentials File")
	var showTime = flag.Bool("t", false, "Display timestamps")
	var showHelp = flag.Bool("h", false, "Show help message")

	log.SetFlags(0)
	flag.Usage = usage
	flag.Parse()

	if *showHelp {
		showUsageAndExit(0)
	}

	/*args := flag.Args()
	if len(args) != 1 {
		showUsageAndExit(1)
	}*/

	// Connect Options.
	opts := []nats.Option{nats.Name("NATS Sample Subscriber")}
	opts = setupConnOptions(opts)

	// Use UserCredentials
	if *userCreds != "" {
		opts = append(opts, nats.UserCredentials(*userCreds))
	}

	// Connect to NATS
	nc, err := nats.Connect(*urls, opts...)
	if err != nil {
		log.Fatal(err)
	}

	subj, i := "msg.test", 0

	nc.Subscribe(subj, func(msg *nats.Msg) {
		i += 1
		printMsg(msg, i)
		
		data := []byte(string(msg.Data))
		/*var casedata Case
		json.Unmarshal([]byte(data), &casedata)
		fmt.Printf("name: %s, location: %s", casedata.name, casedata.location)
		requestBody, err := json.Marshal(map[string]string{
			"name":string(casedata.name),
			"location": casedata.location,
			"age": casedata.age,
			"infectedtype": casedata.infectedtype,
			"state": casedata.state,
			"type":"NATS",

		})*/
		/*if err != nil {
			log.Fatalln(err)
		}*/
		resp, err := http.Post("http://104.154.113.215:3001/api/data","application/json",bytes.NewBuffer(data))
		
		if err != nil {
			log.Fatalln(err)
		}

		defer resp.Body.Close()

	})
	nc.Flush()

	if err := nc.LastError(); err != nil {
		log.Fatal(err)
	}

	log.Printf("Listening on [%s]", subj)
	if *showTime {
		log.SetFlags(log.LstdFlags)
	}

	runtime.Goexit()
}

func setupConnOptions(opts []nats.Option) []nats.Option {
	totalWait := 10 * time.Minute
	reconnectDelay := time.Second

	opts = append(opts, nats.ReconnectWait(reconnectDelay))
	opts = append(opts, nats.MaxReconnects(int(totalWait/reconnectDelay)))
	opts = append(opts, nats.DisconnectErrHandler(func(nc *nats.Conn, err error) {
		log.Printf("Disconnected due to:%s, will attempt reconnects for %.0fm", err, totalWait.Minutes())
	}))
	opts = append(opts, nats.ReconnectHandler(func(nc *nats.Conn) {
		log.Printf("Reconnected [%s]", nc.ConnectedUrl())
	}))
	opts = append(opts, nats.ClosedHandler(func(nc *nats.Conn) {
		log.Fatalf("Exiting: %v", nc.LastError())
	}))
	return opts
}
