const express = require('express')
const cors = require('cors')
const app = express();

app.use(cors());

const port = process.env.port || 9000;

app.get("/", (req, res)=>{
    res.send(`Server is listening on the port ${port}`)
})

app.listen(port, ()=>{
    console.log(`Server is running on the port ${port}`)
})

