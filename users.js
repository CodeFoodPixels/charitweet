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
    getById: (id) => {
        return connection.query('select * from users where id = ?', [id]);
    },
    createUser: (user) => {
        return connection.query('insert into users (name, twitter_id, facebook_id, twitter_token, facebook_token) values (?, ?, ?, ?, ?)', [
            user.name,
            user.twitter_id || '',
            user.facebook_id || '',
            user.twitter_token || '',
            user.facebook_token || ''
        ]);
    },
    updateDefaultPost: (userID, postData) => {
        return connection.query('update users set default_post = ?, default_post_time = ? where id = ?', [
            postData.post,
            postData.time,
            userID
        ]);
    }
}