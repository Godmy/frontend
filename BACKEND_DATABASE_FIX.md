# Backend Database Fix - Missing Column

## Проблема

При попытке входа в систему возникает ошибка базы данных на backend:

```
(psycopg2.errors.UndefinedColumn) column user_profiles.avatar_file_id does not exist
LINE 1: ...io, user_profiles.avatar AS user_profiles_avatar, user_profi...
```

## Причина

В таблице `user_profiles` отсутствует колонка `avatar_file_id`, которая требуется backend'у для получения данных профиля пользователя.

## Решение для Backend администратора

### Вариант 1: Добавить миграцию (рекомендуется)

Создайте Django миграцию для добавления колонки:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Вариант 2: Добавить колонку вручную (если миграции не работают)

Выполните SQL запрос в базе данных:

```sql
ALTER TABLE user_profiles
ADD COLUMN avatar_file_id INTEGER NULL;

-- Опционально: добавить foreign key constraint
ALTER TABLE user_profiles
ADD CONSTRAINT fk_avatar_file
FOREIGN KEY (avatar_file_id)
REFERENCES files(id)  -- замените на правильное имя таблицы файлов
ON DELETE SET NULL;
```

### Вариант 3: Обновить модель Django

Если колонка не нужна, удалите поле из модели `UserProfile`:

```python
# backend/apps/users/models.py (или аналогичный файл)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    avatar = models.CharField(max_length=255, blank=True)  # URL аватара
    # avatar_file_id = models.ForeignKey(...)  # <-- удалить это поле, если не используется
    language = models.CharField(max_length=10, default='en')
    timezone = models.CharField(max_length=50, default='UTC')

    # ... остальные поля
```

После изменения модели:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Проверка после исправления

После применения исправления на backend, протестируйте вход:

1. Откройте http://localhost:5173/login
2. Введите credentials (Admin / !QAZ1qaz)
3. Вход должен пройти успешно

## Frontend изменения (уже сделано)

Frontend теперь показывает понятное сообщение об ошибке:

```
Server database error. Please contact the administrator to fix the database schema.
```

Вместо технической ошибки базы данных.

## Временный workaround (не рекомендуется)

Если нужно срочно предоставить доступ, можно временно изменить GraphQL query на frontend, чтобы не запрашивать поле `profile`, но это не решит проблему полностью.

## Связанные файлы

- Frontend: `src/lib/auth/adapters/GraphQLAdapter.ts` - обработка ошибок GraphQL
- Backend: `apps/users/models.py` (или аналогичный) - модель UserProfile
- Backend: миграции в `apps/users/migrations/`

---

**Дата создания:** 2025-01-16
**Статус:** Требуется действие со стороны backend администратора
