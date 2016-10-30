'use strict';

const mysql = require('promise-mysql');
const config = require(`./config.js`);
let connection;

mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}).then((conn) => {
    connection = conn;
});

module.exports = {
    getByUser: (userId) => {
        return connection.query('select id, message, post_time, post_date from posts where user = ? order by post_date asc, post_time asc', [userId]);
    },
    add: (data) => {
        return connection.query('insert into posts (user, message, post_date, post_time) values (?, ?, ?, ?)', [data.user, data.message, data.post_date, data.post_time]);
    }
};