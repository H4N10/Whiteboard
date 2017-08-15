//房间基础操作
var rooms = require(process.cwd()+'/models/rooms/rooms');
var ws = require('ws');
var response = require(process.cwd()+'/models/result');

var id = 0;
var cons = new Array();

function createServer(port) {
    var WebSocketServer = ws.Server;
    var server = new WebSocketServer({
        port: port,//监听的端口
        // verifyClient: socketverify //(可选)用于验证连接的函数
    });
    server.on('connection', function (socket) {
        // var userId = ws.upgradeReq.headers['userid'];
        console.log('new connection successfully userId:'+socket);
        cons.push(socket);
        // userArray.push(userId);
        socket.on('message', function (message) {
            console.log(message);
            for (var i=0; i<cons.length;i++) {
                //判断userid是否为toUserId（发给指定的客户端）
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

}