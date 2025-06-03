# Know-Hive API
Essa é a implementaçao do backend da aplicação Know-Hive, uma plataforma de questões acadêmicas, que permite que os usuários criem, respondam e compartilhem questões de forma colaborativa.

## Inicializar o projeto

```bash
$ git clone https://github.com/Alan-Augusto/know-hive-api-v2
$ cd know-hive-api-v2
```
```bash
$ npm install
```

## Compilar e executar o projeto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testar o projeto

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Nest CLI
Caso não tenha o Nest CLI instalado, instale-o globalmente com o comando:
```bash
$ npm i -g @nestjs/cli
```

Para gerar uma nova entidade completa com controller, service e dto, utilize o comando abaixo:
```bash
$ nest g resource <nome-recurso>
```

## Prisma
Para gera uma nova migration aplicando todas as alteraçoes pendentes no s modelos de banco presente em ./psrima/schema.prisma:
```bash
npx prisma migrate dev --name <nome-migration>
```

Para rodas as migrations pendentes, utilize o comando:
```bash
npx prisma migrate deploy
```

Para formatar o arquivo de esquema do Prisma, utilize o comando:
```bash
npx prisma format
```
