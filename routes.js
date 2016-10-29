'use strict';

const users = require(`./users.js`)

module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply.view('home');
    }
},{
    method: 'GET',
    path: '/login',
    handler: (request, reply) => {
        reply.view('login');
    }
},{
    method: ['GET', 'POST'],
    path: '/app',
    config: {
        auth: 'session',
        handler: (request, reply) => {
            reply('app');
        }
    }
},{
    method: 'GET',
    path: '/css/{param*}',
    handler: {
        directory: {
            path: 'public/css'
        }
    }
},{
    method: 'GET',
    path: '/js/{param*}',
    handler: {
        directory: {
            path: 'public/js'
        }
    }
},{
    method: 'GET',
    path: '/image/{param*}',
    handler: {
        directory: {
            path: 'public/image'
        }
    }
},{
    method: 'GET',
    path: '/font/{param*}',
    handler: {
        directory: {
            path: 'public/font'
        }
    }
},{
    method: ['GET', 'POST'],
    path: '/auth/twitter',
    config: {
        auth: 'twitter',
        handler: (request, reply) => {
            if (!request.auth.isAuthenticated) {
                return reply('Authentication failed: ' + request.auth.error.message);
            }

            const profile = request.auth.credentials.profile;

            users.getByTwitterID(profile.id).then((rows) => {
                if (rows.length === 0) {
                    return users.createUser({
                        name: profile.name,
                        twitter_id: profile.id
                    }).then((data) => {
                        return {
                            id: data.insertId,
                            name: profile.name,
                            twitter_id: profile.id,
                            facebook_id: null
                        }
                    });
                } else {
                    return rows[0];
                }
            }).then((row) => {
                request.cookieAuth.set({
                    id: row.id,
                    name: row.name,
                    twitter_id: row.twitter_id,
                    facebook_id: row.facebook_id
                });

                reply.redirect('/app');
            });
        }
    }
},{
    method: ['GET', 'POST'],
    path: '/auth/facebook',
    config: {
        auth: 'facebook',
        handler: (request, reply) => {
            if (!request.auth.isAuthenticated) {
                return reply('Authentication failed: ' + request.auth.error.message);
            }

            const profile = request.auth.credentials.profile;

            users.getByFacebookID(profile.id).then((rows) => {
                if (rows.length === 0) {
                    return users.createUser({
                        name: profile.displayName,
                        facebook_id: profile.id
                    }).then((data) => {
                        return {
                            id: data.insertId,
                            name: profile.name,
                            facebook_id: profile.id,
                            twitter_id: null
                        }
                    });
                } else {
                    return rows[0];
                }
            }).then((row) => {
                request.cookieAuth.set({
                    id: row.id,
                    name: row.name,
                    twitter_id: row.twitter_id,
                    facebook_id: row.facebook_id
                });

                reply.redirect('/app');
            });
        }
    }
}];