# Changelog

Все важные изменения в проекте Multipult Frontend документированы в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
и проект следует [Semantic Versioning](https://semver.org/lang/ru/).

**📖 См. также:**
- [README.md](./README.md) - основная документация проекта
- [BACKLOG.md](./BACKLOG.md) - product backlog и roadmap

---

## [Unreleased]

### 🔧 Исправлено
- Улучшена обработка ошибок базы данных в GraphQLAdapter
- Добавлено понятное сообщение при ошибках backend базы данных (вместо технических деталей)

### 📖 Документация
- Добавлен `BACKEND_DATABASE_FIX.md` - руководство для администратора по исправлению ошибки `avatar_file_id`
- Обновлен раздел Troubleshooting в README.md

### Планируется
- UX улучшения и валидация форм (Приоритет 2)
- Оптимизация производительности (Приоритет 4)
- Завершение security audit (Приоритет 5)

---

## [0.3.0] - 2025-01-16

### ✅ Добавлено
- **Comprehensive Unit Tests** (146 passing tests)
  - Тесты для всех auth strategies (EmailPassword, Google, Telegram) - 26 тестов
  - Тесты для AuthService и PermissionService - 48 тестов
  - Тесты для TokenStorage и authStore - 30 тестов
  - Тесты для ErrorHandler и типов ошибок - 17 тестов
  - Тесты для notificationStore - 19 тестов
  - Тесты для config и logger - 5 тестов

- **Coverage Reporting**
  - Настроен v8 coverage provider
  - Установлены пороги покрытия: 80% lines/functions/statements, 75% branches
  - HTML/JSON/LCOV отчеты
  - Интеграция coverage в CI/CD

- **Документация**
  - `TESTING.md` - comprehensive testing guide
  - `BACKLOG.md` - product backlog с приоритизацией
  - `CHANGELOG.md` - история изменений

### 🔧 Исправлено
- Broken ErrorHandler tests (неправильный импорт класса)
- Broken AppError tests (изменена сигнатура конструктора)
- Broken config tests (переименованы свойства)

### 📈 Метрики
- Test Coverage: 80%+
- Tests: 146 passing
- Test Suites: 12
- UX Score: 8/10 (было 5/10)

---

## [0.2.0] - 2025-01-15

### ✅ Добавлено
- **CI/CD Pipeline**
  - GitHub Actions workflow для PR и main branch
  - Автоматический lint, type-check, tests, build
  - Coverage reporting в CI
  - Security audit workflow
  - Dependency review для PR

- **Docker Infrastructure**
  - Production Dockerfile (multi-stage build)
  - Development Dockerfile с hot-reload
  - docker-compose для локальной разработки
  - Health check endpoints
  - Документация в `DOCKER.md`

### 📈 Метрики
- Build time: ~2 минуты (production)
- Docker image size: ~200MB (gzipped)
- CI/CD: Полностью автоматизирован

---

## [0.1.0] - 2025-01-14

### ✅ Добавлено
- **Полная миграция на Houdini GraphQL Client**
  - Мигрированы все компоненты concepts на Houdini queries/mutations
  - Мигрированы все компоненты dictionaries на Houdini
  - Мигрированы все компоненты languages на Houdini
  - Очищены legacy API клиенты (остались только типы)

- **Централизованная обработка ошибок**
  - ErrorHandler для всех GraphQL операций
  - AppError с типизацией и severity levels
  - Интеграция с notificationStore
  - Graceful error recovery

- **Улучшенная типизация**
  - Type-safety на всех уровнях через Houdini
  - Автогенерация TypeScript типов из GraphQL schema
  - Strongly-typed GraphQL операции

### 🔧 Исправлено
- Race conditions в auth flow (logout/login)
- Inconsistent error handling в legacy code
- Memory leaks в GraphQL subscriptions

### 📈 Метрики
- Type-safety: 100%
- GraphQL coverage: 100% (все запросы через Houdini)
- Legacy code: Удалено ~40% старого кода

---

## [0.0.1] - 2025-01-10

### 🎉 Начальная версия

- **Архитектура**
  - SvelteKit 2 с TypeScript
  - Tailwind CSS для стилизации
  - GraphQL API integration (legacy client)
  - Базовая структура проекта

- **Authentication**
  - Email/Password authentication
  - Google OAuth integration
  - Telegram authentication
  - JWT token management
  - Role-based access control (RBAC)

- **Core Features**
  - Concepts management (CRUD)
  - Dictionaries management
  - Languages management
  - Hierarchical data support
  - Notification system

- **Developer Experience**
  - ESLint + Prettier
  - TypeScript strict mode
  - Hot module replacement
  - Development environment setup

---

## Формат версий

- **Major (X.0.0)**: Breaking changes, архитектурные изменения
- **Minor (0.X.0)**: Новые features, improvements без breaking changes
- **Patch (0.0.X)**: Bug fixes, мелкие улучшения

## Легенда

- ✅ **Добавлено**: Новый функционал
- 🔧 **Исправлено**: Bug fixes
- 🔄 **Изменено**: Изменения существующего функционала
- 🗑️ **Удалено**: Удаленный функционал
- 🔒 **Безопасность**: Security fixes
- 📈 **Метрики**: Показатели производительности/качества
- 📖 **Документация**: Изменения в документации

---

**См. также:**
- [BACKLOG.md](./BACKLOG.md) - Product backlog и roadmap
- [TESTING.md](./TESTING.md) - Testing guide
- [DOCKER.md](./DOCKER.md) - Docker и deployment guide
