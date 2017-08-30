//房间基础操作
var rooms = require(process.cwd()+'/models/rooms/rooms');
var ws = require('ws');
var session = require('express-session');
var bodyParser = require('body-parser');
// var multer = require('multer');

var util = require('util');
var response = require(process.cwd()+'/models/result');

var id = 0;
var cons = new Array();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//创建webSocket服务器
function createServer(port) {
    var WebSocketServer = ws.Server;
    var server = new WebSocketServer({
        port: port,//监听的端口
        // verifyClient: socketverify //(可选)用于验证连接的函数
    });
    server.on('connection', function (socket) {
        cons.push(socket);
        // console.dir(socket);

        socket.on('message', function (message) {
            if(cons.length>1){
                for (var i=0; i<cons.length;i++) { //第0个是房主
                    console.log(message);
                    if(cons[i]!=socket){
                        cons[i].send(message);//发给指定的客户端(除了房主）
                    }
                }
            }


        });

    });
}

exports.controller = function (app) {
    //获取房间属性
    app.use(session({
        secret: 'roomSession',
        cookie: {maxAge: 80000 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
        resave: true,
        saveUninitialized:true
    }));
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    // app.use(multer()); // for parsing multipart/form-data

    app.get('/rooms/getRoom', function (req, res) {
        var room = rooms.createRooms({
            id:''+id++,
            name:'房间'+id,
            key:id+6000
    });
        createServer(id+6000);//创建长连接
        res.send(response.JsonResult({
            data:room
        }));
    });
    //获取所有房间
    app.get('/rooms/getRooms',function (req,res) {
        var jsonResult = response.JsonResult({
            data:rooms.getRooms()
        })
        res.send(jsonResult);
    });
    //进入房间
    app.post('/rooms/comeIn',urlencodedParser ,function (req,res) {
        console.log(req.body.params.key);
        var jsonResult ;
        if(req.body.params.key){
            req.session.roomkey= req.body.params.key;
             jsonResult = response.JsonResult({
                 data:null
            })
        }else{
            jsonResult = response.JsonResult({
                code:201,
                msg:"房间钥匙未提交",
                data:null
            })
        }
        res.send(jsonResult);

    })
}