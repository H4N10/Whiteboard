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
var shapes = new Array();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//创建webSocket服务器
function createServer(port,req) {
    var WebSocketServer = ws.Server;
    var server = new WebSocketServer({
        port: port,//监听的端口
        // verifyClient: socketverify //(可选)用于验证连接的函数
    });
    server.on('connection', function (socket) {
        var mSocket = new Object();
        mSocket.socket = socket;
        mSocket.port = port;
        cons.push(mSocket);
        console.log("用户连接："+cons.length);
        // console.dir(socket);
        socket.send("标识"+ cons.length);
        if(shapes[port])
            socket.send(shapes[port]); //转发房间内已有图像
        console.log("标识"+ cons.length);
        socket.on('message', function (message) {
            var msg=JSON.parse(message);
            shapes[port] = message;
            for (var i = 0; i < cons.length; i++) {
                if(cons[i]){
                    console.log("发送的key："+msg.key+";连接池大小:"+cons.length+"；第"+i+"端口："+ cons[i].port+"長度"+cons.length);
                    if (i != msg.key-1 && cons[i].port == port) {
                        cons[i].socket.send(message);//发给指定的客户端(除了发送方）
                    }
                }
            }

        });
        socket.on('close',function (code,reason) {
            for(var i=0;i<cons.length; i++){
                if(cons[i]&&cons[i].socket ==  socket){
                    cons[i] = null;
                 }
             }
            req.session.roomKey = "";
            console.log("退出连接"+code+":"+reason);
        })
    });
}
// Array.prototype.remove = function (dx) {
//     if (isNaN(dx) || dx > this.length) {
//         return false;
//     }
//     for (var i = 0, n = 0; i < this.length; i++) {
//         if (this[i] != this[dx]) {
//             this[n++] = this[i];
//         }
//     }
//     this.length -= 1;
// };

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
        createServer(id+6000,req);//创建长连接
        req.session.roomKey = id+6000;

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
        console.log("钥匙钥匙："+req.body.params.key);
        var jsonResult ;

        if(req.body.params.key){
            // res.sendfile('vue/'+req.params.view+'.html');
            res.redirect('/');
            res.end();
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