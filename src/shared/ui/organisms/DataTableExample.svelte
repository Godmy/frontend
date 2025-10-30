<script lang="ts">
  // Пример использования DataTable.svelte
  
  // Тип данных для примера
  type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'inactive';
    created: string; // дата в формате ISO
  };

  // Данные для таблицы
  let users: User[] = [
    { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', role: 'Администратор', status: 'active', created: '2023-01-15' },
    { id: 2, name: 'Мария Петрова', email: 'maria@example.com', role: 'Модератор', status: 'active', created: '2023-02-20' },
    { id: 3, name: 'Алексей Сидоров', email: 'alexey@example.com', role: 'Пользователь', status: 'inactive', created: '2023-03-10' },
    { id: 4, name: 'Елена Козлова', email: 'elena@example.com', role: 'Редактор', status: 'active', created: '2023-04-05' },
    { id: 5, name: 'Дмитрий Волков', email: 'dmitry@example.com', role: 'Пользователь', status: 'active', created: '2023-05-12' },
    { id: 6, name: 'Анна Смирнова', email: 'anna@example.com', role: 'Модератор', status: 'inactive', created: '2023-06-18' },
    { id: 7, name: 'Сергей Попов', email: 'sergey@example.com', role: 'Администратор', status: 'active', created: '2023-07-22' },
    { id: 8, name: 'Ольга Лебедева', email: 'olga@example.com', role: 'Пользователь', status: 'active', created: '2023-08-30' },
    { id: 9, name: 'Михаил Кузнецов', email: 'mikhail@example.com', role: 'Редактор', status: 'inactive', created: '2023-09-14' },
    { id: 10, name: 'Татьяна Новикова', email: 'tatyana@example.com', role: 'Пользователь', status: 'active', created: '2023-10-01' },
    { id: 11, name: 'Владимир Федоров', email: 'vladimir@example.com', role: 'Модератор', status: 'active', created: '2023-11-05' },
    { id: 12, name: 'Наталья Морозова', email: 'natalya@example.com', role: 'Пользователь', status: 'inactive', created: '2023-12-09' },
  ];

  // Определение колонок
  let columns = [
    { key: 'id', header: 'ID', sortable: true, filterable: true },
    { key: 'name', header: 'Имя', sortable: true, filterable: true },
    { key: 'email', header: 'Email', sortable: true, filterable: true },
    { key: 'role', header: 'Роль', sortable: true, filterable: true },
    { key: 'status', header: 'Статус', sortable: true, filterable: true },
    { key: 'created', header: 'Дата создания', sortable: true, filterable: true },
  ];

  // Состояние для конфигурации колонок
  let columnConfigs = $state(columns.map(col => ({
    ...col,
    visible: true
  })));

  // Обработчик изменения конфигурации колонок
  function handleColumnsChange(newConfigs) {
    columnConfigs = newConfigs;
  }
</script>

<div class="p-6">
  <h1 class="text-2xl font-bold text-gray-900 mb-6">Пример DataTable.svelte</h1>
  
  <!-- Управление колонками -->
  <div class="mb-6">
    <ColumnManager 
      columns={columnConfigs} 
      on:columnsChange={handleColumnsChange} 
    />
  </div>

  <!-- Таблица -->
  <DataTable 
    {data} 
    columns={columnConfigs.filter(col => col.visible)} 
    caption="Список пользователей"
    enableFiltering={true}
    enableSorting={true}
    enablePagination={true}
    pageSize={5}
    striped={true}
    bordered={true}
    hoverable={true}
  >
    <!-- Опционально: можно добавить кастомную логику -->
  </DataTable>
</div>