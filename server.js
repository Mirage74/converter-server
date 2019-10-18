const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser'); // POST parser
const serve = require('koa-static'); // serves static files like index.html
const logger = require('koa-logger'); // optional module for logging
const Transaction = require('./libs/transactions')
const favicon = require('koa-favicon')
require('./libs/mongoose')

const app = new Koa()
const router = new Router()

app.use(serve('public'))
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger())
app.use(bodyParser())
app.listen(process.env.PORT || 4000)

app.use(async (ctx, next) => {
  const origin = ctx.get('Origin')

  //if ( (origin === "http://localhost:8080") || (origin === "https://balex171.000webhostapp.com") ){
    if (ctx.method !== 'OPTIONS') {
      ctx.set('Access-Control-Allow-Origin', origin);
      ctx.set('Access-Control-Allow-Credentials', 'true');
    } else {
      if (ctx.get('Access-Control-Request-Method')) {
        ctx.set('Access-Control-Allow-Origin', origin);
        ctx.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS']);
        ctx.set('Access-Control-Allow-Headers', ['Content-Type', 'Authorization', 'Access-Control-Allow-Headers', 'headers', 'login']);
        ctx.set('Access-Control-Max-Age', '42');
        ctx.set('Access-Control-Allow-Credentials', 'true');
        ctx.response.status = 200
        //console.log('ctx.response.status', ctx.response.status)
      }
    }
  //}
  await next();
});



app.use(router.routes())

router.param('trnById', async (id, ctx, next) => {
   ctx.trnById = await Transaction.findById(id);
   if (!ctx.trnById) {
     ctx.body = `Error find user for del with ID ${id}`
    }
  await next();
})

router.del('/del/:trnById',  async function(ctx) {
  await ctx.trnById.remove();
  ctx.body = 'ok';
})


router.get('/trns', async function (ctx) {
  let transactions = await Transaction.find()
    .catch(err => {
      ctx.status = 400
      console.log("err router.get ", err)
      ctx.body = err
    })
  transactions = transactions.map(item =>
    [
      item._id,
      item.transName,
      item.amountEUR
    ]
  )
  ctx.body = transactions
})




router.post('/trn', async (ctx, next) => {
  ctx.request.body.transName = ctx.request.body.transName.toLowerCase()
  let trn
  try {
    trn = await Transaction.findOne({ transName: ctx.request.body.transName })
  }
  catch (err) {
    ctx.status = 400
    console.log("err router.post TRN find ", err)
    ctx.body = err
  }

  if (!trn) {
    ctx.request.body.amountEUR = Math.round(100 * ctx.request.body.amountEUR) / 100
    try {
      let trn = await Transaction.create(ctx.request.body)
      ctx.body = trn.toObject()
    }
    catch (err) {
      ctx.status = 400
      console.log("err router.post TRN create", err)
      ctx.body = err
    }
  } else {
    ctx.body = `EXIST: Transaction ${ctx.request.body.transName} already exist !`
  }
})



