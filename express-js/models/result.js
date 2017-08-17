//返回体

function resp(props) {
    this.code = props.code != undefined?props.code:200; //默认200
    this.data = props.data;
    this.msg = props.msg != undefined?props.msg:'请求成功';
}

exports.JsonResult = function (props) {
    return new resp(props);
}