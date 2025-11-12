# My little shop

This is a tiny shop built using 3 micro-services:

1. api-server:
    - Consumes Kafka messages
    - Writes items into MongoDB
    - Exposes an HTTP endpoint which returns items from DB
2. customer-backend:
    - Publishes Kafka messages
3. customer-frontend:
    - Buy items (POST customer-backend/buy)
    - View all historically purchased items (GET api-server/bought-items)


## Installation (K8s)
```
git clone https://github.com/joeynaor/little-shop
kubectl apply -f k8s
```

## Usage
The UI sends HTTP requests to both `api-server` and `customer-backend`. Therefore, all 3 microservices must have public endpoints (which are accessible by the browser). For local testing, run the following commands:
```
kubectl port-forward svc/api-server 3000:3000
kubectl port-forward svc/customer-backend 4000:3000
kubectl port-forward svc/customer-frontend 8000:3000
```

The UI will be accessible locally at `http://localhost:8000`