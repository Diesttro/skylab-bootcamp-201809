# Instructions

## Server

### Running the API

To start the API go into the api folder, install the required npm packages and run the API.

```shell
cd api
npm install
npm start
```

You will need a .env file with the following variables.

```shell
PORT = server listening port
MONGO_URL = mongodb database url
JWT_SECRET = secret key
```

Note that you will need to start MongoDB in order to allow the use of the data models.


## Client

### Running the APP

To start the APP, go into the app folder, install the required npm packages and run the APP.

```shell
cd app
npm install
npm start
```

For more information go to [documentation](docs/README.md)