# Naradai Backend API

Backend API untuk Priority Actions Management menggunakan Golang dan MongoDB.

## Setup

1. Install dependencies:
```bash
go mod download
```

2. Setup MongoDB:
   - Pastikan MongoDB running di `localhost:27017`
   - Database akan dibuat otomatis: `naradai`
   - Collection: `priority_actions`

3. Create `.env` file (atau set environment variables):
```env
PORT=8080
GIN_MODE=debug
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=naradai
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization
```

4. Create MongoDB indexes:
```javascript
use naradai
db.priority_actions.createIndex({ "priority": 1 });
db.priority_actions.createIndex({ "status": 1 });
db.priority_actions.createIndex({ "created_at": -1 });
```

5. Run server:
```bash
go run cmd/server/main.go
```

Server akan berjalan di `http://localhost:8080`

## API Endpoints

- `GET /health` - Health check
- `GET /api/v1/priority-actions` - Get all priority actions
- `GET /api/v1/priority-actions/:id` - Get single priority action
- `POST /api/v1/priority-actions` - Create new priority action
- `PUT /api/v1/priority-actions/:id` - Update priority action
- `DELETE /api/v1/priority-actions/:id` - Delete priority action

## Project Structure

```
backend/
├── cmd/
│   └── server/
│       └── main.go
├── internal/
│   ├── config/
│   ├── models/
│   ├── repository/
│   ├── service/
│   └── handler/
├── pkg/
│   └── response/
└── go.mod
```

