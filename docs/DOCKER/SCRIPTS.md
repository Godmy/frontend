# Docker Scripts Documentation

This directory contains documentation for Docker-related scripts and commands.

## Available Docker Commands

### Building Images
- `docker build` - Build Docker images
- `docker-compose build` - Build services defined in docker-compose.yml

### Running Containers
- `docker run` - Run containers
- `docker-compose up` - Start services defined in docker-compose.yml

### Managing Containers
- `docker ps` - List running containers
- `docker stop` - Stop containers
- `docker rm` - Remove containers
- `docker logs` - View container logs

### Managing Images
- `docker images` - List images
- `docker rmi` - Remove images
- `docker image prune` - Remove unused images

## Docker Compose Profiles

### Production Profile
Default profile for production deployment.

### Development Profile
Profile with hot-reload and development tools enabled.

## Environment Variables

Docker environment variables are configured through:
- `.env` files
- Environment variable passing in docker-compose.yml
- Docker build arguments