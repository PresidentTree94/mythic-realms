export default function buildFormElements<T extends object>(
  form: T,
  update: (key: keyof T, value: any) => void,
  schema: Record<string, any>
) {
  return Object.fromEntries(
    Object.entries(schema).map(([key, config]) => [
      key,
      {
        ...config,
        value: form[key as keyof T],
        setValue: (value: any) => update(key as keyof T, value)
      }
    ])
  );
}
