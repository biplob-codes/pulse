export type ActionState<T = Record<string, string>> = {
  success?: boolean;
  message?: string;
  fields?: Partial<T>;
  errors?: Partial<Record<keyof T, string[]>>;
};
