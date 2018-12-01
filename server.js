const express = require('express')
const app = express()
const mongodb = require('mongodb')
const fs = require('fs')
const mongodb_url = 'mongodb://mymongo:27017/animals'

var MongoClient = mongodb.MongoClient



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