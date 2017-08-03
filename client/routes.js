if(typeof  require.ensure !== 'function') {
    require.ensure = function(dependencies, callback) {
        callback(require);
    }
}

const routes = {
    childRoutes: [{
        path: '/',
        component: require('./src/Common'),
        indexRoute: {
            getComponent(nextState, callback) {
                require.ensure([], require => {
                    callback(null, require('./src/App'))
                }, 'app')
            }
        },
        childRoutes: [{
            path: '/test',
            getComponent(nextState, callback) {
                require.ensure([], require => {
                    callback(null, require('./src/Test'))
                }, 'test')
            }
        }]
    }]
}

export default routes;