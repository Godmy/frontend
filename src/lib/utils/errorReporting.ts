/**
 * Утилита для логирования ошибок
 * Пока реализует базовую систему логирования, 
 * готова для интеграции с Sentry или другими системами
 */

interface ErrorContext {
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
  extra?: Record<string, any>;
  tags?: Record<string, string>;
}

class ErrorReporting {
  private enabled = true;

  /**
   * Инициализировать систему логирования ошибок
   */
  init(): void {
    // В реальном приложении здесь будет инициализация Sentry
    // Sentry.init({ dsn: 'your-dsn-here' });

    // Обработчик глобальных ошибок
    window.addEventListener('error', (event) => {
      this.captureException(event.error, { tags: { source: 'window-error' } });
    });

    // Обработчик ошибок в promise
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason, { tags: { source: 'unhandled-rejection' } });
    });
  }

  /**
   * Отправить исключение в систему логирования
   */
  captureException(
    error: Error | string | unknown,
    context?: ErrorContext
  ): void {
    if (!this.enabled) return;

    console.error('Captured error:', error, context);

    // В реальном приложении здесь будет вызов Sentry
    // Sentry.captureException(error, {
    //   user: context?.user,
    //   extra: context?.extra,
    //   tags: context?.tags
    // });

    // Логируем в консоль для отладки
    if (typeof error === 'string') {
      console.error(error);
    } else if (error instanceof Error) {
      console.error(error.message, error.stack);
    } else {
      console.error('Unknown error:', error);
    }
  }

  /**
   * Отправить сообщение в систему логирования
   */
  captureMessage(
    message: string,
    context?: ErrorContext
  ): void {
    if (!this.enabled) return;

    console.warn('Captured message:', message, context);

    // В реальном приложении здесь будет вызов Sentry
    // Sentry.captureMessage(message, {
    //   user: context?.user,
    //   extra: context?.extra,
    //   tags: context?.tags
    // });
  }

  /**
   * Установить пользователя для следующих ошибок
   */
  setUser(user: ErrorContext['user']): void {
    // В реальном приложении здесь будет вызов Sentry
    // Sentry.setUser(user);
    console.log('Setting user for error reporting:', user);
  }

  /**
   * Добавить теги к следующим ошибкам
   */
  setTags(tags: Record<string, string>): void {
    // В реальном приложении здесь будет вызов Sentry
    // Sentry.setTags(tags);
    console.log('Setting tags for error reporting:', tags);
  }

  /**
   * Добавить дополнительные данные к следующим ошибкам
   */
  setExtra(extra: Record<string, any>): void {
    // В реальном приложении здесь будет вызов Sentry
    // Sentry.setExtra(extra);
    console.log('Setting extra data for error reporting:', extra);
  }

  /**
   * Отключить систему логирования
   */
  disable(): void {
    this.enabled = false;
  }

  /**
   * Включить систему логирования
   */
  enable(): void {
    this.enabled = true;
  }

  /**
   * Проверить, включена ли система логирования
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// Singleton instance
export const errorReporting = new ErrorReporting();