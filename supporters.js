'use strict';

const mysql = require('promise-mysql');
const config = require(`./config.js`);
let connection;

mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    debug: ['ComQueryPacket', 'RowDataPacket']
}).then((conn) => {
    connection = conn;
});

module.exports = {
    add: (data) => {
        return connection.query('insert into supporters (campaign, twitter_token, facebook_token) values (?, ?, ?)', [data.campaign, data.twitter_token, data.facebook_token]);
    }
};