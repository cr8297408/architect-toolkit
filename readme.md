# Architect Toolkit

Este repositorio está diseñado para facilitar el uso de diferentes patrones de diseño en proyectos de desarrollo de software, proporcionando una estructura modular y organizada para implementar soluciones escalables y reutilizables. Dentro del repositorio, se incluyen implementaciones de patrones como el Builder, State, Repository, y Specification, además de una amplia gama de errores personalizados que permiten manejar situaciones específicas de la aplicación.

## Contenidos

- [Características](#características)
- [Instalación](#instalación)
- [Uso](#uso)
  - [Builder Pattern](#builder-pattern)
  - [Step Pattern](#step-pattern)
  - [State Pattern](#state-pattern)
  - [Repository Pattern](#repository-pattern)
  - [Command Pattern](#command-pattern)

## Características

- Implementaciones de patrones de diseño como Builder, State, Repository, Specification.
- Módulos para trabajar con bases de datos como Cassandra y MongoDB.
- Manejo de errores personalizados para situaciones como fallos de red, base de datos, validación de datos, etc.
- Conversión de nomenclaturas entre diferentes formatos como camelCase, snake_case, kebab-case, etc.

## Instalación

Sigue estos pasos para instalar y configurar el proyecto en tu entorno local:

```bash
# Clonar el repositorio
git clone https://github.com/cr8297408/architect-toolkit

# Navegar al directorio del proyecto
cd architect-toolkit

# Instalar dependencias
npm install
```

## Uso

A continuación se presentan algunos ejemplos de uso con base en los archivos y módulos proporcionados:

### Builder Pattern

Ejemplo de uso del Builder Pattern para construir consultas en Cassandra:

```typescript
import { GeneralCassandraQueryBuilder, CassandraOperator } from '@codismart/architect-toolkit';

export class ExampleBuilder extends GeneralCassandraQueryBuilder<IExample> {
  constructor(props) {
    super({
      ...props,
      tableName: 'example',
    });
  }

  whereConditionUuid(uuid: string): this {
    this.where('uuid', CassandraOperator.EQUALS, uuid);
    return this;
  }
}

const builder = new ExampleBuilder({ keyspace: 'example_keyspace' });
builder.whereConditionUuid('123e4567-e89b-12d3-a456-426614174000');
builder.set('name', 'John');
const resultBuild = builder.buildUpdateQuery();
console.log(resultBuild); // { query: UPDATE example_keyspace.example SET name = ? WHERE uuid = ?, parameters: ['John', '123e4567-e89b-12d3-a456-426614174000'] }

```

Ejemplo de uso del Builder Pattern para construir consultas en SQL:

```typescript
class ConfigurationUpdateBuilder extends GeneralSQLQueryBuilder<Configuration> {
  constructor(options: IGeneralSqlQueryBuilderOptions) {
    super(options);
  }

  whereConditionUuid(uuid: string): this {
    this.where('conditionUuid', SqlOperator.EQUALS, uuid);
    return this;
  }
}

const builder = new ConfigurationUpdateBuilder({ tableName: 'configurations' });
builder.whereConditionUuid('123e4567-e89b-12d3-a456-426614174000');
builder.set('name', 'John');
const resultBuild = builder.buildUpdateQuery();
console.log(resultBuild); // { query: UPDATE configurations SET name = ? WHERE conditionUuid = ?, parameters: ['John', '123e4567-e89b-12d3-a456-426614174000'] }
```

## Step Pattern

Ejemplo de uso del Step Pattern para abstraer la lógica de un proceso en diferentes etapas:

```typescript

import { Step } from '@codismart/architect-toolkit';

class ExampleStep extends Step {
  name = 'ExampleStep';
  async exec(state: State): Promise<void> {
    // TODO: Implement your logic here
  }
}

class ExampleStep2 extends Step {
  name = 'ExampleStep2';
  async exec(state: ExampleState): Promise<void> {
    // TODO: Implement your logic of second step here
    console.log(state.uuid);
  }
}



```

### State Pattern

Ejemplo de uso del State Pattern para manejar el estado de una entidad en una aplicación:

```typescript
import { State } from '@codismart/architect-toolkit';

class ExampleState extends State<IExample> {
  #uuid: string;
  constructor(example: IExample) {
    super();
    this.#uuid = example.uuid;
  }  

  set uuid(uuid: string) {
    this.#uuid = uuid;
  }

  get uuid(): string {
    return this.#uuid;
  }
}
```

Ejemplo de uso del State Pattern combinado con el Step Pattern para crear una cadena de responsabilidades que ejecute diferentes procesos en orden:

```typescript

import { ExampleState } from '../state/ExampleState';
import { ExampleStep } from '../step/ExampleStep';
import { StateMachine } from '@codismart/architect-toolkit';

const yourExampleServiceOrModule = (example: IExample) => {
  const state = new ExampleState(example);

  await state.accept(new ExampleStep(state));
  await state.accept(new ExampleStep2(state));
  await state.accept(new ExampleStep3(state));
  // ... Todos los pasos que necesites
  await state.accept(new ExampleStepN(state));
}

```

### Repository Pattern

Ejemplo de uso del Repository Pattern para interactuar con una base de datos:

```typescript
import { Repository } from '@codismart/architect-toolkit';

class ConfigurationRepository extends Repository<Configuration> {
  constructor(private readonly dbService: DbService) {
    super();
  }

  async findAll(): Promise<Configuration[]> {
    const { query, parameters } = this.build();
    const result = await this.executeQuery(query, parameters);
    return result.rows.map((row) => this.mapRowToEntity(row));
  }

  async update(configuration: Configuration): Promise<Configuration> {
    const { query, parameters } = this.buildUpdateQuery(configuration);
    const result = await this.executeQuery(query, parameters);
    return this.mapRowToEntity(result.rows[0]);
  }

  // si usas specifications para tus filtros:
  async getExampleBySpecifications({
    specifications,
  }: exampleDependences): Promise<IExample[]> {
    const { sql, params } = this.combineFilterSpecifications(specifications);
    const query = `
      SELECT * FROM example
      WHERE ${sql}
    `;
    const result = await this.dbService.read(query, params);
    return result.map((row) => this.#rowToModel(row));
  }
}
```

## Command Pattern

Ejemplo de uso del Command Pattern para implementar un comando en una el update de una aplicación:

```typescript
import { ICommand, GeneralCommandManager } from '@codismart/architect-toolkit';

class UpdateExampleCommand implements ICommand {
  private oldExample: IExample;
  constructor(
    private id: string,
    private exampleNewData: Partial<IExample>,
    private repository: Repository<IExample>
  ) {}

  // metodo para ejecutar el comando
  async execute(): Promise<void> {
    this.oldExample = await this.repository.getById(this.id);
    await this.repository.update(this.id, this.exampleNewData);
  }

  // metodo para revertir los cambios
  async undo(): Promise<void> {
    await this.repository.update(this.id, this.oldExample);
  }
}

async function yourServideOrModule(exampleId: string, updateData: Partial<IExample>): Promise<void> {
  const productRepository = new ExampleRepository();
  const invoker = new GeneralCommandManager();

  const command = new UpdateExampleCommand(exampleId, updateData, productRepository);
  invoker.addCommand(command);

  await invoker.executeSingleCommand();
}
```
