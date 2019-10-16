const axios = require('axios')
//const pathServer = "https://koa-jwt.herokuapp.com/user"
const pathServer = "http://localhost:4000/0"

axios.get(
    pathServer
)
.then(res => {
    console.log(res.data)
})
.catch (err =>console.log(err))
