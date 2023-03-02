# Assignment Backend for Advanced Web Front-ends (Spring 2023)

This repository contains the backend for the student assignment of Advanced Web
Front-ends course. The backend uses JSON file as its database instead of MongoDb
and doesn't require any external programs or services.

## Requirements

**Node >= 16.0.0**

This server requires Node version 16 or later. All javascript files use ES6 modules
and Node requires the file extension to be ``.mjs`` instead of ``.js``

## Installation

```
npm install
```

## Reset Database

Database starts out empty but initial set of users and products can be saved
to the database with the following command:

```
npm run reset-db
```

Database is saved to ``db/db.json`` and it can be reset again with the above command.
If you want to start with empty database just delete the file ``db/db.json``



## Running server

```
npm start
```

Server listens on port _3001_. You can define a different port inside ``nodemon.json``
file.

## API documentation

API documentation can be viewed in the address http://localhost:3001/

The documentation can also be found in the file ``public/index.html``

Server uses cookies and JWT tokens for user authentication and expects the token
to be delivered inside a cookie.

A token can be received via login at http://localhost:3001/api/login (See API documentation)

## Project file hierarchy

```
.
├── controllers
│   ├── order.mjs
│   ├── product.mjs
│   └── user.mjs
├── db
│   ├── reset
│   │   ├── products.json
│   │   └── users.json
│   ├── db.mjs
│   └── reset-db.mjs
├── middleware
│   ├── auth.mjs
│   └── requireJson.mjs
├── models
│   ├── schemas
│   │   ├── id.mjs
│   │   ├── order.mjs
│   │   ├── product.mjs
│   │   └── user.mjs
│   ├── base.mjs
│   ├── order.mjs
│   ├── product.mjs
│   └── user.mjs
├── public
│   └── index.html
├── routes
│   └── api.mjs
├── app.mjs
├── .gitignore
├── index.mjs
├── nodemon.json
├── package.json
├── README.md
└── router.mjs
```

