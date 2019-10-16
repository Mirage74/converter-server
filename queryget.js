const axios = require('axios')
//const pathServer = "https://koa-jwt.herokuapp.com/user"
const pathServer = "http://conv-env.f4sph7vegq.us-east-2.elasticbeanstalk.com/trns/5"

axios.get(
    pathServer
)
.then(res => {
    console.log(res.data)
})
.catch (err =>console.log(err))
