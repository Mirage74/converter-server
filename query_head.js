const axios = require('axios')
const pathServer = "http://conv-env.f4sph7vegq.us-east-2.elasticbeanstalk.com/trns/1"


//const configAx = {
//    "login": "gdh8ckwq5d", 
//    "password": "z$cgKX?Qqwh?5+wV"
//}
//axios.post(
//    pathServer,
//    configAx
//)
//    .then(res => {
//        console.log(res.data)
//    })


const configAx = {
headers: { 
'Authorization': 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjY2FlMjk0M2MwMDg0MmE3ODRkMzRjZCIsImxvZ2luIjoiZ2RoOGNrd3E1ZCIsImlzQWRtaW4iOnRydWUsImlzU3VwZXJ2aXNvciI6dHJ1ZSwiaWF0IjoxNTU2ODAxNTk3fQ.b52V4Dc7eo-Yu7iR9iBTLwMVgekWPPPBa8HYgL6LG_s' 
} 
}

axios.get(
    pathServer,
    configAx
)
    .then(res => {
        console.log(res.data)
    })


