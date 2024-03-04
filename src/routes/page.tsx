import {
  Flex,
  Input,
  Select,
  SelectProps,
  Table,
  TableProps,
  Button,
} from 'antd';
import './index.scss';
import { useAtom, useAtomValue } from 'jotai';
import JsonSchemaGenerator from '@/utils/JsonSchemaGenerator';
import { Property } from '@/domains/Schema';
import {
  rootSchemaNameAtom,
  inputJsonAtom,
  activeSchemaNameAtom,
  schemasAtom,
  activeSchemaPropertiesGetter,
} from '@/stores/AppStore';

const generator = new JsonSchemaGenerator();

const Index = () => {
  const [rootSchemaName, setRootSchemaName] = useAtom(rootSchemaNameAtom);
  const [inputJson, setInputJson] = useAtom(inputJsonAtom);
  const [activeSchemaName, setActiveSchemaName] = useAtom(activeSchemaNameAtom);
  const [schemas, setSchemas] = useAtom(schemasAtom);
  const activeSchemaProperties = useAtomValue(activeSchemaPropertiesGetter);

  const schemaOptions: SelectProps['options'] = [];
  for (const schema of schemas) {
    schemaOptions.push({
      key: schema.name,
      label: schema.name,
      value: schema.name,
    });
  }

  const columns: TableProps<Property>['columns'] = [
    {
      key: 'name',
      title: '属性',
      dataIndex: 'name',
    },
    {
      key: 'types',
      title: '类型',
      dataIndex: 'types',
      render: (types: Property['types']) => {
        return `${types.join(' | ')}`;
      },
    },
    {
      key: 'buttons',
      title: '操作',
      dataIndex: 'name',
      render: (field: string, record: Property) => {
        const buttons: React.ReactNode[] = [];
        const hasAny =
          record.types.filter(
            t =>
              t === 'any' ||
              t === 'any[]' ||
              t === 'object' ||
              t === 'object[]',
          ).length > 0;
        if (hasAny) {
          buttons.push(<Button>继续解析</Button>);
        }
        return buttons;
      },
      width: 100,
    },
  ];

  function parse() {
    console.info('开始解析');
    try {
      const json = JSON.parse(inputJson);
      generator.parse(rootSchemaName, json);
      setSchemas(generator.schemas);
    } catch (error) {
      console.error('JSON解析出错：', error);
    }
  }

  return (
    <Flex>
      <Flex
        flex={1}
        vertical
        style={{ marginTop: 8, marginRight: 4, marginBottom: 8, marginLeft: 8 }}
        gap={8}
      >
        <Flex gap={8}>
          <Input
            value={rootSchemaName}
            placeholder={'模式名称'}
            onChange={event => setRootSchemaName(event.target.value)}
          />
          <Button type={'primary'} onClick={() => parse()}>
            解析
          </Button>
        </Flex>
        <Input.TextArea
          value={inputJson}
          autoSize={{ minRows: 38 }}
          onChange={event => setInputJson(event.target.value)}
        />
      </Flex>
      <Flex
        flex={1}
        vertical
        gap={8}
        style={{ marginTop: 8, marginRight: 4, marginBottom: 8, marginLeft: 8 }}
      >
        <Select
          value={activeSchemaName}
          options={schemaOptions}
          placeholder={'请选择模式'}
          onChange={value => {
            console.info('模式切换为：', value);
            setActiveSchemaName(value);
          }}
        />
        <Table columns={columns} dataSource={activeSchemaProperties} />
      </Flex>
      <Flex
        flex={1}
        vertical
        style={{ marginTop: 8, marginRight: 8, marginBottom: 8, marginLeft: 4 }}
      >
        <Input.TextArea disabled autoSize={{ minRows: 40 }} />
      </Flex>
    </Flex>
  );
};

export default Index;
