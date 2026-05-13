.PHONY: help build run test clean install-deps

help:
	@echo "SHIRTIEZA Backend Makefile"
	@echo "Available commands:"
	@echo "  make install-deps  - Install Go dependencies"
	@echo "  make build        - Build the application"
	@echo "  make run          - Run the application"
	@echo "  make test         - Run tests"
	@echo "  make clean        - Clean build artifacts"
	@echo "  make fmt          - Format code"
	@echo "  make lint         - Run linter"

install-deps:
	go mod download
	go mod tidy

build:
	go build -o shirtieza-api cmd/main.go

run:
	go run cmd/main.go

dev:
	go run cmd/main.go

test:
	go test ./...

clean:
	rm -f shirtieza-api
	rm -f shirtieza.db

fmt:
	go fmt ./...

lint:
	golint ./...

# Docker commands (optional)
docker-build:
	docker build -t shirtieza-backend .

docker-run:
	docker run -p 8080:8080 shirtieza-backend

docker-stop:
	docker stop $$(docker ps -q --filter "ancestor=shirtieza-backend")
