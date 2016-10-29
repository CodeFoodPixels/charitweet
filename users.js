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
    getByTwitterID: (twitterID) => {
        return connection.query('select * from users where twitter_id = ?', [twitterID]);
    },
    getByFacebookID: (facebookID) => {
        return connection.query('select * from users where facebook_id = ?', [facebookID]);
    },
    createUser: (user) => {
        return connection.query('insert into users (name, twitter_id, facebook_id) values (?, ?, ?)', [
            user.username,
            user.twitter_id || '',
            user.facebook_id || ''
        ]);
    }
}