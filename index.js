`use strict`;

const hapi = require(`hapi`);
const config = require(`./config.js`);

const server = new hapi.Server({ debug: { request: ['error'] } });

server.connection({
    host: '127.0.0.1',
    port: 8080
})

server.register([
    require('vision'),
    require('inert'),
    require('bell'),
    require('hapi-auth-cookie')
], (err) => {

    server.auth.strategy('session', 'cookie', {
        password: config.cookie_encryption_password,
        redirectTo: '/login',
        isSecure: false
    });

    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: config.cookie_encryption_password,
        clientId: config.twitter.client_id,
        clientSecret: config.twitter.client_secret,
        isSecure: false
    });

    server.auth.strategy('facebook', 'bell', {
        provider: 'facebook',
        password: config.cookie_encryption_password,
        clientId: config.facebook.client_id,
        clientSecret: config.facebook.client_secret,
        isSecure: false
    });

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: `./views`,
        layout: true,
        layoutPath: `./views/layout/`,
        partialsPath: `./views/partials/`
    });

    server.route(require('./routes.js'));
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`)
});