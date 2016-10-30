'use strict';

const users = require(`./users.js`);
const campaigns = require(`./campaigns.js`);
const posts = require(`./posts.js`);
const supporters = require(`./supporters.js`);

const moment = require('moment');

module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply.view('home', null, {layout: 'logged-out'});
    }
},{
    method: 'GET',
    path: '/login',
    handler: (request, reply) => {
        reply.view('login', null, {layout: 'logged-out'});
    }
},{
    method: 'GET',
    path: '/queue',
    config: {
        auth: 'session',
        handler: (request, reply) => {
            posts.getByUser(request.auth.credentials.id).map((row) => {
                row.post_date = moment(row.post_date).format('YYYY-MM-DD');
                return row;
            }).then((rows) => {
                reply.view('queue', {posts: rows});
            });
        }
    }
},{
    method: 'GET',
    path: '/queue/new',
    config: {
        auth: 'session',
        handler: (request, reply) => {
            reply.view('new-post');
        }
    }
},{
    method: 'POST',
    path: '/queue/new',
    config: {
        auth: 'session',
        handler: (request, reply) => {
            console.log(request.payload);
            posts.add({
                user: request.auth.credentials.id,
                message: request.payload.post,
                post_date: request.payload.post_date,
                post_time: request.payload.post_time
            }).then(() => {
                reply.redirect('/queue');
            });
        }
    }
},{
    method: 'GET',
    path: '/campaigns',
    config: {
        auth: 'session',
        handler: (request, reply) => {
            campaigns.getByUser(request.auth.credentials.id).map((row) => {
                row.end_date = moment(row.end_date).format('YYYY-MM-DD');
                return row;
            }).then((rows) => {
                reply.view('campaigns', {campaigns: rows});
            });
        }
    }
},{
    method: 'GET',
    path: '/public-campaign/{id}',
    config: {
        handler: (request, reply) => {
            campaigns.getById(request.params.id).then((rows) => {
                const campaign = rows[0];
                campaign.end_date = moment(campaign.end_date).format('YYYY-MM-DD');
                reply.view('public-campaign', {campaign: rows[0]}, {layout: 'logged-out'});
            });
        }
    }
},{
    method: 'GET',
    path: '/public-campaign/{id}/twitter',
    config: {
        handler: (request, reply) => {
            supporters.add({
                campaign: request.params.id,
                twitter_token: ''
            }).then(() => {
                return campaigns.getById(request.params.id);
            }).then((rows) => {
                reply.view('public-campaign-supporter', {campaign: rows[0], account: 'Twitter'}, {layout: 'logged-out'});
            });
        }
    }
},{
    method: 'GET',
    path: '/public-campaign/{id}/facebook',
    config: {
        handler: (request, reply) => {
            supporters.add({
                campaign: request.params.id,
                facebook_token: ''
            }).then(() => {
                return campaigns.getById(request.params.id);
            }).then((rows) => {
                reply.view('public-campaign-supporter', {campaign: rows[0], account: 'Facebook'}, {layout: 'logged-out'});
            });
        }
    }
},{
    method: 'GET',
    path: '/campaigns/new',
    config: {
        auth: 'session',
        handler: (request, reply) => {
            reply.view('new-campaign');
        }
    }
},{
    method: 'POST',
    path: '/campaigns/new',
    config: {
        auth: 'session',
        handler: (request, reply) => {
            campaigns.add({
                user: request.auth.credentials.id,
                name: request.payload.name,
                post: request.payload.post,
                day: request.payload.weekday,
                time: request.payload.post_time,
                end_date: request.payload.end_date
            }).then(() => {
                reply.redirect('/campaigns');
            });
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
                        twitter_id: profile.id,
                        twitter_token: request.auth.credentials.token
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

                reply.redirect('/queue');
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
                        facebook_id: profile.id,
                        facebook_token: request.auth.credentials.token
                    }).then((data) => {
                        return {
                            id: data.insertId,
                            name: profile.displayName,
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

                reply.redirect('/queue');
            });
        }
    }
}];