module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        reply.view('home');
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
}];