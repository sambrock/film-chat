import { v4, v5 } from 'uuid';

export const randomUuid = () => {
  return v4();
};

export const uuidFromString = (value: string) => {
  return v5(value, v5.DNS);
};
