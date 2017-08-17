//房间实体类
var roomArray = new Array();

function Rooms(props) {
    this.id = props.id;
    this.name = props.name;
    this.key = props.key;
}
Rooms.prototype.test = function () {
    console.log(this);
};
//创建房间
exports.createRooms = function(props) {
    room = new Rooms(props ||{});
    roomArray.push(room);
    return room;
}
//获取所有房间
exports.getRooms = function () {
     return roomArray;
}


