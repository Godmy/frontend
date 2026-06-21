<script lang="ts">
  // Компонент формы входа на уровне features
  import { FormFactory } from '$shared/ui';
  import { notificationStore } from '$lib/notifications';
  import { authStoreWritable as authStore } from '$lib/auth/stores/authStore';
  
  type LoginFormData = {
    email: string;
    password: string;
    rememberMe?: boolean;
  };

  const loginFormDefinition = {
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'Введите ваш email'
      },
      {
        name: 'password',
        label: 'Пароль',
        type: 'password',
        required: true,
        placeholder: 'Введите ваш пароль'
      },
      {
        name: 'rememberMe',
        label: 'Запомнить меня',
        type: 'checkbox',
        required: false
      }
    ],
    onSubmit: async (data: LoginFormData) => {
      try {
        // Здесь будет реальная логика аутентификации
        console.log('Данные для входа:', data);
        // authStore.login(data.email, data.password, data.rememberMe);
        
        notificationStore.success('Вы успешно вошли в систему');
      } catch (error) {
        notificationStore.error('Ошибка входа: ' + (error as Error).message);
        throw error; // Пробрасываем ошибку для обработки валидации
      }
    },
    submitLabel: 'Войти'
  };
</script>

<div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
  <h2 class="text-2xl font-bold text-center mb-6">Вход в систему</h2>
  <FormFactory definition={loginFormDefinition} />
  
  <div class="mt-4 text-center">
    <p class="text-gray-600">
      Нет аккаунта? 
      <a href="/register" class="text-indigo-600 hover:text-indigo-800 font-medium">Зарегистрироваться</a>
    </p>
  </div>
</div>