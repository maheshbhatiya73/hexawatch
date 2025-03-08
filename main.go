package main

import (
    "log"
    "net/http"
    "hexawatch/src/monitor"
)

func main() {
    http.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("static"))))
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        http.ServeFile(w, r, "static/index.html")
    })
    http.HandleFunc("/ws", monitor.WebSocketHandler)
    http.HandleFunc("/logs", monitor.LogsHandler)
    http.HandleFunc("/processes", monitor.ProcessesHandler)
    http.HandleFunc("/kill", monitor.KillHandler)

    log.Println("Server starting on :8080...")
    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}