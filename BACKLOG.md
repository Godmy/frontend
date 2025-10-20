# Product Backlog

Приоритизированный список задач разработки для проекта Multipult Frontend.

**Последнее обновление:** 2025-01-16

**📖 См. также:**
- [README.md](./README.md) - основная документация проекта
- [CHANGELOG.md](./CHANGELOG.md) - история изменений по версиям
- [TESTING.md](./TESTING.md) - руководство по тестированию

---

## ✅ Завершенные приоритеты

### Приоритет 1: Завершение миграции на Houdini ✅
**Статус:** ✅ Завершено | **Дата завершения:** 2025-01-14

- [x] Мигрировать все компоненты concepts на Houdini queries/mutations
- [x] Мигрировать все компоненты dictionaries на Houdini
- [x] Мигрировать все компоненты languages на Houdini
- [x] Очистить legacy API клиенты (остались только типы в `src/lib/api/`)
- [x] Добавить обработку ошибок через errorHandler во всех компонентах
- [x] Обновить документацию с примерами Houdini
- [x] Провести code review миграции

**Результат:** Единообразная работа с GraphQL, type-safety везде, централизованная обработка ошибок.

---

### Приоритет 3: Покрытие тестами ✅
**Статус:** ✅ Базовое покрытие завершено | **Дата завершения:** 2025-01-16

**Unit тесты:** ✅ 146 passing tests
- [x] Тесты для auth модуля (strategies, services, storage) - 109 тестов
  - [x] EmailPasswordStrategy - 8 тестов
  - [x] GoogleAuthStrategy - 8 тестов
  - [x] TelegramAuthStrategy - 10 тестов
  - [x] AuthService - 23 теста
  - [x] PermissionService - 25 тестов
  - [x] TokenStorage - 13 тестов
  - [x] authStore - 17 тестов
- [x] Тесты для ErrorHandler и типов ошибок - 17 тестов
- [x] Тесты для notificationStore - 19 тестов
- [x] Тесты для config и logger - 5 тестов
- [x] Настроить coverage reporting (80%+ цель)
- [x] Интегрировать тесты в CI/CD

**Результат:** Comprehensive test coverage для всех критических модулей.

**📖 См:** [TESTING.md](./TESTING.md)

---

### Приоритет 6: CI/CD и DevOps инфраструктура ✅
**Статус:** ✅ Базовая настройка завершена | **Дата завершения:** 2025-01-15

**CI/CD Pipeline:**
- [x] Настроить GitHub Actions workflow
- [x] Lint и type checking на каждый PR
- [x] Запуск тестов (unit, integration, e2e)
- [x] Build проекта
- [x] Coverage reporting
- [x] Workflow для deploy на staging/production (шаблон готов)
- [x] Security audit workflow
- [x] Dependency review для PR

**Docker:**
- [x] Dockerfile для production (multi-stage build)
- [x] Dockerfile.dev для разработки с hot-reload
- [x] docker-compose для локальной разработки
- [x] Health check endpoints

**Результат:** Автоматизированный CI/CD pipeline, Docker контейнеризация.

**📖 См:** [DOCKER.md](./DOCKER.md)

---

## 🚀 Активные приоритеты

### Приоритет 2: UX улучшения и валидация
**Статус:** 📋 Не начато | **Оценка:** 2-3 недели | **Критичность:** 🟡 Средняя

#### Validation & Forms
- [ ] Внедрить библиотеку валидации форм (Zod или Yup)
- [ ] Создать переиспользуемые компоненты форм (Input, Select, Checkbox)
- [ ] Добавить валидацию на клиенте с real-time feedback

#### Loading States & Feedback
- [ ] Создать компоненты для skeleton screens (loading states)
- [ ] Реализовать optimistic UI updates для мутаций
- [ ] Добавить progress indicators для длительных операций

#### Data Management
- [ ] Добавить поиск и фильтрацию для списков концепций
- [ ] Добавить сортировку по колонкам в таблицах
- [ ] Реализовать пагинацию для больших списков

#### UX Improvements
- [ ] Добавить подтверждение деструктивных действий (модалки)
- [ ] Улучшить accessibility (ARIA labels, keyboard navigation)
- [ ] Добавить keyboard shortcuts для частых действий

**Ожидаемый результат:** Значительное улучшение пользовательского опыта, снижение ошибок ввода.

**Метрика успеха:** UX score 7/10 → 9/10

---

### Приоритет 4: Оптимизация производительности
**Статус:** 📋 Не начато | **Оценка:** 1-2 недели | **Критичность:** 🟡 Средняя

#### Frontend Optimization
- [ ] Внедрить lazy loading для маршрутов (route-based code splitting)
- [ ] Оптимизировать bundle size (analyze, tree-shaking)
- [ ] Добавить компонентный code splitting для крупных модулей
- [ ] Оптимизация изображений (WebP, lazy loading, responsive images)
- [ ] Внедрить виртуализацию для длинных списков (virtual scrolling)

#### GraphQL Optimization
- [ ] Реализовать DataLoader pattern для N+1 запросов
- [ ] Настроить persisted queries для production
- [ ] Оптимизировать размер GraphQL запросов (только нужные поля)
- [ ] Добавить query batching

#### Performance Monitoring
- [ ] Провести Lighthouse audit и устранить критические проблемы
- [ ] Добавить performance monitoring (Web Vitals)
- [ ] Настроить бюджеты производительности (performance budgets)

**Ожидаемый результат:** Быстрая загрузка, плавная работа интерфейса, экономия трафика.

**Метрика успеха:**
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

---

### Приоритет 5: Безопасность и аудит
**Статус:** 🔶 Частично реализовано | **Оценка:** 1-2 недели | **Критичность:** 🔴 Высокая

#### Security
- [ ] Провести security audit зависимостей (npm audit fix)
- [ ] Реализовать rate limiting для API запросов
- [ ] Добавить CSRF protection
- [ ] Внедрить Content Security Policy (CSP)
- [ ] Настроить secure headers (helmet.js для Node.js adapter)
- [ ] Добавить валидацию и санитизацию всех пользовательских вводов
- [ ] Проверить XSS уязвимости
- [ ] Добавить защиту от clickjacking

#### Audit & Logging
- [ ] Реализовать Audit Log для критических действий
- [ ] Добавить логирование авторизационных событий
- [ ] Создать dashboard для просмотра истории изменений
- [ ] Добавить алерты на подозрительную активность

#### Compliance
- [ ] GDPR compliance review (согласия, удаление данных)
- [ ] Добавить Privacy Policy и Terms of Service страницы
- [ ] Реализовать функционал "право на забвение"
- [ ] Добавить cookie consent banner

#### Monitoring (следующий шаг)
- [ ] Интегрировать Sentry для error tracking
- [ ] Настроить application performance monitoring (APM)

**Ожидаемый результат:** Защищенное приложение, соответствие стандартам безопасности.

**Метрика успеха:**
- 0 critical security vulnerabilities
- OWASP Top 10 compliance
- GDPR compliance

---

## 📦 Будущие приоритеты

### Приоритет 7: Bulk операции и массовые действия
**Статус:** 📋 Не начато | **Оценка:** 1-2 недели | **Критичность:** 🟢 Низкая

#### Selection & Operations
- [ ] Реализовать множественный выбор элементов (checkbox selection)
- [ ] Массовое удаление концепций/словарей
- [ ] Массовое обновление (bulk update)
- [ ] Undo/Redo для bulk операций

#### Import/Export
- [ ] Экспорт данных в CSV/JSON формате
- [ ] Импорт данных из CSV/JSON с валидацией
- [ ] Предпросмотр импорта перед применением
- [ ] Шаблоны для импорта

#### UX для Bulk Operations
- [ ] Progress bar для длительных операций
- [ ] Возможность отмены длительных операций
- [ ] Batch processing с resume capability
- [ ] Детальные отчеты об ошибках при bulk операциях

**Ожидаемый результат:** Эффективная работа с большими объемами данных.

---

### Приоритет 8: Улучшенная работа с иерархией концепций
**Статус:** 🔶 Базово реализовано | **Оценка:** 2-3 недели | **Критичность:** 🟡 Средняя

#### Tree View Component
- [ ] Создать компонент Tree View для отображения иерархии
- [ ] Drag & Drop для перемещения концепций в дереве
- [ ] Expand/collapse узлов с сохранением состояния
- [ ] Breadcrumb navigation по иерархии
- [ ] Быстрая навигация по дереву (поиск, jump to)

#### Tree Operations
- [ ] Копирование/перемещение веток
- [ ] Массовое изменение родителя для группы концепций
- [ ] Валидация циклических зависимостей
- [ ] Визуализация depth и path
- [ ] Auto-numbering для элементов

#### UX Improvements
- [ ] Контекстное меню для операций (правый клик)
- [ ] Keyboard shortcuts для навигации
- [ ] Индикация количества дочерних элементов
- [ ] Collapsible all/expand all кнопки
- [ ] Visual indication of depth levels

**Ожидаемый результат:** Интуитивная работа с иерархическими данными.

---

### Приоритет 9: Темная тема и настройки пользователя
**Статус:** 📋 Не начато | **Оценка:** 1 неделя | **Критичность:** 🟢 Низкая

#### Dark Mode
- [ ] Создать dark mode цветовую палитру в TailwindCSS
- [ ] Реализовать переключатель темы (light/dark/auto)
- [ ] Сохранение выбора темы в localStorage
- [ ] Поддержка system preference (prefers-color-scheme)
- [ ] Плавная анимация переключения темы

#### User Settings
- [ ] Страница профиля пользователя
- [ ] Изменение аватара
- [ ] Настройки уведомлений (включить/выключить типы)
- [ ] Выбор языка интерфейса
- [ ] Настройки отображения (items per page, default view)
- [ ] Сохранение предпочтений в backend

#### Internationalization (i18n)
- [ ] Настроить @sveltejs/adapter-node с i18n
- [ ] Создать переводы для английского и русского
- [ ] Компонент LanguageSwitcher для UI языка
- [ ] Форматирование дат/чисел по локали
- [ ] RTL support для арабского/иврита

**Ожидаемый результат:** Персонализированный опыт, поддержка международной аудитории.

---

### Приоритет 10: Rich Text Editor и медиа управление
**Статус:** 📋 Не начато | **Оценка:** 2-3 недели | **Критичность:** 🟡 Средняя

#### Rich Text Editor
- [ ] Интегрировать Tiptap или Lexical редактор
- [ ] Поддержка форматирования (bold, italic, lists, links)
- [ ] Поддержка вставки изображений
- [ ] Markdown mode / WYSIWYG mode toggle
- [ ] Предпросмотр контента
- [ ] Автосохранение черновиков
- [ ] Collaborative editing (будущее)

#### Media Management
- [ ] Upload изображений с preview
- [ ] Drag & Drop для загрузки файлов
- [ ] Медиа библиотека для выбора загруженных файлов
- [ ] Обрезка и resize изображений на клиенте
- [ ] Валидация типов и размеров файлов
- [ ] CDN интеграция для хранения медиа
- [ ] Image optimization (WebP conversion)

#### GraphQL Integration
- [ ] Мутации для upload файлов
- [ ] Оптимизация передачи больших файлов
- [ ] Progress tracking для uploads

**Ожидаемый результат:** Полнофункциональный контент-менеджмент с богатым редактором.

---

## 🔄 Continuous Improvements

### Testing Expansion
- [ ] Integration тесты для GraphQL операций
- [ ] E2E тесты для критических user flows
- [ ] Visual regression тесты
- [ ] Performance тесты
- [ ] Увеличить coverage до 90%+

### Documentation
- [ ] API documentation с примерами
- [ ] Component storybook
- [ ] Video tutorials для ключевых features
- [ ] Migration guides для версий

### Developer Experience
- [ ] Setup git hooks для pre-commit checks
- [ ] Добавить code snippets для VSCode
- [ ] Улучшить error messages для разработчиков
- [ ] Создать CLI для scaffolding компонентов

---

## 📊 Метрики отслеживания

### Code Quality
- **Test Coverage:** 80%+ (current: 80%)
- **TypeScript Coverage:** 100%
- **ESLint Errors:** 0

### Performance
- **Lighthouse Score:** Target 90+
- **Bundle Size:** < 500KB (gzipped)
- **First Contentful Paint:** < 1.5s

### Security
- **Known Vulnerabilities:** 0 critical
- **Security Score:** A+
- **OWASP Compliance:** Top 10

---

**Примечание:** Приоритеты могут меняться в зависимости от бизнес-требований и feedback пользователей.
