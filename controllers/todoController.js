var bodyParser = require('body-parser')
var mongoose = require('mongoose')

const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, 
    family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect('mongodb+srv://test:test@todo-5chop.mongodb.net/test?retryWrites=true', options)

var todoSchema = new mongoose.Schema({
    item: String
})

var Todo = mongoose.model('Todo', todoSchema)
// var itemOne = Todo({item: 'get something'}).save(function(err){
//     if (err) throw err;
//     console.log("item saved")
// })

var urlencodedParser = bodyParser.urlencoded({extended:false})
// var data =[{item: 'milk'}, {item: 'bed'}]


module.exports = function(app){

app.get('/todo', (req,res)=>{
    Todo.find({}, function(err,data){
        if(err) throw err;
        res.render('todo', {todos: data})
    })
})

app.post('/todo', urlencodedParser, (req,res)=>{
    Todo(req.body).save((err,data)=>{
        if(err) throw err;
        res.json(data)
    })
})

app.delete('/todo/:item', (req,res)=>{
    Todo.find({item: (req.params.item.replace(/\-/g, " ").substring(1))}).deleteOne((err,data)=>{
        if(err) throw err;
        res.json(data)
    })
})

}