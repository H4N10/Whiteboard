//房间实体类
var roomArray = new Array();
var db = require(process.cwd()+('/db.js'));
var mDatabase = db.getDatabase();
var text = "牛肉面,冰淇淋,红领巾,淘宝,苹果,耳机,雨伞,炸弹,自行车";
var question = text.split(",");
function Rooms(props) {
    this._id = props.id;
    this.name = props.name;
    this.key = props.key;
    this.num = props.num; //房间人数
    this.shape = props.shape;
    this.question = question[getQuestion()];
}
Rooms.prototype.test = function () {
    console.log(this);
};

//生成问题随机数
function getQuestion(){
    return parseInt(Math.random()*question.length,10);
}
//创建房间

exports.createRooms = function(props) {
    room = new Rooms(props ||{});
    roomArray.push(room);
    var  where={key:{"$eq":props.key}};
    var findSet = {};
    db.findData("rooms",where,findSet,function (res) {
         if(res && res.length >0){

         }else{
             db.insertData("rooms",room,function (result) {
                 // console.log(result);
             });
         }
    });
    return room;
}
//获取所有房间
exports.getRooms = function (callback) {
    db.findAllData("rooms",function (res) {
        callback(res);
    })
}
// 房间人数加一/减一
exports.addOrRemoveNum = function(port,isAdd){
    var  where={key:{"$eq":port}};
    var findSet = {num:1};
    var number ;
    db.findData("rooms",where,findSet,function (res) {
        if(res && res.length>0){
            if(isAdd){
                number = parseInt(res[0].num)+1;
            }else{
                number = parseInt(res[0].num)-1;
            }
            var set={$set:{num:number}};
            db.updateData("rooms",where,set,function (result) {
                console.log("房间人数添加结果："+result+"房间人数："+number);
                if(number == 0){
                    db.removeData("rooms",where,function (res) {
                        console.log("删除房间："+res);
                    })
                }
            })

        }

    })
}
//更换题目
exports.updateQuestion = function (port,callback) {
    var  where={key:{"$eq":port}};
    var mQuestion = question[getQuestion()];
    var set={$set:{question:mQuestion}};
    db.updateData("rooms",where,set,function (res) {
       callback(mQuestion);
    });

}
//获取所有房间
// exports.getRooms = function () {
//      return roomArray;
// }



