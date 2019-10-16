const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser'); // POST parser
const serve = require('koa-static'); // serves static files like index.html
const logger = require('koa-logger'); // optional module for logging
const Transaction = require('./libs/transactions')
require('./libs/mongoose')

const app = new Koa()
const router = new Router()
app.use(serve('public'));
app.use(logger());
app.use(bodyParser());
app.use(router.routes())
app.listen(process.env.PORT || 4000)



app.use(async (ctx, next) => {
  const origin = ctx.get('Origin')
  if (ctx.method !== 'OPTIONS') {
    ctx.set('Access-Control-Allow-Origin', origin)
    ctx.set('Access-Control-Allow-Credentials', 'true')
  } else if (ctx.get('Access-Control-Request-Method')) {
    ctx.set('Access-Control-Allow-Origin', origin)
    ctx.set('Access-Control-Allow-Methods', ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'])
    ctx.set('Access-Control-Allow-Headers', ['Content-Type', 'Authorization', 'Access-Control-Allow-Headers', 'headers'])
    ctx.set('Access-Control-Max-Age', '42')
    ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.response.status = 200
  }
  await next()
})


router.param('sortOrder', async (sortOrder, ctx, next) => {
  ctx.sortOrder = parseInt(sortOrder)
  await next();
})



router.get('/:sortOrder', async function (ctx) {
  let sortBy = {}
  switch (ctx.sortOrder) {
    case 0:
      sortBy = {
        "_id": 1
      }
      break;
    case 1:
      sortBy = {
        "transName": 1
      }
      break;
    case 2:
      sortBy = {
        "amountEUR": 1
      }
      break;
    case 3:
      sortBy = {
        "_id": -1
      }
      break;
    case 4:
      sortBy = {
        "transName": -1
      }
      break;
    case 5:
      sortBy = {
        "amountEUR": -1
      }
      break;
    default:
      sortBy = {
        "_id": 1
      }
  }

  let transactions = await Transaction.find().sort(sortBy)
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
    ctx.body = `Transaction ${ctx.request.body.transName} already exist !`
  }
})



