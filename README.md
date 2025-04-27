# k8s-3tier-app

## Overview
This repository contains a three-tier Kubernetes application consisting of:
- **Frontend**: Flask app serving a basic HTML interface.
- **Backend**: Node.js (Express) API server.
- **Database**: MongoDB for data persistence.

Additional features:
- **Horizontal Pod Autoscaling (HPA)** for frontend and backend.
- **Observability**: Prometheus for metrics collection, Grafana for visualization.
- **Alerting**: Grafana alerts configured to send notifications to Slack.

## Folder Structure
```
k8s-3tier-app/
│
├── frontend-flask/
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── k8s/
│       ├── deployment.yaml
│       └── service.yaml
│
├── backend-node/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── k8s/
│       ├── deployment.yaml
│       └── service.yaml
│
├── mongodb/
│   └── k8s/
│       ├── deployment.yaml
│       └── service.yaml
│
├── monitoring/
│   ├── prometheus/
│   │   ├── prometheus-configmap.yaml
│   │   ├── prometheus-deployment.yaml
│   │   └── prometheus-service.yaml
│   └── grafana/
│       ├── grafana-deployment.yaml
│       └── grafana-service.yaml
│
└── namespace.yaml
```

## Prerequisites
- Docker & DockerHub account  
- Kubernetes cluster (Docker Desktop Kubernetes)  
- `kubectl` installed and configured  
- Slack Incoming Webhook URL for alert notifications  

## Setup and Deployment

### 1. Build and Push Docker Images
```bash
# Frontend
docker build -t <dockerhub-username>/frontend-flask:latest frontend-flask/
docker push <dockerhub-username>/frontend-flask:latest

# Backend
docker build -t <dockerhub-username>/backend-node:latest backend-node/
docker push <dockerhub-username>/backend-node:latest
```

### 2. Deploy Application Components
```bash
kubectl apply -f mongodb/k8s/
kubectl apply -f backend-node/k8s/
kubectl apply -f frontend-flask/k8s/
```

### 3. Verify Deployments
```bash
kubectl get pods
kubectl get svc
```
- Access Frontend: `kubectl port-forward svc/frontend 8080:80` → http://localhost:8080  
- Access Backend (optional): `kubectl port-forward svc/backend 3000:3000` → http://localhost:3000/api/data  

### 4. Install Metrics Server (for HPA)
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.6.1/components.yaml
```

### 5. Configure Horizontal Pod Autoscaler (HPA)
```bash
kubectl apply -f frontend-flask/k8s/hpa.yaml
kubectl apply -f backend-node/k8s/hpa.yaml
kubectl get hpa
```

### 6. Deploy Observability Stack (Prometheus & Grafana)
```bash
kubectl apply -f monitoring/prometheus/prometheus-configmap.yaml
kubectl apply -f monitoring/prometheus/prometheus-deployment.yaml
kubectl apply -f monitoring/prometheus/prometheus-service.yaml
kubectl apply -f monitoring/grafana/grafana-deployment.yaml
kubectl apply -f monitoring/grafana/grafana-service.yaml
```

### 7. Access Grafana
```bash
kubectl port-forward svc/grafana 3000:3000
```
- Open http://localhost:3000
- Login: `admin` / `admin`
- Add Prometheus data source: `http://prometheus:9090`

### 8. Configure Grafana Alerts to Slack
1. In Grafana, go to **Alerting > Notification channels**.
2. Create new **Slack** channel with your Incoming Webhook URL.  
3. Add alert rules in your dashboard panels (e.g., high CPU) and select the Slack channel.

## Useful Commands
```bash
# View logs
kubectl logs -l app=frontend
kubectl logs -l app=backend

# Scale manually
kubectl scale deployment/frontend --replicas=3
kubectl scale deployment/backend --replicas=3

# Check metrics
kubectl top pods
kubectl get hpa
```

## License
MIT License.
