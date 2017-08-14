﻿# Whiteboard   电子白板 1.0
---
##目录

* [需求分析](#需求分析 )
* [实现功能](#实现功能 )
* [技术架构](#技术架构 )
* [开发工具](#开发工具 )
 


##阶段目标
- [x] 需求分析
- [x] 系统设计
- [ ] 详细设计
- [ ] 编码
- [ ] 测试

##需求分析

    主要实现一个在线电子白板：可以用鼠标模拟画笔在绘图区进行绘制，可以支持多人连线在一个房间里文字聊天，甚至互动。
      
    目前想到的，服务器和客户端之间的连接应该要用到WebSocket技术；
    从软件程序着手，系统涉及到了前端交互与后端的数据连接。
    基于目前技术栈限与NodeJs、Html、CSS、JAVASCRIPT(可能选用AngularJs,React Native,BootStrap)，
    先用这套方案对项目系统进行设计，待未来有更好的解决方案再做分支。

## 实现功能

### 服务器端
 1.  创建服务器端口号供客户端连接（长连接）
 2.  支持区分身份（1.0版本暂定房主才可绘制图形）
 3.  支持接收消息并转发给对应房间的用户

### 浏览器端
 1.  可选择创建房间，随机生成房间号及房主ID
 2.  可选择加入房间，随机生成访客ID
 3.  编写绘图界面，编写绘图面板，可绘制基本图形
 4.  接收服务端传来的图形信息，同步绘制在面板中

## 技术架构
###客户端与服务器交互示意图 
![流程图](images/diagram-1.jpg?raw=true)

### 服务器端架构；

#### 主要业务：在线创建房间和多用户加入房间，并且将同属于一个房间中的角色、人员进行一定的通讯绑定。
#### 日志设计：打印日志，方便追踪过程、查看问题。
#### 实体设计：这里结合继承、封装、多态的概念，对主要的几个实体进行设计。

1. **用户实体**：设计一个用户的属性和开放的接口（接口不一定要实现）；用户的身份识别可以利用客户端网页的Cookies实现，用户间信号的传递存储可以统一由服务端进行转发。通讯的**信息内容**可以由服务器**运行内存**保管。
>  有必要可以研究UML建模工具比如（https://www.processon.com/diagrams）
    - 用户属性：用户ID，用户昵称，用户角色，钥匙（权限）
    - 用户接口：转发绘图信息()，接收绘图信息()，获取用户信息()，加入房间()，退出房间()
 

2. **房间实体**：房间实体的设计为了最大程度解耦，类中**不应该**包含任何和自身无关的属性，比如当前房间中的用户列表、当前房间中的绘图数据；设计简洁便于日后继承和扩展。
    - 房间属性：房间ID，房间名，房间创建日期，房间状态，房间人数上限；
    - 房间接口：开启房间()，关闭房间()，查询所有已存在房间()，清理房间()，接收新用户()；
    

3. **钥匙**：普通用户和管理员用户对房间的操作是不同的，将它设计成一个基础钥匙类用于各种钥匙进行继承，不同的用户角色所用户的钥匙有不同的功能，这里先列出一把钥匙可能拥有的所有功能：
    - 钥匙属性：钥匙状态，钥匙类型，钥匙对应的房间（可拟定万能钥匙能进所有房间）
    - 钥匙接口：检查是否有某个房间的权限()，

4. **信息板**：所有的聊天数据，绘图数据都可以存入信息板，将其设计为一个装所有数据包的容器。每个房间**只有一个**信息板。信息板里装的是一个个**数据包**，每个客户端的页面显示主要是通过得到**信息板后**在页面上把内容重新绘制出来。
    - 信息板属性：信息板状态，信息板类型（比如是否可擦写），信息板当前对应的房间
    - 信息板接口：添加新数据（），擦去指定数据（），清空信息板，移动信息板到其它房间（），销毁信息板（），获取信息板数据（）；

5. **信息数据包**：无论绘图还是聊天还是表情包还是特殊的动作，全都继承扩展自该实体，信息板上的一条条图文形状聊天本质上是一个信息数据包；
    - 数据包接口：删除（），修改（），展现（不同类型的数据包的展现绘图方式，在这个方法里各自实现），
    - 数据包属性：数据包来源用户，数据包状态（显示、隐藏、撤回），数据包类型（图形/聊天文字）


### 服务端框架的设计

#### NodeJs

> Node.js主要用于编写像Web服务器一样的网络应用，这和PHP和Python是类似的。但是Node.js与其他语言最大的不同之处在于，PHP等语言是阻塞的（只有前一条命令执行完毕才会执行后面的命令），而Node.js是非阻塞的（多条命令可以同时被运行，通过回调函数得知命令已结束运行）。
Node.js是事件驱动的。开发者可以在不使用线程的情况下开发出一个能够承载高并发的服务器。其他服务器端语言难以开发高并发应用，而且即使开发出来，性能也不尽人意。Node.js正是在这个前提下被创造出来。Node.js把JavaScript的易学易用和Unix网络编程的强大结合到了一起。

#### Express.js
> Express 是一个简洁而灵活的 node.js Web应用框架, 提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。
Express 框架核心特性：
- 可以设置中间件来响应 HTTP 请求。
- 定义了路由表用于执行不同的 HTTP 请求动作。
- 可以通过向模板传递参数来动态渲染 HTML 页面。

### 页面端框架的设计

#### 主要内容

- 页面布局（自适应）
- 函数布局（MVVM结构）
     

#### Html5 WebSocket

看到一篇知乎专栏 [WebSocket 浅析](https://zhuanlan.zhihu.com/p/25592934)

>   WebSocket API
WebSocket 对象提供了一组 API，用于创建和管理 WebSocket 连接，以及通过连接发送和接收数据。浏览器提供的WebSocket API很简洁，调用示例如下：
var ws = new WebSocket('wss://example.com/socket'); // 创建安全WebSocket 连接（wss）
 ws.onerror = function (error) { ... } // 错误处理
 ws.onclose = function () { ... } // 关闭时调用
 ws.onopen = function () { // 连接建立时调用
   ws.send("Connection established. Hello server!"); // 向服务端发送消息
 }
 ws.onmessage = function(msg) { // 接收服务端发送的消息
   if(msg.data instanceof Blob) { // 处理二进制信息 processBlob(msg.data);
   } else {     processText(msg.data); // 处理文本信息
   }
 }

#### Vue.js （国产轻量类似Angularjs,入门参考http://www.runoob.com/vue2/vue-tutorial.html）

> Vue.js（读音 /vjuː/, 类似于 view） 是一套构建用户界面的 渐进式框架。与其他重量级框架不同的是，Vue 采用自底向上增量开发的设计。Vue 的核心库只关注视图层，并且非常容易学习，非常容易与其它库或已有项目整合。另一方面，Vue 完全有能力驱动采用单文件组件和 Vue 生态系统支持的库开发的复杂单页应用。
Vue.js 的目标是通过尽可能简单的 API 实现响应的数据绑定和组合的视图组件。

#### React Native （强大的多终端生态圈）

> React Native使你能够在Javascript和React的基础上获得完全一致的开发体验，构建世界一流的原生APP。
React Native着力于提高多平台开发的开发效率 —— 仅需学习一次，编写任何平台。(Learn once, write anywhere)
Facebook已经在多项产品中使用了React Native，并且将持续地投入建设React Native。


##开发工具 
- SublimeText 3
- webstorm
 

测试
