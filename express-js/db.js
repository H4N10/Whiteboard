//引入mongodb模块，获得客户端对象
var MongoClient = require('mongodb').MongoClient;
//连接字符串
var DB_CONN_STR = 'mongodb://localhost:27017/whiteboard';
var mdatabase ;
console.log("DB加载中...");

//使用客户端连接数据，并指定完成时的回调方法
MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log("数据库连接成功！");
    mdatabase = db;

});
exports.getDatabase = function () {
    return mdatabase;
}
//定义函数表达式，用于操作数据库并返回结果
exports.insertData = function(key,value, callback) {
    if(!mdatabase)
        return;
    //获得指定的集合
    var collection = mdatabase.collection(key);
    console.log("添加信息");
    collection.insert(value, function(err, result) {
        //如果存在错误
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        //调用传入的回调方法，将操作结果返回
        callback(result);
    });
}

//定义函数表达式，用于操作数据库并返回结果
exports.updateData = function(key,where,set, callback) {
    //获得指定的集合
    var collection = mdatabase.collection(key);

    collection.updateMany(where,set, function(err, result) {
        //如果存在错误
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        //调用传入的回调方法，将操作结果返回
        callback(result);
    });
}

//定义函数表达式，用于操作数据库并返回结果
exports.findData = function(key,where,set, callback) {
    //获得指定的集合
    var collection = mdatabase.collection(key);
    //要查询数据的条件，<=10岁的用户
    // var  where={age:{"$lte":10}};
    //要显示的字段
    // var set={name:1,age:1};
    collection.find(where,set).toArray(function(err, result) {
        //如果存在错误
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        //调用传入的回调方法，将操作结果返回
        callback(result);
    });
}
exports.findAllData = function (key,callback) {
    var collection = mdatabase.collection("rooms");
    collection.find().toArray(function(err, items) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        //调用传入的回调方法，将操作结果返回
        callback(items);
    });
}
//定义函数表达式，用于操作数据库并返回结果
exports.removeData = function(key,where, callback) {
    //获得指定的集合
    var collection = mdatabase.collection(key);
    //要删除数据的条件，_id>2的用户删除
    // var  where={_id:{"$gt":2}};
    collection.remove(where,function(err, result) {
        //如果存在错误
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        //调用传入的回调方法，将操作结果返回
        callback(result);
    });
};
//查詢ID最大值
exports.findMaxId = function (key,callback) {
    var collection = mdatabase.collection(key);
    collection.find().sort({"_id":-1}).limit(1).toArray(function(err, items) {
        if(err)
        {
            console.log('Error:'+ err);
            return;
        }
        //调用传入的回调方法，将操作结果返回
        if(items[0])
            callback(items[0]._id);
        else
            callback();
    });
};