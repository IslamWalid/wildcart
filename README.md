# Wildcart

**Wildcart** is an e-commerce REST API.

**It provides three main elements:**
- `products`: represents anything a seller can offer on the website.
- `orders`: request made by the customers to obviously order and buy offered products.
- `product reviews`: gives the customer the space to send feedbacks about the products they bought or have an experience with.

**These main elements are manipulated with the provided endpoints through two types of users:**
- `customers`
- `sellers`

## Used Technology

| Category               | Technology/Tool                              |
|------------------------|----------------------------------------------|
| **Programming Languages** | JavaScript |
| **Runtime Environment** | [Nodejs] |
| **Web Framework** | [Express] |
| **Database** | [PostgreSQL] |
| **ORM** | [Sequelize] (Active Record based ORM) |
| **Payment Service** | [Stripe] |
| **Auth** | [Passport] (Authentication framework for Nodejs) |
| **Testing Framework** | [Jest] (testing framework for javascript) |
| Logger | [Winston] (log with different levels written to several mediums like stdout, files, database, etc.. ) |

## Project Structure

```
.
├── config                  # general server configurations
├── docker                  # needed dockerfiles 
├── src                     # project source code
├── test                    # automated Unit and Integration tests
├── app.js
├── docker-compose.yml
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

### `config`
This directory consists of JSON formated files used to provide the server with general configurations in its different deployment environments, it is manipulated and parsed using [config] package.

### `docker`
```
.
├── api
│   └── Dockerfile      # api server image
└── db
    └── Dockerfile      # database image with its initialization script
```

### `src`
```
.
    ├── configs     # used packages configurations
│   ├── log.js      # export configured instance of winston logger
│   └── ...
├── controllers     # contain all api layer functions
│   ├── product.js  # export functions for each endpoint used for the products
│   └── ...
├── middlewares     # each file in this directory exports one middleware for a specific task
│   ├── upload.js   # export a middleware for image upload
│   └── ...
├── migrations      # contain all sequelize migration files
├── models          # contain sequelize database models
│   ├── index.js    # initialize and export all defined models
│   ├── product.js  # define product model
│   └── ...
├── routes          # each file in this directory exports a router for a group of endpoints
│   ├── product.js  # export products endpoints router
│   └── ...
├── seeders         # contain sequelize database data seeds
├── services        # contain all business logic and call the external services like the database queries and stripe
│   ├── product.js  # handle all business logic related to the products
│   └── ...
└── utils           # other utilities and functions that is frequently used
    └── ...
```


[Nodejs]: https://nodejs.org
[Express]: https://expressjs.com
[PostgreSQL]: https://www.postgresql.org
[Sequelize]: https://sequelize.org
[Stripe]: https://stripe.com
[Passport]: https://www.passportjs.org
[Jest]: https://jestjs.io
[config]: https://www.npmjs.com/package/config
[Winston]: https://www.npmjs.com/package/winston
