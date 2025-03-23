// src/users/users.go
package users

import (
    "bufio"
    "log"
    "net/http"
    "os"
    "strings"
    "fmt"
    "time"
    "strconv" // Added for UID conversion
    "github.com/gorilla/websocket"
)

// User represents a basic user structure from /etc/passwd
type User struct {
    Username string
    UID      string
    GID      string
    HomeDir  string
    Shell    string
}

// GetAllUsers reads /etc/passwd and returns a list of actual users (UID >= 1000)
func GetAllUsers() ([]User, error) {
    file, err := os.Open("/etc/passwd")
    if err != nil {
        return nil, err
    }
    defer file.Close()

    var users []User
    scanner := bufio.NewScanner(file)
    
    for scanner.Scan() {
        line := scanner.Text()
        // Skip comments and empty lines
        if strings.HasPrefix(line, "#") || line == "" {
            continue
        }

        // Split the passwd entry (format: username:password:UID:GID:GECOS:home:shell)
        fields := strings.Split(line, ":")
        if len(fields) >= 7 {
            // Convert UID to integer for comparison
            uid, err := strconv.Atoi(fields[2])
            if err != nil {
                continue // Skip if UID isn't a valid number
            }
            // Only include users with UID >= 1000 (actual human users)
            if uid >= 1000 {
                user := User{
                    Username: fields[0],
                    UID:      fields[2],
                    GID:      fields[3],
                    HomeDir:  fields[5],
                    Shell:    fields[6],
                }
                users = append(users, user)
            }
        }
    }

    if err := scanner.Err(); err != nil {
        return nil, err
    }

    // Print formatted user list to console
    fmt.Println("Actual System Users (UID >= 1000):")
    for i, user := range users {
        fmt.Printf("%d. Username: %-15s UID: %-5s GID: %-5s Home: %-20s Shell: %s\n",
            i+1, user.Username, user.UID, user.GID, user.HomeDir, user.Shell)
    }
    fmt.Println("---")

    return users, nil
}

// WebSocketHandler for users
var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
}

func UsersWebSocketHandler(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println("WebSocket upgrade failed:", err)
        return
    }
    defer conn.Close()

    for {
        users, err := GetAllUsers()
        if err != nil {
            log.Println("Error getting users:", err)
            return
        }
        
        err = conn.WriteJSON(users)
        if err != nil {
            log.Println("WebSocket write failed:", err)
            return
        }
        time.Sleep(5 * time.Second) // Update every 5 seconds
    }
}