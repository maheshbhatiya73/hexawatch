package network

import (
	"time"
	"github.com/shirou/gopsutil/v3/net"
)

// NetworkStats holds network usage statistics
type NetworkStats struct {
	Upload       uint64 `json:"upload"`        // Bytes per second
	Download     uint64 `json:"download"`      // Bytes per second
	TotalSent     uint64 `json:"total_sent"`     // Total bytes sent
	TotalReceived uint64 `json:"total_received"` // Total bytes received
}

// GetNetworkStats retrieves network usage stats
func GetNetworkStats() (NetworkStats, error) {
	// Get initial counters
	counters1, err := net.IOCounters(false) // false = aggregate all interfaces
	if err != nil {
		return NetworkStats{}, err
	}
	time.Sleep(1 * time.Second) // Wait 1 second to calculate speed
	counters2, err := net.IOCounters(false)
	if err != nil {
		return NetworkStats{}, err
	}

	// Calculate speeds (bytes per second)
	uploadSpeed := counters2[0].BytesSent - counters1[0].BytesSent
	downloadSpeed := counters2[0].BytesRecv - counters1[0].BytesRecv

	return NetworkStats{
		Upload:        uploadSpeed,
		Download:      downloadSpeed,
		TotalSent:     counters2[0].BytesSent,
		TotalReceived: counters2[0].BytesRecv,
	}, nil
}