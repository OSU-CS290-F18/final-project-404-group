const express = require('express')
const app = express()
const mongodb = require('mongodb')
const fs = require('fs')
const mongodb_url = 'mongodb://mymongo:27017/animals'
const bodyParser = require('body-parser')


var MongoClient = mongodb.MongoClient

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/add_group', function(req, res) {
    MongoClient.connect(mongodb_url, function(err, client) {
        if(err) {
            console.log(err)
            res.send(JSON.stringify({
                'code' : -1,
                'err_msg' : 'open database fail'
            }))
        } else {
            var db = client.db("animals")
            db.collection('group').insertOne({
                topic: req.body.topic,
                summary: req.body.summary,
                update_time: Date.now(),
                create_time: Date.now()
            }, function(err, result){
                if(err) {
                    res.send(JSON.stringify({
                        code: '-1',
                        err_msg: 'insert data fail'
                    }))
                } else {
                    res.send(JSON.stringify({
                        code: '0',
                        data: result.insertedId
                    }))
                }
                client.close()
            })
        }
    });
})

app.get('/get_group_list', function(req, res) {
    MongoClient.connect(mongodb_url, function (err, client) {
        if (err) {
            console.log(err)
            res.send(JSON.stringify({
                code : '-1',
                err_msg : 'connect fails'
            }))
        } else {
            var db = client.db('animals')
            db.collection('group').find({}).toArray(function (err, result) {
                if(err) {
                    res.send(JSON.stringify({
                        code: '-1',
                        err_msg: 'find data fail'
                    }))
                } else {
                    res.send({
                        code: '0',
                        data: result
                    })
                }
                client.close()
            })
        }
    })
})

app.get('/add', function(req, res){
    MongoClient.connect(mongodb_url, function (err, client) {
        if (err) res.send(err)
        else {
            var db = client.db('animals')
            db.collection('heros').insert({ name: 'Tim', gender: 'man', age: 23 }, function (err, result) {
                if(err) {
                    res.send(err)
                } else {
                    res.send(result)
                }
                client.close()
            })
        }
    })
})

app.get('/find', function(req, res){
    MongoClient.connect(mongodb_url, function (err, client) {
        if (err) res.send(err)
        else {
            var db = client.db('animals')
            db.collection('heros').find({}).toArray(function (err, result) {
                if(err) {
                    res.send(err)
                } else {
                    res.send(result)
                }
                client.close()
            })
        }
    })
})

app.use(express.static('./static'))

app.get('/', function(req, res) {
    fs.readFile("./static/index.html", function(err, data){
        res.send(data.toString())
    })
})

app.listen(8888, () => console.log('Listening!!!'))