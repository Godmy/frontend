<script lang="ts">
  import { createFormStore } from '$lib/utils/form';
  import { z, type ZodSchema } from 'zod';
  import { Input, Select, Textarea, Checkbox, Button } from '$shared/ui';

  // Типы для определения формы
  export type FieldDefinition<T = any> = {
    name: keyof T;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox';
    options?: { value: string; label: string }[]; // Для select
    required?: boolean;
    placeholder?: string;
    validation?: ZodSchema<any>;
    defaultValue?: any;
  };

  export type FormDefinition<T = any> = {
    fields: FieldDefinition<T>[];
    onSubmit: (data: T) => Promise<void> | void;
    submitLabel?: string;
    className?: string;
  };

  type Props<T = Record<string, any>> = {
    definition: FormDefinition<T>;
    initialData?: Partial<T>;
  };

  let { definition, initialData = {} }: Props = $props();

  // Создаем начальные значения формы на основе определения
  let initialValues = $derived.by(() => {
    const values: Record<string, any> = {};
    definition.fields.forEach(field => {
      values[field.name as string] =
        initialData[field.name as keyof typeof initialData] ??
        field.defaultValue ??
        (field.type === 'checkbox' ? false : '');
    });
    return values as T;
  });

  // Создаем схему валидации на основе определения полей
  let schema = $derived.by(() => {
    const shape: Record<string, ZodSchema<any>> = {};
    definition.fields.forEach(field => {
      let fieldSchema: ZodSchema<any> = z.any();

      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
          fieldSchema = z.string();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, field.label + ' обязательно');
          }
          if (field.type === 'email') {
            fieldSchema = fieldSchema.email('Некорректный email');
          }
          break;
        case 'number':
          fieldSchema = field.required
            ? z.number({ required_error: field.label + ' обязательно' })
            : z.number().optional();
          break;
        case 'select':
          fieldSchema = field.required
            ? z.string({ required_error: field.label + ' обязательно' })
            : z.string().optional();
          break;
        case 'textarea':
          fieldSchema = z.string();
          if (field.required) {
            fieldSchema = fieldSchema.min(1, field.label + ' обязательно');
          }
          break;
        case 'checkbox':
          fieldSchema = z.boolean();
          break;
      }

      // Если определена пользовательская валидация, объединяем с базовой
      if (field.validation) {
        fieldSchema = fieldSchema.and(field.validation);
      }

      shape[field.name as string] = fieldSchema;
    });

    return z.object(shape);
  });

  // Создаем store формы
  let form = $derived(createFormStore(schema, initialValues));

  async function handleSubmit(e: Event) {
    e.preventDefault();
    
    const success = await form.handleSubmit(definition.onSubmit);
    
    if (success) {
      // После успешной отправки формы можно сбросить значения
      form.reset();
    }
  }
</script>

<form 
  on:submit={handleSubmit} 
  class="space-y-4 {definition.className || ''}"
>
  {#each definition.fields as field (field.name)}
    {#if field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number'}
      <Input
        id={String(field.name)}
        name={String(field.name)}
        label={field.label}
        type={field.type}
        bind:value={form.data[field.name]}
        onchange={(value) => form.setField(field.name, value)}
        onblur={() => form.touchField(field.name)}
        errors={form.errors[field.name]}
        required={field.required}
        placeholder={field.placeholder}
      />
    {/if}

    {#if field.type === 'select' && field.options}
      <Select
        id={String(field.name)}
        name={String(field.name)}
        label={field.label}
        bind:value={form.data[field.name]}
        options={field.options}
        onchange={(value) => form.setField(field.name, value)}
        onblur={() => form.touchField(field.name)}
        errors={form.errors[field.name]}
        required={field.required}
        placeholder={field.placeholder}
      />
    {/if}

    {#if field.type === 'textarea'}
      <Textarea
        id={String(field.name)}
        name={String(field.name)}
        label={field.label}
        bind:value={form.data[field.name]}
        oninput={(e) => form.setField(field.name, e.currentTarget.value)}
        onblur={() => form.touchField(field.name)}
        errors={form.errors[field.name]}
        required={field.required}
        placeholder={field.placeholder}
      />
    {/if}

    {#if field.type === 'checkbox'}
      <Checkbox
        id={String(field.name)}
        name={String(field.name)}
        bind:checked={form.data[field.name]}
        onchange={(checked) => form.setField(field.name, checked)}
        onblur={() => form.touchField(field.name)}
        errors={form.errors[field.name]}
        label={field.label}
        required={field.required}
      />
    {/if}
  {/each}

  <div class="pt-4">
    <Button type="submit" disabled={!form.isValid || form.isSubmitting}>
      {#if form.isSubmitting}
        Отправка...
      {:else}
        {definition.submitLabel || 'Отправить'}
      {/if}
    </Button>
  </div>
</form>