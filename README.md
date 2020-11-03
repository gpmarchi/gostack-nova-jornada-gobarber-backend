# GoBarber back-end

<p align="center">
  <span>Português</span> |
  <a href="https://github.com/gpmarchi/gostack-nova-jornada-gobarber-backend/blob/master/lang/english/README.md#fastfeet-back-end">English</a>
</p>

Projeto desenvolvido como exercício do Bootcamp Gostack 13 da Rocketseat, para uma aplicação de controle de agendamentos de clientes pelos prestadores de serviço de uma barbearia, a GoBarber.

Sempre que um novo agendamento for feito com sucesso por um cliente, uma notificação é cadastrada para o prestador relacionado e fica armazenada dentro de uma collection do MongoDB para posterior exibição.

Algumas das consultas mais comuns de serem feitas pelos clientes, como por exemplo a listagem dos prestadores de serviço e os agendamentos de um dia para determinado prestador, são mantidas em cache através do Redis. Sempre que um novo usuário prestador for cadastrado ou um novo agendamento feito, é feita a invalidação do cache para que as listagens sejam atualizadas nas próximas consultas.

API desenvolvida em Node.js com TypeScript, Express, ESLint, Prettier e EditorConfig. Arquitetura baseada nos princípios do SOLID com apoio dos patterns DTO, Model, Service e Repository, possibilitando a construção de uma aplicação totalmente modularizada e de fácil manutenção/extensibilidade.

Também foi utilizada a técnica de TDD através de testes unitários aplicados no desenvolvimento das regras de negócio da aplicação (services).

Foi aplicada uma estratégia de proteção de limite de requisições para a API dentro de um intervalo de tempo através do `rate-limiter-flexible`. Dessa forma evita-se que requisições em quantidade indevida sejam feitas. Além disso foi utilizada a biblioteca `helmet` para proteger a API contra os ataques mais comuns feitos a servidores desse tipo.

## Índice

- [Tecnologias e libs utilizadas](#-tecnologias-e-libs-utilizadas)
- [Requisitos iniciais](#-requisitos-iniciais)
- [Instalação](#-instalação)
- [Configurações](#-configurações)
- [Rodando o projeto](#-rodando-o-projeto)
- [Testando as funcionalidades](#-testando-as-funcionalidades)
- [Rotas da aplicação](#-rotas-da-aplicação)
- [Testes automatizados](#-testes-automatizados)

## 🤖️ Tecnologias e libs utilizadas

Abaixo seguem as tecnologias utilizadas no desenvolvimento do projeto:

- [Node.js](https://nodejs.org/en/download/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [TypeORM](https://typeorm.io/#/)
- [Postgres](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [MongoDB](https://www.mongodb.com/)
- [multer](https://github.com/expressjs/multer)
- [ioredis](https://github.com/luin/ioredis)
- [date-fns](https://date-fns.org/)
- [handlebars](https://handlebarsjs.com/)
- [jsonwebtoken](https://jwt.io/)
- [nodemailer](https://nodemailer.com/about/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme)
- [celebrate](https://github.com/arb/celebrate)
- [class-transformer](https://github.com/typestack/class-transformer)
- [helmet](https://github.com/helmetjs/helmet)
- [rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible)
- [tsyringe](https://github.com/helmetjs/helmet)
- [uuid](https://github.com/uuidjs/uuid#readme)

- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [ts-node-dev](https://github.com/whitecolor/ts-node-dev)
- [babel](https://babeljs.io/)
- [jest](https://jestjs.io/)

## ✔️ Requisitos iniciais

Para poder rodar o projeto, é necessário que os itens abaixo estejam instalados e executando:

- [Node.js](https://nodejs.org/en/download/) (v12.x.x)
- [npm](https://www.npmjs.com/get-npm) ou [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/download)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [git](https://git-scm.com/downloads)

### Opcionais

- [Postbird](https://www.electronjs.org/apps/postbird) (ou outro cliente para acesso ao banco de dados)
- [Insomnia](https://insomnia.rest/download/) (ou outro cliente REST para acesso às rotas da API)
- [docker](https://www.docker.com/)

Sugiro a instalação do docker com containeres para os bancos de dados utilizados na aplicação, PostgreSQL, MongoDB e Redis.

Caso opte pela utilização dos containeres, você pode rodar os comandos abaixo para instalá-los:

```bash
docker run -d --name postgres -e POSTGRESQL_PASSWORD=<password> -p 5432:5432 postgres
```

```bash
docker run -d --name mongodb -p 27017:27017 mongo
```

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

## 🔔️ Instalação

Para instalar o projeto localmente na sua máquina, clonar o repositório:

```bash
$ git clone https://github.com/gpmarchi/gostack-nova-jornada-gobarber-backend && cd gostack-nova-jornada-gobarber-backend
```

Rodar o comando abaixo para instalar as dependências:

```bash
$ yarn install
```

## ⚙️ Configurações

Será necessário configurar algumas variáveis de ambiente necessárias para rodar o projeto. Deverá ser criado um arquivo chamado `.env` na raiz do projeto (utilizar como exemplo o arquivo `.env.example` também presente na raiz do projeto).

As informações que deverão ser preenchidas:

```env
APP_SECRET=<senha jwt utilizada para geração do token JWT>

APP_API_URL=http://<endereço de ip da máquina rodando a api>:3333
APP_WEB_URL=http://<endereço de ip da máquina rodando o front-end>:3000

# Storage [disk (dev) | cloudinary (produção)]
STORAGE_DRIVER=disk
CLOUDINARY_URL=<url para o serviço da Cloudinary para upload de imagens>

# Mail [ethereal (dev) | sendgrid (produção)]
MAIL_DRIVER=ethereal
SENDGRID_API_KEY=<chave para acesso à API do Sendgrid para envio de e-mails>

# Redis
REDIS_HOST=<endereço de ip da máquina rodando o redis>
REDIS_PORT=<porta do redis>
REDIS_PASS=<senha do redis> (opcional)
```

Por padrão temos dois provedores pré configurados para armazenamento de arquivos (`disk`) e envio de e-mails (`ethereal`) em ambiente de desenvolvimento. Numa possível utilização do projeto em ambiente de produção temos a possibilidade de utilização dos provedores para os serviços do `cloudinary` e `sendgrid` respectivamente para essas tarefas.

No caso de utilização desses serviços será necessário preencher as variáveis `CLOUDINARY_URL` e `SENDGRID_API_KEY` com os dados da sua conta em cada plaforma.

Também será necessário configurar os acessos aos bancos de dados, que deverão estar presentes no arquivo `ormconfig.json` na raiz do projeto (utilizar como exemplo o arquivo `ormconfig.example.json` também presente na raiz do projeto).

```json
[
  {
    "name": "default",
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "postgres",
    "database": "gostack-gobarber",
    "entities": [
      "./src/modules/**/infra/typeorm/entities/*.ts"
    ],
    "migrations": [
      "./src/shared/infra/typeorm/migrations/*.ts"
    ],
    "cli": {
      "migrationsDir": "./src/shared/infra/typeorm/migrations"
    }
  },
  {
    "name": "mongo",
    "type": "mongodb",
    "host": "localhost",
    "port": 27017,
    "database": "gostack-gobarber",
    "useUnifiedTopology": true,
    "entities": [
      "./src/modules/**/infra/typeorm/schemas/*.ts"
    ]
  }
]
```

É importante frisar que a base de dados do PostgreSQL deve ser criada com o mesmo nome preenchido na variável `database`. Conforme citado anteriormente, foi utilizado o TypeORM para fazer a integração com os bancos de dados PostgreSQL e MongoDB.

O PostgreSQL foi utilizado para o armazenamento de todos os dados transacionais da aplicação, e o MongoDB para o armazenamento de notificações aos prestadores de serviço sempre que receberem um novo agendamento.

As configurações de dialeto para outros bancos devem seguir as opções presentes na documentação do [TypeORM](https://typeorm.io/#/connection-options), caso deseje utilizar uma outra opção de banco de dados.

### Rodando migrations

Para criar as tabelas necessárias ao funcionamento da aplicação, utilizaremos o script `typeorm` (presente dentro do arquivo `package.json`) para rodar os comandos necessários. A criação das tabelas e relacionamentos será feita através do comando:

```bash
yarn typeorm migration:run
```

Caso precise reverter a execução das migrations no banco por alguma razão, basta executar o comando:

```bash
yarn typeorm migration:revert
```

## 🏃️🏃‍♀️️ Rodando o projeto

A partir desse momento o ambiente já está preparado para rodarmos a API. Para iniciar o servidor em modo de desenvolvimento rodar o comando:

```bash
yarn run dev:server
```

O servidor ficará rodando com live reload, habilitado através do `ts-node-dev`. Caso seja necessário, através da execução desse mesmo comando é possível debugar a aplicação, apenas sendo necessário conectar ao debugger através do vscode com as configurações disponibilizadas na sequência:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "protocol": "inspector",
      "restart": true,
      "name": "Debug",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "outFiles": [
        "${workspaceFolder}/**/*.js"
      ],
    }
  ]
}
```

## 👨‍💻️ Testando as funcionalidades

As funcionalidades da aplicação poderão ser testadas manualmente através do workspace do Insomnia, cliente REST escolhido como apoio para o desenvolvimento da API.

Através do botão abaixo é possível importar esse workspace em sua máquina caso já tenha o Insomnia instalado. Basta clicar no botão e seguir os passos para finalizar a importação.

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=GoBarber%20back-end%20API&uri=https%3A%2F%2Fgithub.com%2Fgpmarchi%2Fgostack-nova-jornada-gobarber-backend%2Fblob%2Fmaster%2Finsomnia-workspace.json)

## 🛣 Rotas da aplicação

Abaixo temos uma breve descrição do funcionamento das rotas da aplicação. As rotas estão agrupadas de acordo com o recurso representado dentro da aplicação:

- [Sessions](#sessions)
- [Users](#users)
- [Providers](#providers)
- [Profile](#profile)
- [Password](#password)
- [Appointments](#appointments)

Com exceção das rotas de login, de criação de um novo usuário, do envio de e-mail para reset de senha e de reset de senha, todas as demais são protegidas e precisam enviar no cabeçalho da requisição (`Bearer Token`) o token JWT recebido na resposta da da requisição à rota `/sessions`.

### Sessions

- **`POST /sessions`**: Essa rota é responsável por logar um usuário na aplicação. Ela recebe dentro do corpo da requisição o `email` e `password` para realizar a autenticação, e retorna uma resposta contendo um objeto `user` com os dados do usuário logado e o `token` no formato JWT que deverá ser utilizado nas demais requisições a rotas protegidas.

    ```json
    {
      "user": {
        "id": "f15f2071-7fb1-42a9-bc83-79653738b5f8",
        "name": "Provider",
        "email": "provider@email.com",
        "avatar": null,
        "created_at": "2020-11-02T23:15:13.138Z",
        "updated_at": "2020-11-02T23:15:13.138Z",
        "avatar_url": null
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDQzNDgyNDEsImV4cCI6MTYwNDQzNDY0MSwic3ViIjoiZjE1ZjIwNzEtN2ZiMS00MmE5LWJjODMtNzk2NTM3MzhiNWY4In0.k-Epu5dYZohHWBPCaGRj6Ha4vUmYs2rm6C2X7pV49Dw"
    }
    ```

### Users

- **`POST /users`**: Essa rota é responsável por cadastrar um usuário na aplicação. Ela recebe dentro do corpo da requisição os campos `name`, `email` e `password`. Ao cadastrar corretamente o usuário, um objeto contendo os dados registrados é retornado.

  ```json
  {
    "name": "Provider",
    "email": "provider@email.com",
    "id": "f15f2071-7fb1-42a9-bc83-79653738b5f8",
    "created_at": "2020-11-02T23:15:13.138Z",
    "updated_at": "2020-11-02T23:15:13.138Z",
    "avatar_url": null
  }
  ```

- **`PATCH /users/avatar`**: Essa rota é responsável por atualizar um usuário, associando uma imagem de avatar ao seu perfil. Ela recebe no corpo da requisição um conteúdo `Multipart` com o campo `avatar` indicando o caminho para o arquivo da imagem desejada. Ao atualizar corretamente o usuário, um objeto contendo os dados registrados é retornado.

  ```json
  {
    "id": "f15f2071-7fb1-42a9-bc83-79653738b5f8",
    "name": "Provider",
    "email": "provider@email.com",
    "avatar": "f9b7f94f8131b77c832f-avatar.jpg",
    "created_at": "2020-11-02T23:15:13.138Z",
    "updated_at": "2020-11-02T23:22:51.566Z",
    "avatar_url": "http://192.168.0.27:3333/files/f9b7f94f8131b77c832f-avatar.jpg"
  }
  ```

### Providers

- **`GET /providers`**: Essa rota é responsável por listar os prestadores de serviço cadastrados. Essa listagem fica registrada em cache através do Redis, sendo invalidada toda vez que um novo prestador for cadastrado. Ao pesquisar os dados, um array contendo objetos com os prestadores é retornado.

  ```json
  [
    {
      "id": "db604386-ea0b-408d-a784-3a9a125be678",
      "name": "Provider",
      "email": "provider@email.com",
      "avatar": null,
      "created_at": "2020-11-03T17:10:07.509Z",
      "updated_at": "2020-11-03T17:10:07.509Z",
      "avatar_url": null
    },
    {
      "id": "0202b601-e91a-4678-99dd-980a350a36fb",
      "name": "Provider 2",
      "email": "provider_2@email.com",
      "avatar": null,
      "created_at": "2020-11-03T17:11:39.153Z",
      "updated_at": "2020-11-03T17:11:39.153Z",
      "avatar_url": null
    }
  ]
  ```

- **`GET /providers/:id/month-availability`**: Essa rota é responsável por listar as disponibilidades de horário em cada dia de determinado mês, para o prestador de serviços informado no parâmetro `id` da rota. A rota recebe como parâmetros de query os campos `month` e `year`, indicando qual mês está sendo pesquisado pelo usuário cliente. Ao pesquisar as disponibilidades do prestador desejado, um array contendo objetos indicando a disponibilidade de cada dia é retornado.

  ```json
  [
    {
      "day": 1,
      "available": false
    },
    {
      "day": 2,
      "available": false
    },
    {
      "day": 3,
      "available": true
    },
    {
      "day": 4,
      "available": true
    },
    {
      "day": 5,
      "available": true
    },
    {
      "day": 6,
      "available": true
    },
    {
      "day": 7,
      "available": true
    },
    {
      "day": 8,
      "available": true
    },
    {
      "day": 9,
      "available": true
    },
    {
      "day": 10,
      "available": true
    },
    {
      "day": 11,
      "available": true
    },
    {
      "day": 12,
      "available": true
    },
    {
      "day": 13,
      "available": true
    },
    {
      "day": 14,
      "available": true
    },
    {
      "day": 15,
      "available": true
    },
    {
      "day": 16,
      "available": true
    },
    {
      "day": 17,
      "available": true
    },
    {
      "day": 18,
      "available": true
    },
    {
      "day": 19,
      "available": true
    },
    {
      "day": 20,
      "available": true
    },
    {
      "day": 21,
      "available": true
    },
    {
      "day": 22,
      "available": true
    },
    {
      "day": 23,
      "available": true
    },
    {
      "day": 24,
      "available": true
    },
    {
      "day": 25,
      "available": true
    },
    {
      "day": 26,
      "available": true
    },
    {
      "day": 27,
      "available": true
    },
    {
      "day": 28,
      "available": true
    },
    {
      "day": 29,
      "available": true
    },
    {
      "day": 30,
      "available": true
    }
  ]
  ```

- **`GET /providers/:id/day-availability`**: Essa rota é responsável por listar as disponibilidades de horário de determinado dia, para o prestador de serviços informado no parâmetro `id` da rota. A rota recebe como parâmetros de query os campos `day`, `month` e `year`, indicando qual dia do mês está sendo pesquisado pelo usuário cliente. Ao pesquisar as disponibilidades do prestador desejado, um array contendo objetos indicando a disponibilidade de cada horário do dia pesquisado é retornado.

  ```json
  [
    {
      "hour": 8,
      "available": false
    },
    {
      "hour": 9,
      "available": false
    },
    {
      "hour": 10,
      "available": false
    },
    {
      "hour": 11,
      "available": false
    },
    {
      "hour": 12,
      "available": false
    },
    {
      "hour": 13,
      "available": true
    },
    {
      "hour": 14,
      "available": true
    },
    {
      "hour": 15,
      "available": true
    },
    {
      "hour": 16,
      "available": true
    },
    {
      "hour": 17,
      "available": true
    }
  ]
  ```

### Profile

- **`GET /profile`**: Essa rota é responsável por exibir os dados do perfil do usuário logado na aplicação. Quando o usuário logado utilizar essa rota, seus dados serão retornados.

  ```json
  {
    "id": "f15f2071-7fb1-42a9-bc83-79653738b5f8",
    "name": "Provider",
    "email": "provider@email.com",
    "avatar": "f9b7f94f8131b77c832f-avatar.jpg",
    "created_at": "2020-11-02T23:15:13.138Z",
    "updated_at": "2020-11-02T23:22:51.566Z",
    "avatar_url": "http://192.168.0.27:3333/files/f9b7f94f8131b77c832f-avatar.jpg"
  }
  ```

- **`PUT /profile`**: Essa rota é responsável por atualizar os dados do perfil do usuário logado na aplicação. Quando o usuário logado utilizar essa rota, seus dados atualizados serão retornados.

  ```json
  {
    "id": "f15f2071-7fb1-42a9-bc83-79653738b5f8",
    "name": "Some Provider",
    "email": "provider2@email.com",
    "avatar": "f9b7f94f8131b77c832f-avatar.jpg",
    "created_at": "2020-11-02T23:15:13.138Z",
    "updated_at": "2020-11-02T23:26:06.921Z",
    "avatar_url": "http://192.168.0.27:3333/files/f9b7f94f8131b77c832f-avatar.jpg"
  }
  ```

### Password

- **`POST /password/forgot`**: Essa rota é responsável por enviar um e-mail de recuperação de senha ao usuário. Ela recebe dentro do corpo da requisição o campo `e-mail`, contendo o e-mail para o qual se deseja realizar a recuperação da senha. Ao informar o e-mail cadastrado, uma resposta sem conteúdo com o status 204 é retornada. Neste momento um email é enviado com um token especialmente gerado para realizar o reset da senha e garantir a identidade do usuário.

  Dentro do ambiente de desenvolvimento, uma url para o serviço do `ethereal` é gerada no console indicando o correto funcionamento do envio da mensagem. Uma url no formato a seguir é mostrada no console, e se clicada levará a uma página contendo um preview do e-mail de recuperação:

  `https://ethereal.email/message/X6BnMDotihAgxflOX6BsSnowwzSyKhfXAAAAARyVD57AuYhyjpJmg.cNmoY`

  A mensagem conterá um link para o formulário de reset de senha no front-end da aplicação.

- **`POST /password/reset`**: Essa rota é responsável por resetar a senha do usuário. Ela recebe dentro do corpo da requisição os campos `password`, `password_confirmation` e `token`, contendo a nova senha, a confirmação da nova senha e o token especialmente gerado para a realização do reset da senha.

  Ao informar corretamente os dados para o reset da senha, uma resposta sem conteúdo com o status 204 é retornada ao usuário indicando a finalização da troca da senha.

  O token tem uma validade de apenas 2 horas a contar do momento da sua criação dentro da aplicação. Se o reset da senha não for feito dentro desse período, o token estará invalidado e o usuário terá que solicitar novamente o reset da sua senha.

### Appointments

- **`POST /appointments`**  : Essa rota é responsável por cadastrar um novo agendamento para determinado prestador pelo usuário cliente logado, em determinada data. Ela recebe dentro do corpo da requisição os campos `provider_id` e `date` indicando o id do prestador de serviços e a data em que deverá ser feito o agendamento. O resultado dessa rota é a criação de um novo agendamento, com os seguintes dados retornados.

  ```json
  {
    "provider_id": "20b721ab-3b80-468c-b91a-2706fd47b320",
    "user_id": "f15f2071-7fb1-42a9-bc83-79653738b5f8",
    "date": "2020-11-03T11:00:00.000Z",
    "id": "e9e4234a-95b3-410b-b993-5d873cf6e5e0",
    "created_at": "2020-11-03T00:01:18.017Z",
    "updated_at": "2020-11-03T00:01:18.017Z"
  }
  ```

- **`GET /appointments/me`**  : Essa rota é responsável por retornar os agendamentos existentes em determinado dia, criados para o prestador de serviços logado. A rota recebe nos parâmetros de query os campos `day`, `month` e `year` que devem conter os valores correspondentes ao dia a ser pesquisado. O resultado dessa rota é uma listagem contendo todos os agendamentos criados para o prestador logado na data especificada nos parâmetros, com os detalhes do cliente. Essa listagem também é armazenada em cache e invalidada sempre que um novo agendamento for criado no mesmo dia.

  ```json
  [
    {
      "id": "27d81ff7-45ed-43c3-a6d1-e30b7f052eee",
      "provider_id": "db604386-ea0b-408d-a784-3a9a125be678",
      "user_id": "20b721ab-3b80-468c-b91a-2706fd47b320",
      "date": "2020-11-03T15:00:00.000Z",
      "created_at": "2020-11-03T17:18:42.169Z",
      "updated_at": "2020-11-03T17:18:42.169Z",
      "user": {
        "id": "20b721ab-3b80-468c-b91a-2706fd47b320",
        "name": "User",
        "email": "user@email.com",
        "avatar": "a50f26f374fcd8c26046-profile.jpg",
        "created_at": "2020-08-07T19:17:26.346Z",
        "updated_at": "2020-10-05T23:06:52.229Z",
        "avatar_url": "http://192.168.0.27:3333/files/a50f26f374fcd8c26046-profile.jpg"
      }
    }
  ]
  ```
## 🤹 Testes automatizados

Conforme mencionado anteriormente, as regras de negócio presentes nos `services` foram todas desenvolvidas utilizando a técnica de TDD.

Para estes componentes da arquitetura foram utilizados testes unitários de forma que os testes não dependam de nenhuma bibloteca externa a aplicação.

Os testes seguem o padrão de nomes `NomeDoService.spec.ts` e podem ser encontrados dentro da mesma pasta onde o service correspondente ao teste está localizado.

Para rodar os testes, utilizar o comando abaixo:

```bash
yarn test
```

Caso queira gerar o relatório de cobertura dos testes, utilizar o comando abaixo:

```bash
yarn test --coverage
```

O relatório gerado pode ser visualizado através do arquivo `coverage/lcov-report/index.html`, na raiz do projeto.
