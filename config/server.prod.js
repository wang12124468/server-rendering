require('babel-polyfill')
const serve = require('koa-static');
const path = require('path');
const views = require('koa-views');
const fs = require('fs');
// import serve from 'koa-static'
// import path from 'path'
// import views from 'koa-views'

const port = process.env.port || 3000

const start = (app, router, clientRoute, customPort) => {
    app.use(views(path.resolve(__dirname, '../dist/client'), { map: { html: 'ejs' } }))
    app.use(serve(path.resolve(__dirname, '../dist/client')))
    app.use(clientRoute)
    app.use(router.routes())
    app.use(router.allowedMethods())
    app.listen(customPort || port)
    console.log(`\n==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.\n`)
}

module.exports = start;
