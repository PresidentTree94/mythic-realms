import { useState } from "react";

export default function useFormState<T>(initial: T) {
  const [form, setForm] = useState<T>(initial);
  const update = (key: keyof T, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const reset = () => setForm(initial);
  return { form, update, reset, setForm };
}