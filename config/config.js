require('dotenv').config()

const development = {
    "username": 'naskapal',
    "password": null,
    "database": 'jeketi-server',
    "host": '127.0.0.1',
    "dialect": "postgres"
}

const test = {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
}
const production = {
    "username": "jeketi_backend",
    "password": "toleko",
    "database": "jeketibot_backend",
    "host": "35.194.119.31",
    "dialect": "postgres"
}


module.exports = {
    development,
    test,
    production
}