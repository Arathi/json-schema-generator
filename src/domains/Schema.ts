export default interface Schema {
  name: string;
  properties: Property[] | undefined;
}

export interface Property {
  name: string;
  types: string[];
  amount: number;
}
