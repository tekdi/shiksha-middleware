# Prometheus & Grafana Integration for Shiksha Middleware

This document describes the Prometheus metrics and Grafana visualization setup for the Shiksha Middleware service.

## Table of Contents

1. [Overview](#overview)
2. [What Was Implemented](#what-was-implemented)
3. [Installation](#installation)
4. [Running the Service](#running-the-service)
5. [Setting Up Prometheus and Grafana](#setting-up-prometheus-and-grafana)
6. [Testing the Metrics Endpoint](#testing-the-metrics-endpoint)
7. [Accessing Grafana Dashboards](#accessing-grafana-dashboards)
8. [PromQL Query Examples](#promql-query-examples)
9. [Architecture](#architecture)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This implementation adds comprehensive application-level logging and metrics using:
- **Prometheus**: For metrics collection and storage
- **Grafana**: For metrics visualization and dashboards
- **prom-client**: Node.js library for exposing Prometheus metrics

The middleware captures request-level data including HTTP method, route, response status, request duration, and error counts.

---

## What Was Implemented

### 1. Metrics Service (`src/common/metrics/metrics.service.ts`)
- Registers Prometheus metrics using `prom-client`
- Manages three main metric types:
  - **Counter**: `shiksha_middleware_http_requests_total` - Total HTTP requests
  - **Counter**: `shiksha_middleware_http_errors_total` - Total HTTP errors (4xx, 5xx)
  - **Histogram**: `shiksha_middleware_http_request_duration_seconds` - Request latency distribution
- Normalizes routes to avoid high-cardinality labels (e.g., `/api/users/123` → `/api/users/:id`)
- Includes default Node.js metrics (CPU, memory, etc.)

### 2. Metrics Middleware (`src/common/metrics/metrics.middleware.ts`)
- Captures request data for every HTTP request:
  - HTTP method (GET, POST, PUT, DELETE, etc.)
  - Normalized route/URL
  - Response status code
  - Request duration (latency in seconds)
  - Error classification (client_error, server_error)
- Applied globally to all routes
- Minimal performance overhead

### 3. Metrics Controller (`src/common/metrics/metrics.controller.ts`)
- Exposes `/metrics` endpoint for Prometheus scraping
- Returns metrics in Prometheus text format
- Content-Type: `text/plain; version=0.0.4; charset=utf-8`

### 4. Metrics Module (`src/common/metrics/metrics.module.ts`)
- NestJS module that wires everything together
- Exports `MetricsService` for potential use in other modules

### 5. Configuration Files
- **prometheus.yml**: Prometheus server configuration
- **docker-compose.monitoring.yml**: Docker Compose file for Prometheus and Grafana
- **grafana/provisioning/**: Auto-provisioned Grafana datasources and dashboards

### 6. Integration
- Updated `app.module.ts` to include `MetricsModule`
- Added `MetricsMiddleware` to the middleware chain
- Updated `package.json` to include `prom-client` dependency

---

## Installation

### Step 1: Install Dependencies

```bash
cd shiksha-middleware
npm install
```

This will install `prom-client` along with other dependencies.

**Note**: If you see a TypeScript error `Cannot find module 'prom-client'`, make sure you've run `npm install` to install the dependency.

### Step 2: Verify Installation

Check that `prom-client` is installed:

```bash
npm list prom-client
```

You should see `prom-client@^15.1.0` (or similar version) in the output.

If it's not installed, install it explicitly:

```bash
npm install prom-client
```

---

## Running the Service

### Development Mode

```bash
npm run start:dev
```

The service will start on port 4000 (or the port specified in your `.env` file).

### Production Mode

```bash
npm run build
npm run start:prod
```

### Verify Metrics Endpoint

Once the service is running, you can verify the metrics endpoint:

```bash
curl http://localhost:4000/metrics
```

You should see output like:

```
# HELP shiksha_middleware_http_requests_total Total number of HTTP requests
# TYPE shiksha_middleware_http_requests_total counter
shiksha_middleware_http_requests_total{method="GET",route="/api/health",status="200"} 5

# HELP shiksha_middleware_http_request_duration_seconds HTTP request duration in seconds
# TYPE shiksha_middleware_http_request_duration_seconds histogram
shiksha_middleware_http_request_duration_seconds_bucket{method="GET",route="/api/health",status="200",le="0.1"} 3
...
```

---

## Setting Up Prometheus and Grafana

### Option 1: Using Docker Compose (Recommended)

**Important**: Run the docker-compose command from the `shiksha-middleware` directory to ensure paths are correct.

1. **Navigate to the middleware directory**:

```bash
cd shiksha-middleware
```

2. **Start Prometheus and Grafana**:

```bash
docker-compose -f docker-compose.monitoring.yml up -d
```

Or use the standalone version:

```bash
docker-compose -f docker-compose.monitoring-standalone.yml up -d
```

This will start:
- Prometheus on `http://localhost:9090`
- Grafana on `http://localhost:7000`

3. **Verify Services are Running**:

```bash
docker ps
```

You should see `shiksha-prometheus` and `shiksha-grafana` containers running.

4. **Check Prometheus Targets**:

Open `http://localhost:9090/targets` in your browser. You should see the `shiksha-middleware` target as "UP" if your middleware service is running.

**Note**: If the target shows as "DOWN", you may need to update the `prometheus.yml` file to point to the correct host:
- **If middleware is running on host (not in Docker)**: Use `host.docker.internal:4000` (Mac/Windows) or `172.17.0.1:4000` (Linux)
- **If middleware is in Docker on same network**: Use the service name and port, e.g., `middleware:4000`
- **For local development (non-Docker)**: Use `localhost:4000` or `127.0.0.1:4000`

**Running from a Different Directory**: If you need to run docker-compose from a different directory, you can:
- Use absolute paths in the docker-compose file
- Or copy the prometheus.yml and grafana folders to your docker directory
- Or use the `-f` flag with full paths: `docker-compose -f /full/path/to/docker-compose.monitoring.yml up -d`

### Option 2: Manual Installation

#### Install Prometheus

1. Download Prometheus from [https://prometheus.io/download/](https://prometheus.io/download/)
2. Extract and run:

```bash
./prometheus --config.file=prometheus.yml
```

#### Install Grafana

1. Download Grafana from [https://grafana.com/grafana/download](https://grafana.com/grafana/download)
2. Follow installation instructions for your OS
3. Start Grafana service
4. Configure Prometheus as a datasource (URL: `http://localhost:9090`)

---

## Testing the Metrics Endpoint

### Test 1: Basic Metrics Endpoint

```bash
curl http://localhost:4000/metrics
```

### Test 2: Generate Some Traffic

Make some API requests to generate metrics:

```bash
# Make a GET request
curl http://localhost:4000/api/some-endpoint

# Make a POST request
curl -X POST http://localhost:4000/api/some-endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### Test 3: Check Metrics After Traffic

```bash
curl http://localhost:4000/metrics | grep shiksha_middleware_http_requests_total
```

You should see counters incremented.

### Test 4: Verify Error Metrics

Generate an error (4xx or 5xx):

```bash
# This should generate a 404 error
curl http://localhost:4000/api/nonexistent-endpoint
```

Then check error metrics:

```bash
curl http://localhost:4000/metrics | grep shiksha_middleware_http_errors_total
```

### Test 5: Verify Prometheus Scraping

1. Open Prometheus UI: `http://localhost:9090`
2. Go to **Status → Targets**
3. Verify `shiksha-middleware` target is "UP"
   - **Note**: Prometheus targets show the endpoints that Prometheus scrapes (like `/metrics`), NOT the application endpoints you hit. This is normal!
4. Go to **Graph** tab
5. Enter query: `shiksha_middleware_http_requests_total`
6. Click **Execute**

### Test 6: View Metrics for Specific Endpoints

To see metrics for the endpoints you actually hit (like `/user/v1/cohort/search`):

1. Open Prometheus UI: `http://localhost:9090`
2. Go to **Graph** tab
3. Enter one of these queries:

**View all requests:**
```promql
shiksha_middleware_http_requests_total
```

**View requests for specific route:**
```promql
shiksha_middleware_http_requests_total{route="/user/v1/cohort/search"}
```

**View requests for multiple routes:**
```promql
shiksha_middleware_http_requests_total{route=~"/user/v1/cohort.*"}
```

**View request rate (requests per second):**
```promql
rate(shiksha_middleware_http_requests_total[1m])
```

4. Click **Execute** to see the results
5. Click **Graph** tab to visualize the data over time

---

## Accessing Grafana Dashboards

### Step 1: Login to Grafana

1. Open `http://localhost:3000` in your browser
2. Login with:
   - **Username**: `admin`
   - **Password**: `admin`
3. You'll be prompted to change the password (optional for development)

### Step 2: Verify Prometheus Datasource

1. Go to **Configuration → Data Sources**
2. You should see "Prometheus" datasource already configured (auto-provisioned)
3. Click on it to verify it's working (click "Save & Test")

### Step 3: Access the Dashboard

1. Go to **Dashboards → Browse**
2. You should see "Shiksha Middleware - Prometheus Metrics" dashboard
3. Click to open it

### Step 4: Create Custom Dashboard (Optional)

1. Go to **Dashboards → New Dashboard**
2. Add panels with PromQL queries (see examples below)
3. Save the dashboard

---

## PromQL Query Examples

### Requests Per Second

```promql
rate(shiksha_middleware_http_requests_total[1m])
```

### Requests Per Second by Method

```promql
sum by (method) (rate(shiksha_middleware_http_requests_total[1m]))
```

### Error Rate

```promql
rate(shiksha_middleware_http_errors_total[1m])
```

### Error Rate Percentage

```promql
(
  sum(rate(shiksha_middleware_http_errors_total[5m]))
  /
  sum(rate(shiksha_middleware_http_requests_total[5m]))
) * 100
```

### P50 Latency (Median)

```promql
histogram_quantile(0.50, rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))
```

### P95 Latency

```promql
histogram_quantile(0.95, rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))
```

### P99 Latency

```promql
histogram_quantile(0.99, rate(shiksha_middleware_http_request_duration_seconds_bucket[5m]))
```

### Average Latency

```promql
rate(shiksha_middleware_http_request_duration_seconds_sum[5m]) 
/ 
rate(shiksha_middleware_http_request_duration_seconds_count[5m])
```

### Total Requests in Last Hour

```promql
sum(increase(shiksha_middleware_http_requests_total[1h]))
```

### Requests by Status Code

```promql
sum by (status) (rate(shiksha_middleware_http_requests_total[5m]))
```

### Top 10 Routes by Request Count

```promql
topk(10, sum by (route) (rate(shiksha_middleware_http_requests_total[5m])))
```

### Error Rate by Route

```promql
sum by (route) (rate(shiksha_middleware_http_errors_total[5m]))
```

---

## Architecture

```
┌─────────────────┐
│  NestJS App     │
│  (Port 4000)    │
│                 │
│  ┌───────────┐  │
│  │ Metrics   │  │
│  │ Middleware│  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │ /metrics  │  │
│  │ Endpoint  │  │
│  └─────┬─────┘  │
└────────┼────────┘
         │
         │ HTTP GET /metrics
         │
┌────────▼────────┐
│   Prometheus    │
│  (Port 9090)    │
│                 │
│  Scrapes every  │
│  10 seconds     │
└────────┬────────┘
         │
         │ Queries
         │
┌────────▼────────┐
│    Grafana      │
│  (Port 3000)    │
│                 │
│  Visualizes     │
│  metrics        │
└─────────────────┘
```

---

## Best Practices

### 1. Route Normalization
- Routes are automatically normalized to avoid high-cardinality labels
- Dynamic IDs (UUIDs, numeric IDs) are replaced with `:id`
- Example: `/api/users/12345` → `/api/users/:id`

### 2. Label Cardinality
- Keep label combinations low to avoid performance issues
- Current labels: `method`, `route`, `status`, `error_type`
- Avoid adding user-specific labels (like `userId`) to prevent cardinality explosion

### 3. Metric Naming
- All metrics are prefixed with `shiksha_middleware_`
- Follow Prometheus naming conventions (snake_case, `_total` suffix for counters)

### 4. Histogram Buckets
- Pre-configured buckets: `[0.1, 0.5, 1, 2.5, 5, 10, 30, 60]` seconds
- Suitable for most HTTP request latencies
- Can be adjusted in `metrics.service.ts` if needed

### 5. Scraping Interval
- Prometheus scrapes every 10 seconds (configurable in `prometheus.yml`)
- Balance between granularity and resource usage

### 6. Retention
- Prometheus data retention: 30 days (configurable in `docker-compose.monitoring.yml`)
- For longer retention, consider using remote storage (e.g., Thanos, Cortex)

---

## Troubleshooting

### Issue: Metrics endpoint returns 404

**Solution**: 
- Verify `MetricsModule` is imported in `app.module.ts`
- Check that `MetricsController` is registered
- Restart the application

### Issue: Prometheus target shows as DOWN

**Possible Causes**:
1. Middleware service is not running
2. Wrong host/port in `prometheus.yml`
3. Network connectivity issues

**Solutions**:
- Verify middleware service is running: `curl http://localhost:4000/metrics`
- Update `prometheus.yml` with correct host:
  - Docker: `host.docker.internal:4000`
  - Local: `localhost:4000` or `127.0.0.1:4000`
- Check firewall settings

### Issue: No metrics appearing in Grafana

**Solutions**:
1. Verify Prometheus datasource is configured correctly
2. Check Prometheus is scraping: `http://localhost:9090/targets`
3. Verify queries are correct (use Prometheus UI to test first)
4. Check time range in Grafana (default is last 1 hour)

### Issue: High memory usage

**Possible Causes**:
- Too many unique label combinations
- Long retention period
- High scrape frequency

**Solutions**:
- Review route normalization logic
- Reduce retention period
- Increase scrape interval

### Issue: Metrics not updating

**Solutions**:
1. Verify middleware is receiving traffic
2. Check Prometheus is scraping successfully
3. Verify Grafana is querying Prometheus correctly
4. Check for time range issues in Grafana

### Issue: Docker containers not starting

**Solutions**:
1. Check if ports 9090 and 3000 are already in use:
   ```bash
   lsof -i :9090
   lsof -i :3000
   ```
2. Stop conflicting services or change ports in `docker-compose.monitoring.yml`
3. Check Docker logs:
   ```bash
   docker logs shiksha-prometheus
   docker logs shiksha-grafana
   ```

---

## Additional Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [prom-client Documentation](https://github.com/siimon/prom-client)
- [PromQL Query Language](https://prometheus.io/docs/prometheus/latest/querying/basics/)

---

## Summary

This implementation provides:

✅ **Request-level metrics** (method, route, status, duration, errors)  
✅ **Prometheus integration** with `/metrics` endpoint  
✅ **Grafana dashboards** for visualization  
✅ **Production-ready** with best practices (low cardinality, normalized routes)  
✅ **Easy setup** with Docker Compose  
✅ **Comprehensive documentation** for testing and troubleshooting  

The metrics are now available for monitoring, alerting, and performance analysis of the Shiksha Middleware service.

