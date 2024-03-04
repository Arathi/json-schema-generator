import Schema, { Property } from '@/domains/Schema';

export default class JsonSchemaGenerator {
  schemas: Schema[] = [];

  addSchema(schema: Schema): boolean {
    const exists = this.schemas.find(s => s.name === schema.name);
    if (exists !== undefined) {
      // TODO merge
      console.warn(`${schema.name} 的定义已存在：`, exists);
      return false;
    }

    this.schemas.push(schema);
    console.warn(`${schema.name} 的定义添加成功：`, schema);
    return true;
  }

  parse(name: string, value: any): string | null {
    console.info(`开始解析 ${name}`);
    const type = typeof value;
    switch (type) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'undefined':
        console.info(`${name} 为基础类型：`, type);
        return type;
      case 'object':
        if (value instanceof Array) {
          console.info(`${name} 为数组类型`);
          return this.parseArray(name, value);
        }
        console.info(`${name} 为对象类型`);
        return this.parseObject(name, value);
      default:
        console.warn(`${name} 获取到无效的类型：`, type);
        return null;
    }
  }

  parseObject(name: string, body: any): string {
    const keys = Object.keys(body);
    const properties: Property[] = [];
    for (const key of keys) {
      // let type = typeof body[key];
      const value = body[key];
      const type = this.parse(`${name}.${key}`, value);
      if (type !== null) {
        properties.push({
          name: key,
          types: [type],
          amount: 1,
        });
      }
    }

    const schema = {
      name,
      properties,
    };
    this.addSchema(schema);
    return name;
  }

  parseArray(name: string, elements: any[]): string {
    const typeSet = new Set<string>();
    for (const element of elements) {
      typeSet.add(typeof element);
    }
    const types = [...typeSet.values()];
    if (types.length === 0) {
      return 'any[]';
    }
    if (types.length === 1) {
      return `${types[0]}[]`;
    }
    return `(${types.join(' | ')})[]`;
  }
}
