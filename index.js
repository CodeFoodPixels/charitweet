`use strict`;

const hapi = require(`hapi`);

const server = new hapi.Server();

server.connection({
    host: '127.0.0.1',
    port: 8080
})

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log(`Server running at: ${server.info.uri}`)
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply('Hello hackmcr!');
    }
});