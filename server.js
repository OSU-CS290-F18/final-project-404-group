const express = require('express')
const app = express()
var mongodb = require('mongodb')

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

app.get('/', function(req, res) {
    res.send("test")
})

app.listen(8888, () => console.log('Example app listening on port 3000!'))