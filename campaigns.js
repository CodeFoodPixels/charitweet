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
        return connection.query('select campaigns.id as campaignid, name, post, count(supporters.id) as supportercount from campaigns left join supporters on supporters.campaign = campaigns.id where user = ? group by campaigns.id;', [userId]);
    },
    getById: (id) => {
        return connection.query('select campaigns.id, campaigns.name as campaignname, campaigns.post, users.name as username, count(supporters.id) as supportercount from campaigns left join supporters on supporters.campaign = campaigns.id left join users on users.id = campaigns.user where campaigns.id = ? group by id;', [id]);
    },
    add: (data) => {
        return connection.query('insert into campaigns (user, name, post) values (?, ?, ?)', [data.user, data.name, data.post]);
    }
};