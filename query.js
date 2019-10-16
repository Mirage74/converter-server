const axios = require('axios')
//const pathServer = "https://koa-jwt.herokuapp.com/user"
const pathServer = "http://conv-env.f4sph7vegq.us-east-2.elasticbeanstalk.com/trn"

const configAx = {
  "transName": "7 eur trn", 
  "amountEUR": 155.519
  }
axios.post(
    pathServer,
    configAx
)
.then(res => {
    console.log(res.data)
})
.catch (err =>console.log(err))
