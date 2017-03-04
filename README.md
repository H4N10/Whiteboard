# Whiteboard   电子白板 1.0
---
##目录
* [开发工具](#开发工具 )
* [项目语言/框架](#项目语言/框架 )
* [项目思维导图1.0](#项目思维导图1.0 )
* [需求1.0](#需求1.0 )

##开发工具 

- SublimeText 3
- Eclipse


##项目语言/框架
- JAVA
- Html5

##项目思维导图1.0
![流程图](https://github.com/H4N10/Whiteboard/blob/master/%E5%88%9D%E6%AD%A5%E6%B5%81%E7%A8%8B%E5%9B%BE.jpg?raw=true)
 

##需求1.0
### 服务器端
 - 创建服务器端口号供客户端连接（长连接）
 - 支持区分身份（1.0版本暂定房主才可绘制图形）
 - 支持接收消息并转发给对应房间的用户

### 浏览器端
 - 可选择创建房间，随机生成房间号及房主ID
 - 可选择加入房间，随机生成访客ID
 - 编写绘图界面，编写绘图面板，可绘制基本图形
 - 接收服务端传来的图形信息，同步绘制在面板中
