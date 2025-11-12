# My little shop

This is a tiny shop, built in top of 3 microservices:

1. api-server:
    - Consumes Kafka messages
    - Writes items into MongoDB
    - Exposes an HTTP endpoint (GET /bought-items) which returns items from DB
2. customer-backend:
    - Publishes Kafka messages
3. customer-frontend:
    - Allows users to buy items and view all historically purchased items


## Installation
Run the following command
```
git clone https://github.com/joeynaor/little-shop
kubectl apply -f k8s
```

## Usage
```
kubectl port-forward svc/api-server 3000:3000 &
kubectl port-forward svc/customer-backend 4000:3000 &
kubectl port-forward svc/customer-frontend 8000:3000 &
wait
```

The UI will be accessible locally at `http://localhost:8000`