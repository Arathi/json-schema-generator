import { atom } from 'jotai';
import Schema, { Property } from '@/domains/Schema';

export const rootSchemaNameAtom = atom<string>('');
rootSchemaNameAtom.debugLabel = 'rootSchemaName';

export const inputJsonAtom = atom<string>('');
inputJsonAtom.debugLabel = 'inputJson';

export const activeSchemaNameAtom = atom<string | undefined>(undefined);
activeSchemaNameAtom.debugLabel = 'activeSchemaName';

export const schemasAtom = atom<Schema[]>([]);
schemasAtom.debugLabel = 'schemas';

export const activeSchemaGetter = atom<Schema | null>(get => {
  const name = get(activeSchemaNameAtom);
  if (name !== undefined) {
    const schemas = get(schemasAtom);
    const selected = schemas.find(s => s.name === name);
    if (selected !== undefined) {
      return selected;
    }
  }
  return null;
});
activeSchemaGetter.debugLabel = 'activeSchema';

export const activeSchemaPropertiesGetter = atom<Property[]>(get => {
  const properties: Property[] = [];
  const schema = get(activeSchemaGetter);
  if (schema?.properties !== undefined) {
    properties.push(...schema.properties);
  }
  return properties;
});
activeSchemaPropertiesGetter.debugLabel = 'activeSchemaProperties';
