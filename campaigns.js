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
        return connection.query('select id, name, count(cs.supporter_id) as supportercount from campaigns left join campaignsupporters as cs on cs.campaign_id = id where user = ? group by id;', [userId]);
    },
    add: (data) => {
        return connection.query('insert into campaigns (user, name, post) values (?, ?, ?)', [data.user, data.name, data.post]);
    }
};