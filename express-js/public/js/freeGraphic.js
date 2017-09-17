function freeGraphic(type,canvas,ws,verifyKey){
	this._init(type,canvas,ws,verifyKey);
}
freeGraphic.prototype={
	_init:function(type,canvas,ws,verifyKey){
	    var self=this;
	    if(!type||type===undefined)
	        return;
	    if(!canvas||canvas===undefined)
	        return;
	    self.type=type;
	    self.isMouseDraw=false;
	    self.canvas=document.getElementById("canvas");
	    self.context=this.canvas.getContext("2d");
	    self.startX=self.startY=self.endX=self.endY=0;
	    self.isClick=false;
	    self.shapeList=new Array();
	    self.pointArray=new Array();
	    self.shapeListJson=new Object();
	    // Html连接webSocket demo
	    self.ws =ws;
	    self.verifyKey=verifyKey;
	    self.eventFunction();
	},
	eventFunction:function(){
		var self=this;
        self.canvas.onmousedown=function(e){
            self.isMouseDraw=true;
            self.mouseDown(e)
        }
        self.canvas.onmousemove=function(e){
            self.isMouseDraw=true;
            self.mouseMove(e);
        }
        self.canvas.onmouseup=function(e){
            self.isMouseDraw=false;
            self.mouseUp(e);
        }
	},
	mouseDown:function(e){
		var self=this;

	    if(1 == e.which){
	        this.isClick=true;
	        this.startX=e.clientX;
	        this.startY=e.clientY;
            self.rect=self.canvas.getBoundingClientRect();
            self.startX=(self.startX-self.rect.left)*(self.canvas.width/self.rect.width);
            self.startY=(self.startY-self.rect.top)*(self.canvas.height/self.rect.height);
	    }
	},
	mouseMove:function(e){
		var self=this;
	    if(this.isClick){
	        this.endX=e.clientX;
	        this.endY=e.clientY;
            self.rect=self.canvas.getBoundingClientRect();
            self.endX=(self.endX-self.rect.left)*(self.canvas.width/self.rect.width);
            self.endY=(self.endY-self.rect.top)*(self.canvas.height/self.rect.height);
	        this.drawGraphic();
	    }else{
	        return;
	    }
	},
	mouseUp:function(e){
		var self=this;
	    if(self.type!=4) {
            self.shapeList.push(self.shape);
        }else{
            self.shapeList.push(self.pointArray);
            self.pointArray=new Array();
		}
        self.shapeListJson={
            key:self.verifyKey, //TODO  ，这里加个key 把连接时我返回给你的key传给我
            shapeList:self.shapeList,
            shape:self.shape,
            pointArray:self.pointArray
        }
        if(self.type!=4)
        	self.shapeListJson.shape={};
        self.ws.send(JSON.stringify(self.shapeListJson))
        self.isClick=false;
	},
	drawGraphic:function(){
	    this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	    var self=this;
	    if(self.isMouseDraw) {
	        self.shape={
	            "type": self.type,
	            "startX": self.startX,
	            "startY": self.startY,
	            "endX": self.endX,
	            "endY": self.endY,
				"key":self.verifyKey
	        }
	        if(self.shape.type!=4)
	        	self.pointArray=new Array();
	        else{
                self.pointArray.push(self.shape);
			}
	        self.shapeListJson={
	        	key:self.verifyKey, //TODO  ，这里加个key 把连接时我返回给你的key传给我
	            shapeList:self.shapeList,
	            shape:self.shape,
				pointArray:self.pointArray
	        }
            drawSaveShape(self.shapeListJson,self);
	        self.ws.send(JSON.stringify(self.shapeListJson))
	    }
	    if(self.shape.type!=4){
            self.startX=self.shape.startX;
            self.startY=self.shape.startY;
		}else{
            self.startX=self.shape.endX;
            self.startY=self.shape.endY;
		}
        self.type=self.shape.type;
	},
	drawGraphicType:function(){
		var self=this;
	    this.context.strokeStyle="#15dde8";
	    this.context.fillStyle="#15dde8";
	    this.context.lineWidth=1;
	    switch(this.type){
	        case 1:
	            this.drawLine();
	            break;
	        case 2:
	            this.drawRect();
	            break;
	        case 3:
	            this.drawCircle();
	            break;
            case 4:
                this.drawLine();
                break;
	    }
	},
	drawLine:function(){
	    this.context.beginPath();
	    this.context.moveTo(this.startX,this.startY);
	    this.context.lineTo(this.endX,this.endY);
	    this.context.stroke();
	    this.context.closePath();
	    this.context.restore();
	},
	drawRect:function(){
	    this.context.beginPath();
	    this.context.rect(this.startX,this.startY,this.endX-this.startX,this.endY-this.startY);
	    this.context.fill();
	    this.context.closePath();
	    this.context.restore();
	},
	drawCircle:function(){
	    this.context.beginPath();
	    this.context.arc(this.startX,this.startY,Math.sqrt((this.endX-this.startX)*(this.endX-this.startX)+(this.endY-this.startY)*(this.endY-this.startY)),0,2*Math.PI,false);
	    this.context.fill();
	    this.context.closePath();
	    this.context.restore();
	}

}

//绘制保存的图像信息
function drawSaveShape(obj,obj2){
    obj2.isMouseDraw=false;
    obj2.shapeListJson=obj;
    obj2.shape=obj.shape;
    obj2.shapeList=obj.shapeList;
    obj2.pointArray=obj.pointArray;
    obj2.context.clearRect(0,0,obj2.canvas.width,obj2.canvas.height);
    if(obj.pointArray[0]!=undefined&&obj.pointArray.length!=0){
        for(var i=0;i<obj.pointArray.length;i++){
            var getInfo=obj.pointArray[i];
            attrChange(getInfo,obj2)
            obj2.drawGraphicType();
        }
    }
    if(obj.shapeList[0]!=undefined&&obj.shapeList.length!=0){
        for(var i=0;i<obj.shapeList.length;i++){
            var getInfo=obj.shapeList[i];
            if(isArray(getInfo)){
            	for(var j=0;j<obj.shapeList[i].length;j++){
            		var getInfo2=obj.shapeList[i][j];
                    attrChange(getInfo2,obj2);
                    obj2.drawGraphicType();
				}
			}else{
                attrChange(getInfo,obj2)
                obj2.drawGraphicType();
			}
        }
    }
    if(obj.shape.startX!=undefined){
        attrChange(obj.shape,obj2);
        obj2.drawGraphicType();
	}
}

//参数赋值
function attrChange(obj,obj2){
    obj2.startX=obj.startX;
    obj2.startY=obj.startY;
    obj2.endX=obj.endX;
    obj2.endY=obj.endY;
    obj2.type=obj.type;
}

//判断是否是数组
function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

//删除数组对象index位置元素
function spliceAttr(arr,index){
	var newArr=new Array();
	for(var i=0;i<arr.length;i++){
		if(i!=index)
			newArr.push(arr[i]);
	}
	return newArr;
}