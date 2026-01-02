# Production PromQL Queries for Shiksha Middleware Service

**Service:** NestJS Middleware Service  
**Metrics Prefix:** `shiksha_middleware_`  
**Purpose:** Comprehensive production monitoring queries for Grafana dashboards and alerts

---

## 📊 Overview

This document contains production-ready PromQL queries organized by monitoring category. These queries provide detailed insights into service health, performance, errors, and system resources.

**Prerequisites:**
- Prometheus scraping `/metrics` endpoint
- Grafana configured with Prometheus data source
- All 9 observability requirements implemented (including `/metrics` exclusion fix)

---

## 🚦 Core HTTP Metrics

### Request Rate (Requests Per Second)

#### Overall Request Rate
```promql
sum(rate(shiksha_middleware_http_requests_total[5m]))
```

#### Request Rate by HTTP Method
```promql
sum by (method) (rate(shiksha_middleware_http_requests_total[5m]))
```

#### Request Rate by Route
```promql
sum by (route) (rate(shiksha_middleware_http_requests_total[5m]))
```

#### Request Rate by Method and Route (Top 10)
```promql
topk(10, sum by (method, route) (rate(shiksha_middleware_http_requests_total[5m])))
```

#### Request Rate by Status Code
```promql
sum by (status) (rate(shiksha_middleware_http_requests_total[5m]))
```

#### Request Rate by Status Class (2xx, 3xx, 4xx, 5xx)
```promql
sum by (status) (rate(shiksha_middleware_http_requests_total{status=~"2.."}[5m]))  # 2xx
sum by (status) (rate(shiksha_middleware_http_requests_total{status=~"3.."}[5m]))  # 3xx
sum by (status) (rate(shiksha_middleware_http_requests_total{status=~"4.."}[5m]))  # 4xx
sum by (status) (rate(shiksha_middleware_http_requests_total{status=~"5.."}[5m]))  # 5xx
```

---

### Error Rates

#### Total 4xx Errors (Client Errors)
```promql
sum(rate(shiksha_middleware_http_errors_total{error_type="client_error"}[5m]))
```

#### Total 5xx Errors (Server Errors)
```promql
sum(rate(shiksha_middleware_http_errors_total{error_type="server_error"}[5m]))
```

#### 4xx Error Rate by Route
```promql
sum by (route) (rate(shiksha_middleware_http_errors_total{error_type="client_error"}[5m]))
```

#### 5xx Error Rate by Route
```promql
sum by (route) (rate(shiksha_middleware_http_errors_total{error_type="server_error"}[5m]))
```

#### Error Rate by Status Code
```promql
sum by (status) (rate(shiksha_middleware_http_errors_total[5m]))
```

#### Error Rate by Method
```promql
sum by (method) (rate(shiksha_middleware_http_errors_total[5m]))
```

#### Error Percentage (Errors / Total Requests)
```promql
(sum(rate(shiksha_middleware_http_errors_total[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100
```

#### 4xx Error Percentage
```promql
(sum(rate(shiksha_middleware_http_errors_total{error_type="client_error"}[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100
```

#### 5xx Error Percentage
```promql
(sum(rate(shiksha_middleware_http_errors_total{error_type="server_error"}[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100
```

#### Error Rate by Route and Method
```promql
sum by (route, method) (rate(shiksha_middleware_http_errors_total[5m]))
```

---

### Latency Metrics

#### P50 Latency (Median)
```promql
histogram_quantile(0.50, sum by (le, method, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))
```

#### P95 Latency
```promql
histogram_quantile(0.95, sum by (le, method, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))
```

#### P99 Latency
```promql
histogram_quantile(0.99, sum by (le, method, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))
```

#### P99.9 Latency (Tail Latency)
```promql
histogram_quantile(0.999, sum by (le, method, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))
```

#### Average Latency
```promql
sum(rate(shiksha_middleware_http_request_duration_seconds_sum[5m])) / sum(rate(shiksha_middleware_http_request_duration_seconds_count[5m]))
```

#### Average Latency by Route
```promql
sum by (route) (rate(shiksha_middleware_http_request_duration_seconds_sum[5m])) / sum by (route) (rate(shiksha_middleware_http_request_duration_seconds_count[5m]))
```

#### Average Latency by HTTP Method
```promql
sum by (method) (rate(shiksha_middleware_http_request_duration_seconds_sum[5m])) / sum by (method) (rate(shiksha_middleware_http_request_duration_seconds_count[5m]))
```

#### P95 Latency by Route (Top 10 Slowest)
```promql
topk(10, histogram_quantile(0.95, sum by (le, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))))
```

#### P95 Latency by Method
```promql
histogram_quantile(0.95, sum by (le, method) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))
```

#### Requests Taking > 100ms
```promql
sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="+Inf"}[5m])) - sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="0.1"}[5m]))
```

#### Requests Taking > 500ms
```promql
sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="+Inf"}[5m])) - sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="0.5"}[5m]))
```

#### Requests Taking > 1 Second
```promql
sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="+Inf"}[5m])) - sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="1"}[5m]))
```

#### Requests Taking > 5 Seconds
```promql
sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="+Inf"}[5m])) - sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="5"}[5m]))
```

#### Requests Taking > 10 Seconds
```promql
sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="+Inf"}[5m])) - sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="10"}[5m]))
```

#### Latency Distribution (All Percentiles)
```promql
# P50
histogram_quantile(0.50, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))

# P75
histogram_quantile(0.75, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))

# P90
histogram_quantile(0.90, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))

# P95
histogram_quantile(0.95, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))

# P99
histogram_quantile(0.99, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))

# P99.9
histogram_quantile(0.999, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))
```

---

## 💾 System Resource Metrics

### Memory Metrics

#### Process Memory Usage (RSS - Resident Set Size)
```promql
shiksha_middleware_process_resident_memory_bytes
```

#### Process Memory Usage (MB)
```promql
shiksha_middleware_process_resident_memory_bytes / 1024 / 1024
```

#### Process Memory Usage (GB)
```promql
shiksha_middleware_process_resident_memory_bytes / 1024 / 1024 / 1024
```

#### Process Virtual Memory
```promql
shiksha_middleware_process_virtual_memory_bytes / 1024 / 1024
```

#### Process Heap Memory
```promql
shiksha_middleware_process_heap_bytes / 1024 / 1024
```

#### Heap Memory Used
```promql
shiksha_middleware_nodejs_heap_size_used_bytes
```

#### Heap Memory Total
```promql
shiksha_middleware_nodejs_heap_size_total_bytes
```

#### Heap Memory Usage Percentage
```promql
(shiksha_middleware_nodejs_heap_size_used_bytes / shiksha_middleware_nodejs_heap_size_total_bytes) * 100
```

#### External Memory Usage
```promql
shiksha_middleware_nodejs_external_memory_bytes / 1024 / 1024
```

#### Memory Usage Growth Rate (MB/min)
```promql
rate(shiksha_middleware_process_resident_memory_bytes[1m]) * 60 / 1024 / 1024
```

#### Memory Usage Trend (Last Hour)
```promql
shiksha_middleware_process_resident_memory_bytes[1h:1m]
```

---

### CPU Metrics

#### Process CPU Usage (User Time - Seconds)
```promql
rate(shiksha_middleware_process_cpu_user_seconds_total[5m])
```

#### Process CPU Usage (System Time - Seconds)
```promql
rate(shiksha_middleware_process_cpu_system_seconds_total[5m])
```

#### Process CPU Usage (Total - Seconds)
```promql
rate(shiksha_middleware_process_cpu_seconds_total[5m])
```

#### Process CPU Usage Percentage (User)
```promql
rate(shiksha_middleware_process_cpu_user_seconds_total[5m]) * 100
```

#### Total CPU Usage (User + System)
```promql
rate(shiksha_middleware_process_cpu_user_seconds_total[5m]) + rate(shiksha_middleware_process_cpu_system_seconds_total[5m])
```

#### CPU Usage Percentage (Total)
```promql
(rate(shiksha_middleware_process_cpu_user_seconds_total[5m]) + rate(shiksha_middleware_process_cpu_system_seconds_total[5m])) * 100
```

---

### Event Loop Metrics

#### Event Loop Lag (Current - Seconds)
```promql
shiksha_middleware_nodejs_eventloop_lag_seconds
```

#### Event Loop Lag (Current - Milliseconds)
```promql
shiksha_middleware_nodejs_eventloop_lag_seconds * 1000
```

#### Event Loop Lag (Minimum)
```promql
shiksha_middleware_nodejs_eventloop_lag_min_seconds * 1000
```

#### Event Loop Lag (Maximum)
```promql
shiksha_middleware_nodejs_eventloop_lag_max_seconds * 1000
```

#### Event Loop Lag (Mean)
```promql
shiksha_middleware_nodejs_eventloop_lag_mean_seconds * 1000
```

#### Event Loop Lag (P50)
```promql
shiksha_middleware_nodejs_eventloop_lag_p50_seconds * 1000
```

#### Event Loop Lag (P90)
```promql
shiksha_middleware_nodejs_eventloop_lag_p90_seconds * 1000
```

#### Event Loop Lag (P99)
```promql
shiksha_middleware_nodejs_eventloop_lag_p99_seconds * 1000
```

#### Average Event Loop Lag (5m)
```promql
avg_over_time(shiksha_middleware_nodejs_eventloop_lag_seconds[5m]) * 1000
```

#### Max Event Loop Lag (5m)
```promql
max_over_time(shiksha_middleware_nodejs_eventloop_lag_seconds[5m]) * 1000
```

#### Event Loop Lag > 100ms (Alert Condition)
```promql
shiksha_middleware_nodejs_eventloop_lag_seconds > 0.1
```

#### Event Loop Lag > 500ms (Critical Alert)
```promql
shiksha_middleware_nodejs_eventloop_lag_seconds > 0.5
```

---

### Garbage Collection Metrics

#### GC Duration (Total)
```promql
sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_sum[5m]))
```

#### GC Duration by Type
```promql
sum by (kind) (rate(shiksha_middleware_nodejs_gc_duration_seconds_sum[5m]))
```

#### GC Count (Total)
```promql
sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_count[5m]))
```

#### GC Count by Type
```promql
sum by (kind) (rate(shiksha_middleware_nodejs_gc_duration_seconds_count[5m]))
```

#### Average GC Duration
```promql
sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_sum[5m])) / sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_count[5m]))
```

#### GC Frequency (GCs per minute)
```promql
sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_count[5m])) * 60
```

#### GC Frequency by Type (GCs per minute)
```promql
sum by (kind) (rate(shiksha_middleware_nodejs_gc_duration_seconds_count[5m])) * 60
```

#### GC Pause Time (Total per minute)
```promql
sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_sum[5m])) * 60
```

---

### Process Metrics

#### Process Start Time
```promql
shiksha_middleware_process_start_time_seconds
```

#### Process Uptime (Seconds)
```promql
time() - shiksha_middleware_process_start_time_seconds
```

#### Process Uptime (Minutes)
```promql
(time() - shiksha_middleware_process_start_time_seconds) / 60
```

#### Process Uptime (Hours)
```promql
(time() - shiksha_middleware_process_start_time_seconds) / 3600
```

#### Process Uptime (Days)
```promql
(time() - shiksha_middleware_process_start_time_seconds) / 86400
```

#### Open File Descriptors
```promql
shiksha_middleware_process_open_fds
```

#### Max File Descriptors
```promql
shiksha_middleware_process_max_fds
```

#### File Descriptor Usage Percentage
```promql
(shiksha_middleware_process_open_fds / shiksha_middleware_process_max_fds) * 100
```

#### File Descriptor Usage (Available)
```promql
shiksha_middleware_process_max_fds - shiksha_middleware_process_open_fds
```

---

### Active Resources Metrics

#### Active Resources by Type
```promql
shiksha_middleware_nodejs_active_resources
```

#### Active Resources Count by Type
```promql
count by (type) (shiksha_middleware_nodejs_active_resources)
```

#### Total Active Resources
```promql
count(shiksha_middleware_nodejs_active_resources)
```

#### Active File System Requests
```promql
shiksha_middleware_nodejs_active_resources{type="FSReqCallback"}
```

#### Active TCP Connections
```promql
shiksha_middleware_nodejs_active_resources{type="TCPServerWrap"}
```

#### Active TTY Resources
```promql
shiksha_middleware_nodejs_active_resources{type="TTYWrap"}
```

---

## 🔍 Advanced Analytics Queries

### Request Success Rate

#### Overall Success Rate (2xx / Total)
```promql
(sum(rate(shiksha_middleware_http_requests_total{status=~"2.."}[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100
```

#### Success Rate by Route
```promql
(sum by (route) (rate(shiksha_middleware_http_requests_total{status=~"2.."}[5m])) / sum by (route) (rate(shiksha_middleware_http_requests_total[5m]))) * 100
```

#### Success Rate by Method
```promql
(sum by (method) (rate(shiksha_middleware_http_requests_total{status=~"2.."}[5m])) / sum by (method) (rate(shiksha_middleware_http_requests_total[5m]))) * 100
```

---

### Throughput Analysis

#### Requests Per Minute
```promql
sum(rate(shiksha_middleware_http_requests_total[1m])) * 60
```

#### Requests Per Hour
```promql
sum(rate(shiksha_middleware_http_requests_total[1m])) * 3600
```

#### Requests Per Day
```promql
sum(rate(shiksha_middleware_http_requests_total[1m])) * 86400
```

#### Total Requests (Last Hour)
```promql
sum(increase(shiksha_middleware_http_requests_total[1h]))
```

#### Total Requests (Last 24 Hours)
```promql
sum(increase(shiksha_middleware_http_requests_total[24h]))
```

#### Peak Request Rate (Last Hour)
```promql
max_over_time(sum(rate(shiksha_middleware_http_requests_total[5m]))[1h:1m])
```

#### Peak Request Rate (Last 24 Hours)
```promql
max_over_time(sum(rate(shiksha_middleware_http_requests_total[5m]))[24h:5m])
```

---

### Error Analysis

#### Top 10 Routes with Most Errors
```promql
topk(10, sum by (route) (rate(shiksha_middleware_http_errors_total[5m])))
```

#### Top 10 Routes with Highest Error Rate
```promql
topk(10, (sum by (route) (rate(shiksha_middleware_http_errors_total[5m])) / sum by (route) (rate(shiksha_middleware_http_requests_total[5m]))) * 100)
```

#### Top 10 Methods with Most Errors
```promql
topk(10, sum by (method) (rate(shiksha_middleware_http_errors_total[5m])))
```

#### Error Rate Trend (Last 1 Hour)
```promql
sum(rate(shiksha_middleware_http_errors_total[5m]))[1h:1m]
```

#### Error Rate Trend (Last 24 Hours)
```promql
sum(rate(shiksha_middleware_http_errors_total[5m]))[24h:5m]
```

#### Errors by Status Code (Last Hour)
```promql
sum by (status) (increase(shiksha_middleware_http_errors_total[1h]))
```

---

### Performance Analysis

#### Slowest Routes (P95 > 1s)
```promql
histogram_quantile(0.95, sum by (le, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))) > 1
```

#### Slowest Routes (P99 > 5s)
```promql
histogram_quantile(0.99, sum by (le, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))) > 5
```

#### Routes with Degrading Performance (P95 increasing)
```promql
increase(histogram_quantile(0.95, sum by (le, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))[1h:5m])
```

#### Latency Distribution by Route
```promql
# P50
histogram_quantile(0.50, sum by (le, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))

# P95
histogram_quantile(0.95, sum by (le, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))

# P99
histogram_quantile(0.99, sum by (le, route) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))
```

#### Latency Distribution by Method
```promql
# P50
histogram_quantile(0.50, sum by (le, method) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))

# P95
histogram_quantile(0.95, sum by (le, method) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))

# P99
histogram_quantile(0.99, sum by (le, method) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))
```

---

## 🚨 Critical Alert Queries

### High Error Rate Alert
```promql
(sum(rate(shiksha_middleware_http_errors_total[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100 > 5
```
**Alert when:** Error rate exceeds 5%

### High 5xx Error Rate Alert
```promql
(sum(rate(shiksha_middleware_http_errors_total{error_type="server_error"}[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100 > 1
```
**Alert when:** 5xx error rate exceeds 1%

### High 4xx Error Rate Alert
```promql
(sum(rate(shiksha_middleware_http_errors_total{error_type="client_error"}[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100 > 10
```
**Alert when:** 4xx error rate exceeds 10%

### High Latency Alert (P95)
```promql
histogram_quantile(0.95, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))) > 2
```
**Alert when:** P95 latency exceeds 2 seconds

### Very High Latency Alert (P99)
```promql
histogram_quantile(0.99, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))) > 5
```
**Alert when:** P99 latency exceeds 5 seconds

### Critical Latency Alert (P99.9)
```promql
histogram_quantile(0.999, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))) > 10
```
**Alert when:** P99.9 latency exceeds 10 seconds

### High Memory Usage Alert
```promql
(shiksha_middleware_nodejs_heap_size_used_bytes / shiksha_middleware_nodejs_heap_size_total_bytes) * 100 > 90
```
**Alert when:** Heap memory usage exceeds 90%

### Critical Memory Usage Alert
```promql
(shiksha_middleware_nodejs_heap_size_used_bytes / shiksha_middleware_nodejs_heap_size_total_bytes) * 100 > 95
```
**Alert when:** Heap memory usage exceeds 95%

### High Event Loop Lag Alert
```promql
shiksha_middleware_nodejs_eventloop_lag_seconds > 0.1
```
**Alert when:** Event loop lag exceeds 100ms

### Critical Event Loop Lag Alert
```promql
shiksha_middleware_nodejs_eventloop_lag_seconds > 0.5
```
**Alert when:** Event loop lag exceeds 500ms

### High CPU Usage Alert
```promql
(rate(shiksha_middleware_process_cpu_user_seconds_total[5m]) + rate(shiksha_middleware_process_cpu_system_seconds_total[5m])) * 100 > 80
```
**Alert when:** CPU usage exceeds 80%

### Critical CPU Usage Alert
```promql
(rate(shiksha_middleware_process_cpu_user_seconds_total[5m]) + rate(shiksha_middleware_process_cpu_system_seconds_total[5m])) * 100 > 95
```
**Alert when:** CPU usage exceeds 95%

### Service Down Alert
```promql
up{job="shiksha-middleware"} == 0
```
**Alert when:** Service is not responding to Prometheus scrapes

### High Request Rate Alert
```promql
sum(rate(shiksha_middleware_http_requests_total[5m])) > 1000
```
**Alert when:** Request rate exceeds 1000 req/s (adjust threshold as needed)

### File Descriptor Exhaustion Alert
```promql
(shiksha_middleware_process_open_fds / shiksha_middleware_process_max_fds) * 100 > 80
```
**Alert when:** File descriptor usage exceeds 80%

### Critical File Descriptor Alert
```promql
(shiksha_middleware_process_open_fds / shiksha_middleware_process_max_fds) * 100 > 95
```
**Alert when:** File descriptor usage exceeds 95%

### High GC Frequency Alert
```promql
sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_count[5m])) * 60 > 100
```
**Alert when:** GC frequency exceeds 100 GCs per minute

### High GC Duration Alert
```promql
sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_sum[5m])) > 0.1
```
**Alert when:** Total GC duration exceeds 100ms per second

---

## 📈 Grafana Dashboard Panel Recommendations

### Panel 1: Request Rate (Graph)
- **Query:** `sum(rate(shiksha_middleware_http_requests_total[5m]))`
- **Legend:** Requests/sec
- **Y-axis:** Rate (req/s)
- **Type:** Time series

### Panel 2: Error Rate (Graph)
- **Query:** `sum(rate(shiksha_middleware_http_errors_total[5m]))`
- **Legend:** Errors/sec
- **Y-axis:** Rate (errors/s)
- **Type:** Time series

### Panel 3: Error Rate by Type (Stacked Graph)
- **Queries:**
  - 4xx: `sum(rate(shiksha_middleware_http_errors_total{error_type="client_error"}[5m]))`
  - 5xx: `sum(rate(shiksha_middleware_http_errors_total{error_type="server_error"}[5m]))`
- **Type:** Stacked time series

### Panel 4: Latency Percentiles (Graph)
- **Queries:**
  - P50: `histogram_quantile(0.50, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))`
  - P95: `histogram_quantile(0.95, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))`
  - P99: `histogram_quantile(0.99, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m])))`
- **Y-axis:** Seconds
- **Type:** Time series

### Panel 5: Error Percentage (Gauge)
- **Query:** `(sum(rate(shiksha_middleware_http_errors_total[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100`
- **Unit:** Percent (0-100)
- **Thresholds:** Green: 0-1%, Yellow: 1-5%, Red: >5%
- **Type:** Gauge

### Panel 6: Top Routes by Request Rate (Table)
- **Query:** `topk(10, sum by (route) (rate(shiksha_middleware_http_requests_total[5m])))`
- **Sort:** Descending
- **Type:** Table

### Panel 7: Top Routes by Error Rate (Table)
- **Query:** `topk(10, sum by (route) (rate(shiksha_middleware_http_errors_total[5m])))`
- **Sort:** Descending
- **Type:** Table

### Panel 8: Memory Usage (Graph)
- **Queries:**
  - Heap Used: `shiksha_middleware_nodejs_heap_size_used_bytes / 1024 / 1024`
  - Heap Total: `shiksha_middleware_nodejs_heap_size_total_bytes / 1024 / 1024`
  - RSS: `shiksha_middleware_process_resident_memory_bytes / 1024 / 1024`
- **Y-axis:** MB
- **Type:** Time series

### Panel 9: Memory Usage Percentage (Gauge)
- **Query:** `(shiksha_middleware_nodejs_heap_size_used_bytes / shiksha_middleware_nodejs_heap_size_total_bytes) * 100`
- **Unit:** Percent
- **Thresholds:** Green: 0-70%, Yellow: 70-90%, Red: >90%
- **Type:** Gauge

### Panel 10: CPU Usage (Graph)
- **Query:** `(rate(shiksha_middleware_process_cpu_user_seconds_total[5m]) + rate(shiksha_middleware_process_cpu_system_seconds_total[5m])) * 100`
- **Y-axis:** Percent
- **Type:** Time series

### Panel 11: Event Loop Lag (Graph)
- **Query:** `shiksha_middleware_nodejs_eventloop_lag_seconds * 1000`
- **Y-axis:** Milliseconds
- **Type:** Time series

### Panel 12: Event Loop Lag Percentiles (Graph)
- **Queries:**
  - Current: `shiksha_middleware_nodejs_eventloop_lag_seconds * 1000`
  - P50: `shiksha_middleware_nodejs_eventloop_lag_p50_seconds * 1000`
  - P90: `shiksha_middleware_nodejs_eventloop_lag_p90_seconds * 1000`
  - P99: `shiksha_middleware_nodejs_eventloop_lag_p99_seconds * 1000`
- **Y-axis:** Milliseconds
- **Type:** Time series

### Panel 13: GC Duration (Graph)
- **Query:** `sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_sum[5m]))`
- **Y-axis:** Seconds
- **Type:** Time series

### Panel 14: GC Frequency (Graph)
- **Query:** `sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_count[5m])) * 60`
- **Y-axis:** GCs per minute
- **Type:** Time series

### Panel 15: Service Uptime (Stat)
- **Query:** `(time() - shiksha_middleware_process_start_time_seconds) / 3600`
- **Unit:** Hours
- **Type:** Stat

### Panel 16: File Descriptors (Graph)
- **Queries:**
  - Open: `shiksha_middleware_process_open_fds`
  - Max: `shiksha_middleware_process_max_fds`
  - Available: `shiksha_middleware_process_max_fds - shiksha_middleware_process_open_fds`
- **Type:** Time series

### Panel 17: Active Resources (Table)
- **Query:** `count by (type) (shiksha_middleware_nodejs_active_resources)`
- **Type:** Table

### Panel 18: Request Status Distribution (Pie Chart)
- **Query:** `sum by (status) (rate(shiksha_middleware_http_requests_total[5m]))`
- **Type:** Pie chart

### Panel 19: Request Method Distribution (Pie Chart)
- **Query:** `sum by (method) (rate(shiksha_middleware_http_requests_total[5m]))`
- **Type:** Pie chart

### Panel 20: Slow Requests (>1s) Rate
- **Query:** `sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="+Inf"}[5m])) - sum(rate(shiksha_middleware_http_request_duration_seconds_bucket{le="1"}[5m]))`
- **Y-axis:** Requests/sec
- **Type:** Time series

---

## 🔧 Prometheus Alert Rules Configuration

Create a file `alerts.yml` in your Prometheus configuration:

```yaml
groups:
  - name: shiksha_middleware_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: (sum(rate(shiksha_middleware_http_errors_total[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100 > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }}% (threshold: 5%)"

      - alert: High5xxErrorRate
        expr: (sum(rate(shiksha_middleware_http_errors_total{error_type="server_error"}[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100 > 1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High 5xx error rate"
          description: "5xx error rate is {{ $value }}% (threshold: 1%)"

      - alert: High4xxErrorRate
        expr: (sum(rate(shiksha_middleware_http_errors_total{error_type="client_error"}[5m])) / sum(rate(shiksha_middleware_http_requests_total[5m]))) * 100 > 10
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High 4xx error rate"
          description: "4xx error rate is {{ $value }}% (threshold: 10%)"

      - alert: HighLatencyP95
        expr: histogram_quantile(0.95, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High P95 latency"
          description: "P95 latency is {{ $value }}s (threshold: 2s)"

      - alert: HighLatencyP99
        expr: histogram_quantile(0.99, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))) > 5
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High P99 latency"
          description: "P99 latency is {{ $value }}s (threshold: 5s)"

      - alert: CriticalLatencyP999
        expr: histogram_quantile(0.999, sum by (le) (rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))) > 10
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Critical P99.9 latency"
          description: "P99.9 latency is {{ $value }}s (threshold: 10s)"

      - alert: HighMemoryUsage
        expr: (shiksha_middleware_nodejs_heap_size_used_bytes / shiksha_middleware_nodejs_heap_size_total_bytes) * 100 > 90
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Heap memory usage is {{ $value }}% (threshold: 90%)"

      - alert: CriticalMemoryUsage
        expr: (shiksha_middleware_nodejs_heap_size_used_bytes / shiksha_middleware_nodejs_heap_size_total_bytes) * 100 > 95
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Critical memory usage"
          description: "Heap memory usage is {{ $value }}% (threshold: 95%)"

      - alert: HighEventLoopLag
        expr: shiksha_middleware_nodejs_eventloop_lag_seconds > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High event loop lag"
          description: "Event loop lag is {{ $value }}s (threshold: 100ms)"

      - alert: CriticalEventLoopLag
        expr: shiksha_middleware_nodejs_eventloop_lag_seconds > 0.5
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Critical event loop lag"
          description: "Event loop lag is {{ $value }}s (threshold: 500ms)"

      - alert: HighCPUUsage
        expr: (rate(shiksha_middleware_process_cpu_user_seconds_total[5m]) + rate(shiksha_middleware_process_cpu_system_seconds_total[5m])) * 100 > 80
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is {{ $value }}% (threshold: 80%)"

      - alert: CriticalCPUUsage
        expr: (rate(shiksha_middleware_process_cpu_user_seconds_total[5m]) + rate(shiksha_middleware_process_cpu_system_seconds_total[5m])) * 100 > 95
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Critical CPU usage"
          description: "CPU usage is {{ $value }}% (threshold: 95%)"

      - alert: ServiceDown
        expr: up{job="shiksha-middleware"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
          description: "Shiksha middleware service is not responding to Prometheus scrapes"

      - alert: HighRequestRate
        expr: sum(rate(shiksha_middleware_http_requests_total[5m])) > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High request rate"
          description: "Request rate is {{ $value }} req/s (threshold: 1000 req/s)"

      - alert: FileDescriptorExhaustion
        expr: (shiksha_middleware_process_open_fds / shiksha_middleware_process_max_fds) * 100 > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High file descriptor usage"
          description: "File descriptor usage is {{ $value }}% (threshold: 80%)"

      - alert: CriticalFileDescriptorExhaustion
        expr: (shiksha_middleware_process_open_fds / shiksha_middleware_process_max_fds) * 100 > 95
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Critical file descriptor usage"
          description: "File descriptor usage is {{ $value }}% (threshold: 95%)"

      - alert: HighGCFrequency
        expr: sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_count[5m])) * 60 > 100
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High GC frequency"
          description: "GC frequency is {{ $value }} GCs/min (threshold: 100 GCs/min)"

      - alert: HighGCDuration
        expr: sum(rate(shiksha_middleware_nodejs_gc_duration_seconds_sum[5m])) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High GC duration"
          description: "Total GC duration is {{ $value }}s/sec (threshold: 0.1s/sec)"
```

---

## 📝 Notes

1. **Time Ranges:** All queries use `[5m]` rate window by default. Adjust based on your scrape interval:
   - Scrape interval 15s → use `[5m]` or `[1m]`
   - Scrape interval 30s → use `[5m]` or `[2m]`
   - General rule: rate window should be 4-5x the scrape interval

2. **Metric Names:** All metrics use the prefix `shiksha_middleware_`. Verify this matches your actual metric prefix.

3. **Alert Thresholds:** Adjust alert thresholds based on your service's normal operating parameters and SLOs.

4. **Performance:** For high-cardinality queries (e.g., by route), consider using `topk()` to limit results and improve query performance.

5. **Dashboard Refresh:** Set Grafana dashboard refresh interval to match your Prometheus scrape interval for real-time monitoring.

6. **Query Optimization:** 
   - Use `topk()` to limit results in high-cardinality queries
   - Use `sum()` to aggregate when you don't need per-label breakdowns
   - Consider using recording rules for frequently used queries

7. **Missing Metrics:** If a query returns "no data", verify:
   - The metric name is correct
   - The metric has been collected (check `/metrics` endpoint)
   - The time range includes data
   - Prometheus is scraping the service

---

## ✅ Verification Checklist

- [x] All HTTP request metrics covered
- [x] All error metrics covered
- [x] All latency metrics covered
- [x] All system resource metrics covered
- [x] All Node.js specific metrics covered
- [x] Alert queries provided
- [x] Grafana panel recommendations included
- [x] Prometheus alert rules configuration provided
- [x] Event loop lag metrics included
- [x] GC metrics included
- [x] Active resources metrics included
- [x] File descriptor metrics included
- [x] Process uptime metrics included

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-29  
**Service:** Shiksha Middleware Service  
**Status:** ✅ Production-Ready

