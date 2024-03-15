# splitewise-clone

# Quick Start

### First run database on docker

```
$ docker compose up
```

### Start the server

```
$ npm start dev
```

### To migrate database to the latest update

```
$ knex migrate:latest
```

### To rollback all the completed migrations:

```
$ knex migrate:rollback --all
```
