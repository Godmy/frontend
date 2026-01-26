<script lang="ts">
  import { createFormStore } from '$lib/utils/form';
  import { z, type ZodSchema, type ZodTypeAny } from 'zod';
  import { Input, Select, Textarea, Checkbox, Button } from '$shared/ui';

  // Типы для определения формы
  export type FieldDefinition<T = any> = {
    name: Extract<keyof T, string>;
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

  type FormValues = Record<string, any>;

  type Props = {
    definition: FormDefinition<any>;
    initialData?: Partial<FormValues>;
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
    return values as FormValues;
  });

  // Создаем схему валидации на основе определения полей
  let schema = $derived.by(() => {
    const shape: Record<string, ZodSchema<any>> = {};
    definition.fields.forEach(field => {
      let fieldSchema: ZodTypeAny = z.any();

      switch (field.type) {
        case 'text':
        case 'email':
        case 'password': {
          let stringSchema = z.string();
          if (field.required) {
            stringSchema = stringSchema.min(1, field.label + ' ???????????');
          }
          if (field.type === 'email') {
            stringSchema = stringSchema.email('???????????? email');
          }
          fieldSchema = stringSchema;
          break;
        }
        case 'number': {
          const numberSchema = z.number();
          fieldSchema = field.required ? numberSchema : numberSchema.optional();
          break;
        }
        case 'select': {
          let selectSchema = z.string();
          if (field.required) {
            selectSchema = selectSchema.min(1, field.label + ' ???????????');
            fieldSchema = selectSchema;
          } else {
            fieldSchema = selectSchema.optional();
          }
          break;
        }
        case 'textarea': {
          let textareaSchema = z.string();
          if (field.required) {
            textareaSchema = textareaSchema.min(1, field.label + ' ???????????');
          }
          fieldSchema = textareaSchema;
          break;
        }
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
  let form = $derived(createFormStore(schema as ZodSchema<FormValues>, initialValues));

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
  onsubmit={handleSubmit}
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
        onchange={(event: Event & { currentTarget: HTMLInputElement }) => form.setField(field.name, event.currentTarget.value)}
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
        onchange={(event: Event & { currentTarget: HTMLSelectElement }) => form.setField(field.name, event.currentTarget.value)}
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
        onchange={(event: Event & { currentTarget: HTMLInputElement }) => form.setField(field.name, event.currentTarget.checked)}
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
