import { z, type ZodSchema } from 'zod';

/**
 * Form validation errors state
 */
export type FormErrors<T extends Record<string, any>> = {
	[K in keyof T]?: string[];
};

/**
 * Form validation result
 */
export interface ValidationResult<T> {
	success: boolean;
	data?: T;
	errors?: FormErrors<T>;
}

/**
 * Validate form data against a Zod schema
 */
export function validateForm<T extends Record<string, any>>(
	schema: ZodSchema<T>,
	data: unknown
): ValidationResult<T> {
	const result = schema.safeParse(data);

	if (result.success) {
		return {
			success: true,
			data: result.data
		};
	}

	const errors: FormErrors<T> = {};
	result.error.errors.forEach((error) => {
		const path = error.path.join('.') as keyof T;
		if (!errors[path]) {
			errors[path] = [];
		}
		errors[path]!.push(error.message);
	});

	return {
		success: false,
		errors
	};
}

/**
 * Validate a single field against a Zod schema
 */
export function validateField<T extends Record<string, any>>(
	schema: ZodSchema<T>,
	fieldName: keyof T,
	value: any,
	formData: Partial<T>
): string[] | undefined {
	try {
		// Create a partial object with only this field
		const testData = { ...formData, [fieldName]: value } as T;
		const result = schema.safeParse(testData);

		if (result.success) {
			return undefined;
		}

		// Filter errors for this specific field
		const fieldErrors = result.error.errors
			.filter((error) => error.path[0] === fieldName)
			.map((error) => error.message);

		return fieldErrors.length > 0 ? fieldErrors : undefined;
	} catch {
		return undefined;
	}
}

/**
 * Create a form store with validation
 */
export function createFormStore<T extends Record<string, any>>(
	schema: ZodSchema<T>,
	initialData: Partial<T> = {}
) {
	let data = $state<Partial<T>>(initialData);
	let errors = $state<FormErrors<T>>({});
	let touched = $state<Set<keyof T>>(new Set());
	let isSubmitting = $state(false);
	let isValid = $state(false);

	function setField(field: keyof T, value: any) {
		data = { ...data, [field]: value };
		touched.add(field);

		// Validate field if it has been touched
		if (touched.has(field)) {
			const fieldErrors = validateField(schema, field, value, data);
			if (fieldErrors) {
				errors = { ...errors, [field]: fieldErrors };
			} else {
				const newErrors = { ...errors };
				delete newErrors[field];
				errors = newErrors;
			}
		}

		// Update overall validity
		isValid = Object.keys(errors).length === 0;
	}

	function touchField(field: keyof T) {
		touched.add(field);
		// Validate on touch
		if (data[field] !== undefined) {
			const fieldErrors = validateField(schema, field, data[field], data);
			if (fieldErrors) {
				errors = { ...errors, [field]: fieldErrors };
			}
		}
	}

	function validate(): ValidationResult<T> {
		const result = validateForm(schema, data);
		if (!result.success && result.errors) {
			errors = result.errors;
			isValid = false;
		} else {
			errors = {};
			isValid = true;
		}
		return result;
	}

	async function handleSubmit(
		onSubmit: (data: T) => Promise<void> | void
	): Promise<boolean> {
		isSubmitting = true;
		const result = validate();

		if (!result.success || !result.data) {
			isSubmitting = false;
			return false;
		}

		try {
			await onSubmit(result.data);
			isSubmitting = false;
			return true;
		} catch (error) {
			isSubmitting = false;
			throw error;
		}
	}

	function reset(newData: Partial<T> = {}) {
		data = newData;
		errors = {};
		touched = new Set();
		isSubmitting = false;
		isValid = false;
	}

	return {
		get data() {
			return data;
		},
		get errors() {
			return errors;
		},
		get touched() {
			return touched;
		},
		get isSubmitting() {
			return isSubmitting;
		},
		get isValid() {
			return isValid;
		},
		setField,
		touchField,
		validate,
		handleSubmit,
		reset
	};
}
