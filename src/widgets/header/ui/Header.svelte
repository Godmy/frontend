<script lang="ts">
  // Компонент шапки приложения на уровне widgets
  import { authStore } from '$lib/auth/stores/authStore';
  import { Avatar } from '$shared/ui';
  
  function handleLogout() {
    authStore.setUnauthenticated();
  }
</script>

<header class="bg-white shadow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex items-center">
        <div class="flex-shrink-0 flex items-center">
          <span class="text-xl font-bold text-indigo-600">Multipult Frontend</span>
        </div>
        <nav class="ml-6 flex space-x-4">
          <a href="/" class="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium">Главная</a>
          <a href="/concepts" class="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium">Концепции</a>
          <a href="/dictionaries" class="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium">Словари</a>
          <a href="/languages" class="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md font-medium">Языки</a>
        </nav>
      </div>
      <div class="flex items-center">
        {#if authStore.isAuthenticated && authStore.user}
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">Привет, {authStore.user.name}</span>
            <Avatar size="sm" alt={authStore.user.name} />
            <button 
              on:click={handleLogout}
              class="ml-4 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Выйти
            </button>
          </div>
        {:else}
          <div class="space-x-2">
            <a href="/login" class="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
              Войти
            </a>
            <a href="/register" class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Регистрация
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>