const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World! Not'))

app.listen(8888, () => console.log('Example app listening on port 3000!'))