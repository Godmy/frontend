# Product Backlog

Приоритизированный список задач разработки для проекта Multipult Frontend.

**Последнее обновление:** 2025-01-16

**📖 См. также:**
- [README.md](./README.md) - основная документация проекта
- [CHANGELOG.md](./CHANGELOG.md) - история изменений по версиям
- [TESTING.md](./TESTING.md) - руководство по тестированию

---

## ✅ Завершенные приоритеты

### Приоритет 8: Улучшенная работа с иерархией концепций ✅
**Статус:** ✅ Завершено | **Дата завершения:** 2025-01-20

#### Tree View Component
- [x] Создать компонент Tree View для отображения иерархии
- [x] Drag & Drop для перемещения концепций в дереве
- [x] Expand/collapse узлов с сохранением состояния
- [x] Breadcrumb navigation по иерархии
- [x] Быстрая навигация по дереву (поиск, jump to)

#### Tree Operations
- [x] Копирование/перемещение веток (через Drag & Drop)
- [x] Валидация циклических зависимостей
- [x] Визуализация depth и path
- [x] Индикация количества дочерних элементов

#### UX Improvements
- [x] Контекстное меню для операций (правый клик)
- [x] Keyboard shortcuts для навигации (Arrow keys, Enter, Shift+Delete)
- [x] Collapsible all/expand all кнопки
- [x] Visual indication of depth levels (цветные индикаторы)

**Результат:**
- Полнофункциональный Tree View компонент с поддержкой иерархии
- Drag & Drop для перемещения концепций между родителями
- Валидация циклических зависимостей при перемещении
- Поиск по дереву с фильтрацией
- Keyboard navigation и accessibility support
- Контекстное меню для быстрого доступа к операциям
- Breadcrumb компонент для навигации по пути

**Компоненты:**
- `ConceptTree.svelte` - основной компонент дерева с поиском и управлением
- `TreeNode.svelte` - рекурсивный узел дерева с drag-and-drop
- `ConceptBreadcrumb.svelte` - breadcrumb навигация по иерархии

---

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

## ✅ Завершенные приоритеты

### Приоритет 2: UX улучшения и валидация ✅
**Статус:** ✅ Завершено | **Дата завершения:** 2025-01-21

#### Validation & Forms
- [x] Внедрить библиотеку валидации форм (Zod)
- [x] Создать переиспользуемые компоненты форм (Input, Select, Checkbox, Textarea)
- [x] Добавить валидацию на клиенте с real-time feedback
- [x] Создать form store с автоматической валидацией
- [x] Обновить ConceptForm с новой системой валидации

#### Loading States & Feedback
- [x] Создать компоненты для skeleton screens (Skeleton, TableSkeleton, CardSkeleton)
- [x] Добавить progress indicators (ProgressBar, Spinner)
- [ ] Реализовать optimistic UI updates для мутаций (в процессе)

#### Data Management
- [x] Добавить поиск и фильтрацию (SearchBar компонент)
- [x] Добавить сортировку по колонкам в таблицах (SortableTableHeader, sort utilities)
- [x] Реализовать пагинацию для больших списков (Pagination компонент)

#### UX Improvements
- [x] Добавить подтверждение деструктивных действий (Modal, ConfirmDialog)
- [x] Улучшить accessibility (ARIA labels, keyboard navigation во всех компонентах)
- [x] Добавить keyboard shortcuts для частых действий (keyboard utilities, KeyboardShortcutsHelp)

**Результат:**
- Полная система валидации форм с Zod и real-time feedback
- Переиспользуемые UI компоненты: Input, Select, Checkbox, Textarea
- Модальные окна и диалоги подтверждения
- Skeleton компоненты для loading states
- Progress indicators (ProgressBar, Spinner)
- Компоненты для работы с данными: SearchBar, Pagination, SortableTableHeader
- Система keyboard shortcuts с помощником
- Comprehensive accessibility support
- Обновленная ConceptForm с валидацией

**Компоненты:**
- `ui/Input.svelte`, `ui/Select.svelte`, `ui/Checkbox.svelte`, `ui/Textarea.svelte` - форм-компоненты
- `ui/Modal.svelte`, `ui/ConfirmDialog.svelte` - модальные окна
- `ui/Skeleton.svelte`, `ui/TableSkeleton.svelte`, `ui/CardSkeleton.svelte` - loading states
- `ui/ProgressBar.svelte`, `ui/Spinner.svelte` - progress indicators
- `ui/SearchBar.svelte`, `ui/Pagination.svelte`, `ui/SortableTableHeader.svelte` - data management
- `ui/KeyboardShortcutsHelp.svelte` - keyboard shortcuts help

**Утилиты:**
- `utils/form.ts` - form validation and state management
- `utils/sort.ts` - sorting utilities
- `utils/keyboard.ts` - keyboard shortcuts management

**Схемы валидации:**
- `schemas/concept.schema.ts`
- `schemas/language.schema.ts`
- `schemas/dictionary.schema.ts`

**Документация:** См. [UX_COMPONENTS.md](./docs/UX_COMPONENTS.md)

---

## 🚀 Активные приоритеты

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
