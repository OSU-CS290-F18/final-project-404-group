const express = require('express')
const app = express()
const mongodb = require('mongodb')
const fs = require('fs')
const mongodb_url = 'mongodb://mymongo:27017/animals'
const bodyParser = require('body-parser')
const ObjectID = mongodb.ObjectID

var MongoClient = mongodb.MongoClient

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.post('/add_group', function(req, res) {
    res.append('Content-Type', 'application/json')
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
                        code: -1,
                        err_msg: 'insert data fail'
                    }))
                } else {
                    res.send(JSON.stringify({
                        code: 0,
                        data: result.insertedId
                    }))
                }
                client.close()
            })
        }
    });
})

app.post('/add_post', function(req, res) {
    res.append('Content-Type', 'application/json')
    MongoClient.connect(mongodb_url, function(err, client) {
        if(err) {
            
            res.send(JSON.stringify({
                'code' : -1,
                'err_msg' : 'open database fail'
            }))
        } else {
            var db = client.db("animals")
            db.collection('post').insertOne({
                title: req.body.title,
                author: req.body.author,
                content: req.body.content,
                commit_number: 0,
                group_id: req.body.group_id,
                update_time: Date.now(),
                create_time: Date.now()
            }, function(err, result){
                if(err) {
                    
                    res.send(JSON.stringify({
                        code: -1,
                        err_msg: 'insert data fail'
                    }))
                } else {
                    
                    db.collection('group').updateOne({
                        "_id": new ObjectID(req.body.group_id)
                    }, {
                        $set: {
                            update_time: Date.now()
                        }
                    }, function(err, update_res){
                        console.log(update_res)
                        
                        res.send(JSON.stringify({
                            code: 0,
                            data: result.insertedId
                        }))
                        client.close()
                    })
                    
                }
            })
        }
    });
})

app.post('/get_post_list', function(req, res) {
    res.append('Content-Type', 'application/json')
    MongoClient.connect(mongodb_url, function (err, client) {
        if (err) {
            console.log(err)
            res.send(JSON.stringify({
                code : -1,
                err_msg : 'connect fails'
            }))
        } else {
            var db = client.db('animals')
            db.collection('post').find({
                group_id: req.body.group_id
            }).sort([
                ['update_time', -1]
            ]).toArray(function (err, result) {
                if(err) {
                    res.send(JSON.stringify({
                        code: -1,
                        err_msg: 'find data fail'
                    }))
                } else {
                    res.send(JSON.stringify({
                        code: 0,
                        data: result
                    }))
                }
                client.close()
            })
        }
    })
})

app.get('/get_group_list', function(req, res) {
    res.append('Content-Type', 'application/json')
    MongoClient.connect(mongodb_url, function (err, client) {
        if (err) {
            console.log(err)
            res.send(JSON.stringify({
                code : -1,
                err_msg : 'connect fails'
            }))
        } else {
            var db = client.db('animals')
            db.collection('group').find({}).sort([['update_time', -1]]).toArray(function (err, result) {
                if(err) {
                    res.send(JSON.stringify({
                        code: -1,
                        err_msg: err
                    }))
                } else {
                    res.send(JSON.stringify({
                        code: 0,
                        data: result
                    }))
                }
                client.close()
            })
        }
    })
})

app.post('/get_post_list_limit', function(req, res) {
    res.append('Content-Type', 'application/json')
    MongoClient.connect(mongodb_url, function (err, client) {
        if (err) {
            console.log(err)
            res.send(JSON.stringify({
                code : -1,
                err_msg : 'connect fails'
            }))
        } else {
            var db = client.db('animals')
            db.collection('post').find({
                group_id: req.body.group_id
            }).sort([
                ['update_time', -1]
            ]).limit(5).toArray(function (err, result) {
                if(err) {
                    res.send(JSON.stringify({
                        code: -1,
                        err_msg: 'find data fail'
                    }))
                } else {
                    res.send(JSON.stringify({
                        code: 0,
                        data: result
                    }))
                }
                client.close()
            })
        }
    })
})

app.post('/add_commit', function(req, res) {
    res.append('Content-Type', 'application/json')
    MongoClient.connect(mongodb_url, function(err, client) {
        if(err) {
            console.log(err)
            res.send(JSON.stringify({
                'code' : -1,
                'err_msg' : 'open database fail'
            }))
        } else {
            var db = client.db("animals")
            db.collection('commit').insertOne({
                author: req.body.author,
                content: req.body.content,
                group_id: req.body.group_id,
                post_id: req.body.post_id,
                update_time: Date.now(),
                create_time: Date.now()
            }, function(err, result){
                if(err) {
                    res.send(JSON.stringify({
                        code: -1,
                        err_msg: 'insert data fail'
                    }))

                    
                } else {
                    db.collection('group').updateOne({
                        _id: new ObjectID(req.body.group_id)
                    }, {
                        $set: {
                            update_time: Date.now()
                        }
                    }, function(err, update_res){
                        console.log(update_res)
                        db.collection('post').updateOne({
                            _id: new ObjectID(req.body.post_id)
                        }, {
                            $set: {
                                update_time: Date.now()
                            },
                            $inc: {
                                commit_number: 1
                            }
                        }, function(err, update_res){
                            res.send(JSON.stringify({
                                code: 0,
                                data: result.insertedId
                            }))
                            console.log(update_res)
                            client.close()
                        })
                    })
                    
                    
                }
            })
        }
    });
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