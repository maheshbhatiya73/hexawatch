package main

import (
	"log"
	"net/http"
	"time"
	"hexawatch/src/monitor"
	"hexawatch/src/network"
	"hexawatch/src/storage"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func main() {
	http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "static/index.html")
	})
	http.HandleFunc("/ws", monitor.WebSocketHandler)
	http.HandleFunc("/logs", monitor.LogsHandler)
	http.HandleFunc("/processes", monitor.ProcessesHandler)
	http.HandleFunc("/kill", monitor.KillHandler)
	http.HandleFunc("/disk", diskWebSocketHandler)
	http.HandleFunc("/network", networkWebSocketHandler)

	log.Println("Server starting on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func diskWebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	for {
		usage, err := storage.GetDiskUsage("D:\\")
		if err != nil {
			log.Println("Error getting disk usage:", err)
			return
		}
		err = conn.WriteJSON(usage)
		if err != nil {
			log.Println("WebSocket write failed:", err)
			return
		}
		time.Sleep(5 * time.Second)
	}
}

func networkWebSocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	for {
		stats, err := network.GetNetworkStats()
		if err != nil {
			log.Println("Error getting network stats:", err)
			return
		}
		err = conn.WriteJSON(stats)
		if err != nil {
			log.Println("WebSocket write failed:", err)
			return
		}
		time.Sleep(5 * time.Second)
	}
}