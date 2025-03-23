package monitor

import (
    "encoding/json"
    "github.com/gorilla/websocket"
    "github.com/shirou/gopsutil/cpu"
    "github.com/shirou/gopsutil/mem"
    "github.com/shirou/gopsutil/process"
    "log"
    "net/http"
    "sync"
    "time"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
    CheckOrigin:     func(r *http.Request) bool { return true },
}

type SystemStats struct {
    CPU      float64 `json:"cpu"`
    RAM      float64 `json:"ram"`
    TotalRAM uint64  `json:"total_ram"`
    UsedRAM  uint64  `json:"used_ram"`
    FreeRAM  uint64  `json:"free_ram"`
}

type ProcessInfo struct {
    PID    int32   `json:"pid"`
    Name   string  `json:"name"`
    CPU    float64 `json:"cpu"`
    Memory uint64  `json:"memory"`
}

var (
    logs      []string
    logsMutex sync.Mutex
)

func getSystemStats() (SystemStats, error) {
    stats := SystemStats{}
    cpuPercent, err := cpu.Percent(time.Second, false)
    if err != nil {
        return stats, err
    }
    if len(cpuPercent) > 0 {
        stats.CPU = cpuPercent[0]
    }
    vMem, err := mem.VirtualMemory()
    if err != nil {
        return stats, err
    }
    stats.RAM = vMem.UsedPercent
    stats.TotalRAM = vMem.Total
    stats.UsedRAM = vMem.Used
    stats.FreeRAM = vMem.Free
    return stats, nil
}

func WebSocketHandler(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("WebSocket upgrade error:", err)
        return
    }
    defer conn.Close()

    for {
        stats, err := getSystemStats()
        if err != nil {
            log.Println("Error getting stats:", err)
            continue
        }
        err = conn.WriteJSON(stats)
        if err != nil {
            log.Println("WebSocket write error:", err)
            return
        }
        time.Sleep(time.Second)
    }
}

func LogsHandler(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("Logs WebSocket error:", err)
        return
    }
    defer conn.Close()

    for {
        logsMutex.Lock()
        for _, logMsg := range logs {
            conn.WriteMessage(websocket.TextMessage, []byte(logMsg))
        }
        logsMutex.Unlock()
        time.Sleep(5 * time.Second) // Adjust frequency
    }
}

func ProcessesHandler(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("Processes WebSocket error:", err)
        return
    }
    defer conn.Close()

    for {
        processes, err := process.Processes()
        if err != nil {
            log.Println("Error getting processes:", err)
            continue
        }
        var procInfos []ProcessInfo
        for _, p := range processes {
            cpu, _ := p.CPUPercent()
            mem, _ := p.MemoryInfo()
            name, _ := p.Name()
            procInfos = append(procInfos, ProcessInfo{
                PID:    p.Pid,
                Name:   name,
                CPU:    cpu,
                Memory: mem.RSS,
            })
        }
        err = conn.WriteJSON(procInfos)
        if err != nil {
            log.Println("Processes write error:", err)
            return
        }
        time.Sleep(5 * time.Second) // Adjust frequency
    }
}

func KillHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != "POST" {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }
    var data struct {
        PID int32 `json:"pid"`
    }
    if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }
    p, err := process.NewProcess(data.PID)
    if err != nil {
        http.Error(w, "Process not found", http.StatusNotFound)
        return
    }
    if err := p.Kill(); err != nil {
        http.Error(w, "Failed to kill process", http.StatusInternalServerError)
        return
    }
    logsMutex.Lock()
    logs = append(logs, time.Now().Format(time.RFC3339)+" Killed process "+string(data.PID))
    logsMutex.Unlock()
    w.Write([]byte("Process killed"))
}