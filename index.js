`use strict`;

const hapi = require(`hapi`);

const server = new hapi.Server();

server.connection({
    host: '127.0.0.1',
    port: 8080
})

server.register([
    require('vision'),
    require('inert')
], (err) => {
    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: `./views`,
        layout: true,
        layoutPath: `./views/layout/`
    });

    server.route(require('./routes.js'));
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`)
});