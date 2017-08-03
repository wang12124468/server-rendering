import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from '../../client/routes';

const clientRoute = (ctx, next) => {
    return new Promise((resolve, reject) => {
        match({ routes, location: ctx.url }, (error, redirectLocation, renderProps) => {
            // if (renderProps) {
            //     ctx.render('index', {
            //         root: renderToString(
            //             <div>
            //                 <RouterContext {...renderProps} />
            //             </div>
            //         ),
            //         state: {}
            //     })
            //     resolve();
            // }else {
            //     next();
            //     reject();
            // }
            resolve(renderProps)
        })
    })
}



// async function clientRoute(ctx, next) {
//     let _renderProps, isMatch;

//     match({routes, location: ctx.url}, (error, redirectLocation, renderProps) => {
//         _renderProps = renderProps;
//     })
//     // console.log(JSON.stringify(routes))
//     // console.log(ctx.url)
//     // console.log(_renderProps)
//     if (_renderProps) {

//         await ctx.render('index', {
//             root: renderToString(
//                 <div>
//                     <RouterContext {..._renderProps}/>
//                 </div>
//             ),
//             state: {}
//         })
//     } else {
//         await next();
//     }
// }
// export default clientRoute;
export default async function(ctx, next) {
    let _renderProps = await clientRoute(ctx, next)
    if (_renderProps) {

            await ctx.render('index', {
                root: renderToString(
                    <div>
                        <RouterContext {..._renderProps}/>
                    </div>
                ),
                state: {}
            })
        } else {
            await next();
        }
}