export interface IAbstractEnum<T> {
  [key: string]: T | string;
  [nu: number]: string;
}
