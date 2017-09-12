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
        self.rect=self.canvas.getBoundingClientRect();
	    self.startX=self.startY=self.endX=self.endY=0;
	    self.isClick=false;
	    self.shapeList=new Array();
	    self.pointArray=new Array();
	    self.shapeListJson=new Object();
	    // Html连接webSocket demo
	    self.ws =ws;
	    self.verifyKey=verifyKey;
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
	    	if(self.pointArray.length!=0&&self.pointArray[0]!=undefined){
                for(var i=0;i<self.pointArray.length;i++){
                    self.shapeList.push(self.pointArray[i]);
                }
                self.pointArray.length=0;
			}
	        this.isClick=true;
	        this.startX=e.clientX;
	        this.startY=e.clientY;
	    }
	},
	mouseMove:function(e){
	    if(this.isClick){
	        this.endX=e.clientX;
	        this.endY=e.clientY;
	        this.drawGraphic();
	    }else{
	        return;
	    }
	},
	mouseUp:function(e){
		var self=this;
        self.isClick=false;
	    if(self.type!=4){
            self.shapeList.push(self.shape);
		}else{
	    	for(var i=0;i<self.pointArray.length;i++){
                self.shapeList.push(self.pointArray[i]);
			}
            self.pointArray.length=0;
		}
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
	            "endY": self.endY
	        }
	        if(self.shape.type!=4)
	        	self.pointArray.length=0;
			self.pointArray.push(self.shape);
	        self.shapeListJson={
	        	key:self.verifyKey, //TODO  ，这里加个key 把连接时我返回给你的key传给我
	            shapeList:self.shapeList,
	            shape:self.shape,
				pointArray:self.pointArray
	        }
	        self.ws.send(JSON.stringify(self.shapeListJson))
	    }
	    self.drawGraphicType();
	    if(self.shapeList[0]!=undefined){
	        for(var i=0;i<self.shapeList.length;i++){
	            self.startX=self.shapeList[i].startX;
	            self.startY=self.shapeList[i].startY;
	            self.endX=self.shapeList[i].endX;
	            self.endY=self.shapeList[i].endY;
	            self.type=self.shapeList[i].type;
	            self.drawGraphicType();
	        }
	    }
        for(var i=0;i<self.shapeListJson.pointArray.length;i++){
            var shape=self.shapeListJson.pointArray[i];
            self.startX=shape.startX;
            self.startY=shape.startY;
            self.endX=shape.endX;
            self.endY=shape.endY;
            self.type=shape.type;
            self.drawGraphicType();
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
	    this.context.strokeStyle="#15dde8";
	    this.context.fillStyle="#15dde8";
	    this.context.lineWidth=1;
	    this.startX=(this.startX-this.rect.left)*(this.canvas.width/this.rect.width);
	    this.startY=(this.startY-this.rect.top)*(this.canvas.height/this.rect.height);
	    this.endX=(this.endX-this.rect.left)*(this.canvas.width/this.rect.width);
	    this.endY=(this.endY-this.rect.top)*(this.canvas.height/this.rect.height);
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