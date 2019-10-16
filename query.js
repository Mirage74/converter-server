const axios = require('axios')
//const pathServer = "https://koa-jwt.herokuapp.com/user"
const pathServer = "http://localhost:4000/trn"

const configAx = {
  "transName": "5 eur trn", 
  "amountEUR": 15.519
  }
axios.post(
    pathServer,
    configAx
)
.then(res => {
    console.log(res.data)
})
.catch (err =>console.log(err))
