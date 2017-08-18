//房间基础操作
var rooms = require(process.cwd()+'/models/rooms/rooms');
var ws = require('ws');
var session = require('express-session');

var util = require('util');
var response = require(process.cwd()+'/models/result');

var id = 0;
var cons = new Array();
//创建webSocket服务器
function createServer(port) {
    var WebSocketServer = ws.Server;
    var server = new WebSocketServer({
        port: port,//监听的端口
        // verifyClient: socketverify //(可选)用于验证连接的函数
    });
    server.on('connection', function (socket) {
        // var userId = ws.upgradeReq.headers['userid'];
        // console.log(util.inspect(socket.upgradeReq, {depth: null}));
        console.log('new connection successfully userId:' );
        cons.push(socket);
        // userArray.push(userId);
        socket.on('message', function (message) {
             for (var i=0; i<cons.length;i++) {
                 console.log(message);                //判断userid是否为toUserId（发给指定的客户端）
                // var msgObj = JSON.parse(message);
                // if (userArray[i] == msgObj.toUserId) {
                    cons[i].send('徐少秋');
                    // break;
                // }
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
    app.get('/rooms/comeIn',function (req,res) {
        console.log("房间钥匙："+req.body.key);
        req.session.roomkey= req.body.key;
        res.sendfile('vue/'+'home.html');

    })
}