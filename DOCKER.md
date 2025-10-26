# Docker Guide

Руководство по использованию Docker для разработки и деплоя приложения Multipult Frontend.

## Быстрый старт

### Production режим

```bash
# Построить и запустить контейнер
docker-compose up -d

# Проверить логи
docker-compose logs -f frontend

# Остановить контейнер
docker-compose down
```

### Development режим с hot-reload

```bash
# Запустить в dev режиме
docker-compose --profile dev up frontend-dev

# Остановить
docker-compose --profile dev down
```

---

## Построение образов

### Production образ

```bash
# Построить образ
docker build -t multipult-frontend:latest .

# Запустить контейнер
docker run -p 3000:3000 \
  -e VITE_GRAPHQL_ENDPOINT=http://backend:8000/graphql/ \
  -e VITE_APP_ENV=production \
  multipult-frontend:latest
```

### Development образ

```bash
# Построить dev образ
docker build -f Dockerfile.dev -t multipult-frontend:dev .

# Запустить с volume для hot-reload
docker run -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  multipult-frontend:dev
```

---

## Конфигурация

### Environment Variables

Переменные окружения передаются через docker-compose.yml или docker run:

```yaml
environment:
  - NODE_ENV=production
  - VITE_GRAPHQL_ENDPOINT=http://backend:8000/graphql/  # Для production без proxy
  - VITE_APP_ENV=production
  - VITE_APP_URL=http://localhost:3000
  - VITE_DEBUG=false
```

**Примечание:** В development режиме можно использовать `VITE_GRAPHQL_ENDPOINT=/graphql/` при условии, что настроена Vite proxy конфигурация, как в `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/graphql': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    }
  }
}
```

### Volumes (Development)

Для hot-reload в development режиме:

```yaml
volumes:
  - .:/app                 # Монтирование исходников
  - /app/node_modules      # Исключение node_modules
```

---

## Multi-stage Build

Production Dockerfile использует multi-stage build для оптимизации:

1. **Stage 1 (builder)**: Установка зависимостей и сборка
2. **Stage 2 (production)**: Только production зависимости и собранное приложение

**Преимущества:**
- Уменьшенный размер финального образа
- Только необходимые файлы в production
- Безопасность (нет dev зависимостей)

---

## Health Checks

### Docker Health Check

Встроенная проверка здоровья контейнера:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "..." || exit 1
```

### Проверка статуса

```bash
# Проверить health status
docker inspect --format='{{.State.Health.Status}}' <container_id>

# Посмотреть историю health checks
docker inspect --format='{{json .State.Health}}' <container_id> | jq
```

---

## Docker Compose Services

### frontend (Production)

Запускается по умолчанию:
- Port: 3000
- Автоматический перезапуск
- Health checks включены

### frontend-dev (Development)

Запускается с профилем `dev`:
- Port: 5173
- Hot-reload через volumes
- Dev зависимости установлены

---

## Команды для работы

### Основные команды

```bash
# Построить образы
docker-compose build

# Запустить в фоне
docker-compose up -d

# Посмотреть логи
docker-compose logs -f

# Остановить и удалить контейнеры
docker-compose down

# Остановить и удалить volumes
docker-compose down -v
```

### Отладка

```bash
# Войти в running контейнер
docker-compose exec frontend sh

# Запустить команду в контейнере
docker-compose exec frontend npm run check

# Проверить переменные окружения
docker-compose exec frontend env | grep VITE
```

### Очистка

```bash
# Удалить все остановленные контейнеры
docker container prune

# Удалить неиспользуемые образы
docker image prune

# Удалить все (осторожно!)
docker system prune -a
```

---

## Production Deployment

### С использованием Docker Hub

```bash
# 1. Построить образ
docker build -t your-username/multipult-frontend:1.0.0 .

# 2. Push в Docker Hub
docker push your-username/multipult-frontend:1.0.0

# 3. На production сервере
docker pull your-username/multipult-frontend:1.0.0
docker run -d -p 3000:3000 your-username/multipult-frontend:1.0.0
```

### С использованием docker-compose на сервере

```bash
# 1. Скопировать docker-compose.yml на сервер
scp docker-compose.yml user@server:/path/to/app/

# 2. На сервере запустить
docker-compose -f docker-compose.yml up -d
```

---

## Мониторинг

### Логи

```bash
# Следить за логами
docker-compose logs -f frontend

# Последние 100 строк
docker-compose logs --tail=100 frontend

# Логи за последние 10 минут
docker-compose logs --since 10m frontend
```

### Ресурсы

```bash
# Использование ресурсов
docker stats

# Детали контейнера
docker inspect multipult-frontend
```

---

## Troubleshooting

### Контейнер не запускается

```bash
# Проверить логи
docker-compose logs frontend

# Проверить health status
docker ps
```

### Hot-reload не работает в dev режиме

Убедитесь что:
- Volumes настроены правильно
- node_modules не монтируется с хоста
- Используется Dockerfile.dev

### Проблемы с сетью

```bash
# Проверить сети
docker network ls

# Проверить подключение контейнера
docker network inspect multipult_app-network
```

---

## Best Practices

1. **Используйте .dockerignore** - исключайте ненужные файлы
2. **Multi-stage builds** - для оптимизации размера
3. **Не запускайте от root** - добавьте non-root user (будущее улучшение)
4. **Health checks** - всегда добавляйте проверки здоровья
5. **Логирование** - используйте stdout/stderr для логов
6. **Secrets** - никогда не храните секреты в образе

---

## Дополнительные ресурсы

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [SvelteKit Docker Guide](https://kit.svelte.dev/docs/adapter-node)
