function Rooms(props) {
    this.id = props.id;
    this.name = props.name;
    this.key = props.key;
}
Rooms.prototype.test = function () {
    console.log(this);
};
exports.createRooms = function(props) {
    return new Rooms(props ||{});
}


