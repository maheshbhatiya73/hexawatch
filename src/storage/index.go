// src/storage/storage.go
package storage

import (
    "github.com/shirou/gopsutil/v3/disk"
)

type DiskUsage struct {
    Total   uint64  `json:"total"`
    Used    uint64  `json:"used"`
    Free    uint64  `json:"free"`
    Percent float64 `json:"percent"`
}

func GetDiskUsage(path string) (DiskUsage, error) {
    usageStat, err := disk.Usage(path)
    if err != nil {
        return DiskUsage{}, err
    }

    return DiskUsage{
        Total:   usageStat.Total,
        Used:    usageStat.Used,
        Free:    usageStat.Free,
        Percent: usageStat.UsedPercent,
    }, nil
}