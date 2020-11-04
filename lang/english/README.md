# GoBarber back-end

<p align="center">
  <a href="https://github.com/gpmarchi/gostack-nova-jornada-gobarber-backend">Português</a> |
  <span>English</span>
</p>

Project developed as an exercise for Rocketseat's GoStack 13 Bootcamp. It's an application for controlling client appointments by service providers working in thematic barber shop, GoBarber.

Every time a new appointment is successfully created by a client, a notification is also created for the associated service provider an is stored inside a MongoDB's collection for future display.

Some of the most common queries done by customers, for instance the service providers listing and the day´s appointments for any given provider, are mantained in cache by using Redis. Every time a new provider is registered in the application or a new appointment gets done, an invalidation of these caches are performed so that the listings are updated on the next queries made.

API developed using Node.js with TypeScript, Express, Eslint, Prettier and EditorConfig. Architecture based on SOLID principles with support from patterns like DTO, Model, Service and Repository, allowing the contruction of an application fully modularized and easy to mantain/extend.

TDD was also used, specifically unit tests in the development cycle of the application's business rules contained in services.

A protection strategy for limiting the allowed number of requests to the API inside a time interval was used, through `rate-limiter-flexible`. This way the flooding of malicious requests is avoided. Besides that, `helmet` library was used to protect the API against the most common types of attacks made on this kind of server.

## Index

- [Technologies and libraries used](#-technologies-and-libraries-used)
- [Initial requirements](#-initial-requirements)
- [Installation](#-installation)
- [Configurations](#-configurations)
- [Running the project](#-running-the-project)
- [Testing functionalities](#-testing-functionalities)
- [Application routes](#-application-routes)
- [Automated tests](#-automated-tests)

## 🤖️ Technologies and libraries used

The following technologies were used in the project:

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

## ✔️ Initial requirements

In order to run the project it is necessary for the items bellow to be installed:

- [Node.js](https://nodejs.org/en/download/) (v12.x.x)
- [npm](https://www.npmjs.com/get-npm) ou [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/download)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [git](https://git-scm.com/downloads)

### Optionals

- [Postbird](https://www.electronjs.org/apps/postbird) (ou outro cliente para acesso ao banco de dados)
- [Insomnia](https://insomnia.rest/download/) (ou outro cliente REST para acesso às rotas da API)
- [docker](https://www.docker.com/)

I strongly suggest the use of docker containers for the databases used by the application, PostgreSQL, MongoDB and Redis.

In case you opt for using the containers, you can run the following commands to install them on your machine:

```bash
docker run -d --name postgres -e POSTGRESQL_PASSWORD=<password> -p 5432:5432 postgres
```

```bash
docker run -d --name mongodb -p 27017:27017 mongo
```

```bash
docker run -d --name redis -p 6379:6379 redis:alpine
```

## 🔔️ Installation

In order to install the project on your machine, you must clone the repository:

```bash
$ git clone https://github.com/gpmarchi/gostack-nova-jornada-gobarber-backend && cd gostack-nova-jornada-gobarber-backend
```

Run the following command to install it's dependencies:

```bash
$ yarn install
```

## ⚙️ Configurations

It will be necessary to configure environment variables to run the project. To do so, it's needed to create a file called `.env` inside the root folder of the project (you can use the `.env.example` file also present in the root folder as a guide).

These are the variables that need to be filled:

```env
APP_SECRET=<jwt secret for authentication token generation>

APP_API_URL=http://<ip address of the machine running the api>:3333
APP_WEB_URL=http://<ip address of the machine running the front-end>:3000

# Storage [disk (dev) | cloudinary (production)]
STORAGE_DRIVER=disk
CLOUDINARY_URL=<Cloudinary's image upload service url>

# Mail [ethereal (dev) | sendgrid (production)]
MAIL_DRIVER=ethereal
SENDGRID_API_KEY=<Sendgrid's API access key for e-mail sending>

# Redis
REDIS_HOST=<ip address of the machine running redis>
REDIS_PORT=<redis port>
REDIS_PASS=<redis password> (optional in development)
```

By default there are two pre configured providers for file storage (`disk`) and e-mail sending (`ethereal`) in development environment. In a production usage scenario of this project there are also two providers available, `cloudinary` and `sendgrid` respectively for these tasks.

In the case of usage of these services it's necessary to fill in the variables `CLOUDINARY_URL` and `SENDGRID_API_KEY` with data from your own accounts on each of these platforms.

It's also mandatory to configure database access which must be present in `ormconfig.json` file in the root of the project (use as an example `ormconfig.example.json` file also present in the root of the project).

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

It's important to notice that the PostgreSQL's database must be created with the same name filled in the `database` variable. As said before, TypeORM was used to integrate the aplication with the databases, PostgreSQL and MongoDB.

PostgreSQL was used to store all the application's transactional data, and MongoDB for storing provider's notifications every time they get a new appointment registered in their names.

Dialect configurations for other databases must follow options shared in [TypeORM's](https://typeorm.io/#/connection-options) documentation, in case of usage of another DBMS.

### Executing migrations

In order to create the necessary database tables for the correct running of the application, there's the `typeorm` script (present in `package.json` file). The creation of relationships and tables can be achieved by running the following command:

```bash
yarn typeorm migration:run
```

In case there's a need to revert the migrations execution in the database for some reason, use the command:

```bash
yarn typeorm migration:revert
```

## 🏃️🏃‍♀️️ Running the project

Going though all the previous steps have prepared the project to be run. To start the server in development mode, use the command below:

```bash
yarn run dev:server
```

The server will be running on live reload though `ts-node-dev`. If needed it's possible to debbug the application by running the same command as just mentioned, and then connecting to vscode's debugger by using the following configuration:

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

## 👨‍💻️ Testing functionalities

The application functionalities can be tested manually with the help of Insomnia's workspace, the chosen REST client for supporting development of the API.

Through the button bellow it's possible to import the workspace to your machine, once you already have Insomia installed. Just click on this button and follow the steps to finish the importing process.

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=GoBarber%20back-end%20API&uri=https%3A%2F%2Fgithub.com%2Fgpmarchi%2Fgostack-nova-jornada-gobarber-backend%2Fblob%2Fmaster%2Finsomnia-workspace.json)

## 🛣 Application routes

In this section we have a brief description of the functionalities of each route in the application. The routes are grouped by each resource represented in the application:

- [Sessions](#sessions)
- [Users](#users)
- [Providers](#providers)
- [Profile](#profile)
- [Password](#password)
- [Appointments](#appointments)

Apart from the login, new user registration, forgot password e-mail sending and password reset routes, all of the other application routes are protected and it's mandatory to send as a request header (`Bearer Token`), the JWT token generated by the login process, present in the response given by `/sessions` post route.

### Sessions

- **`POST /sessions`**: This route is responsible for logging in a user in the application. It receives as request body the `email` and `password` in order to perform the authentication, and in return it sends back a response containing the `user` object with data belonging to the logged in user and the `token` in JWT format, which from this point on must be used in all other protected route requests.

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

- **`POST /users`**: This route is responsible for registering a new user in the application. It receives as request body the fields `name`, `email` and `password`. By correctly registering the user, an object containing the registered data is returned.

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

- **`PATCH /users/avatar`**: This route is responsible for updating an user, associating an avatar image to the user's profile. It receives in the request body a `Multipart` content with the `avatar` field, containing the path to the desired image to be uploaded. By correctly updating the user's profile, an object with the updated data is returned.

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

- **`GET /providers`**: This route is responsible for listing the registered service providers. This listing gets registered in cache through Redis, being invalidated each time a new provider is registered. By querying data, an array containing objects representing the providers is returned.

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

- **`GET /providers/:id/month-availability`**: This route is responsible for listing the availability on each day of a given month, for the service provider informed in the `id` route parameter. The route receives as query parameters the fields `month` and `year`, indicating which month is being queried by the client user. By querying the availability of the intended provider, an array containing objects representing the availability of each day of the desired month is returned.

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

- **`GET /providers/:id/day-availability`**: This route is responsible for listing the time availability of a given day, for the service provider informed in the `id` route parameter. The route receives as query parameters the fields `day`, `month` and `year`, indicating which day of the month is being queried by the client user. By querying the availability of the intended provider, an array containing objects representing the individual availability of each time of day of the desired month is returned.

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

- **`GET /profile`**: This route is responsible for showing profile data of the logged in user. Whenever the logged in user calls this route, their data are returned.

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

- **`PUT /profile`**: This route is responsible for updating profile data of the logged in user. Whenever the logged in user calls this route, their updated data are returned.

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

- **`POST /password/forgot`**: This route is responsible for sending a password recovery e-mail to a user. It receives in the request body the `e-mail` field, containing the e-mail for which the user wishes to fullfill the password recovery process. By submitting the request, a 204 response without content is returned. In this moment an e-mail is sent to the designated address, with a generated token specifically meant for fullfilling the password reset, thus ensuring the user identity.

  In the development environment, an url pointing to the `ethereal` service is generated inside the console, indicating the correct sending of the e-mail message. An url in the following format is displayed on console, and if clicked will bring the developer to a page containing the recovery e-mail message preview:

  `https://ethereal.email/message/X6BnMDotihAgxflOX6BsSnowwzSyKhfXAAAAARyVD57AuYhyjpJmg.cNmoY`

  The message will contain a link to the front-end reset form.

- **`POST /password/reset`**: This route is responsible for resetting the password of a user. It receives in the request body the `password`, `password_confirmation` and `token` fields, containing the new password, new password confirmation and the generated token that must be used to actualize the password reset.

  By correctly informing all the necessary data for the password reset, a 204 response without content is returned indicating the successful password change.

  The token has a 2 hour validity starting from the moment of it's creation. If the password reset is not done inside this timeframe, the token will be invalidated and the user will have to restart the reset process.

### Appointments

- **`POST /appointments`**  : This route is responsible for registering a new appointment for any given service provider, by the logged in user on a certain date. It receives in the request body the `provider_id` and `date` fields, indicating the provider id an the date in which the appointment is supposed to be scheduled. The result of this route is the creation of a new appointment, with the following data returned.

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

- **`GET /appointments/me`**  : This route is responsible for returning the existent appointments created for a specific day, for the logged in service provider. The route receives as query parameters `day`, `month` and `year` fields, which must have the corresponding values to the day being queried. The response of this route is a listing with all the appointments created for the logged in provider on the specified date, with client details. This listing is also stored in cache and invalidated every time a new appointment is created on the same day, for this provider.

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

## 🤹 Automated tests

As mentioned previously, the business rules present in the `service` components of the architecture were all developed using test driven development.

For the services, unit tests were used together with dependency invertion/injection in order to guarantee no external dependency to third party libraries. This way the core application code remained loosely coupled, extensible and ready for any implementation changes when and if necessary.

The tests follow a naming convention, `NameOfService.spec.ts`, and can be found inside the same folder as the corresponding tested service is located.

To run the tests, use the following command:

```bash
yarn test
```

In case it's needed to generate the test coverage report, use the following command:

```bash
yarn test --coverage
```

The generated report can be found in the path `coverage/lcov-report/index.html`, starting from the root of the project.
