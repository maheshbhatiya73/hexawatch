package storage

import (
	"errors"
	"runtime"

	"golang.org/x/sys/windows"
)

type DiskUsage struct {
	Total   uint64  `json:"total"`
	Used    uint64  `json:"used"`
	Free    uint64  `json:"free"`
	Percent float64 `json:"percent"`
}

var ErrNotImplemented = errors.New("disk usage not implemented for this platform")

func GetDiskUsage(path string) (DiskUsage, error) {
	if runtime.GOOS != "windows" {
		return DiskUsage{}, ErrNotImplemented
	}

	var freeBytes, totalBytes, totalFreeBytes uint64
	err := windows.GetDiskFreeSpaceEx(
		windows.StringToUTF16Ptr(path),
		&freeBytes,
		&totalBytes,
		&totalFreeBytes,
	)
	if err != nil {
		return DiskUsage{}, err
	}

	used := totalBytes - freeBytes
	percent := float64(used) / float64(totalBytes) * 100

	return DiskUsage{
		Total:   totalBytes,
		Used:    used,
		Free:    freeBytes,
		Percent: percent,
	}, nil
}