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
	    // console.log(2)
	    self.isMouseDraw=false;
	    self.canvas=document.getElementById("canvas");
	    self.context=this.canvas.getContext("2d");
        self.rect=self.canvas.getBoundingClientRect();
	    self.startX=self.startY=self.endX=self.endY=0;
	    self.isClick=false;
	    self.shapeList=new Array();
	    self.shapListJson=new Object();
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
	    if(1 == e.which){
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
	    this.isClick=false;
	    this.shapeList.push(this.shape);
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
	        self.shapeListJson={
	        	key:self.verifyKey, //TODO  ，这里加个key 把连接时我返回给你的key传给我
	            shapeList:self.shapeList,
	            shape:self.shape
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
	        self.startX=self.shape.startX;
	        self.startY=self.shape.startY;
	        self.endX=self.shape.endX;
	        self.endY=self.shape.endY;
	        self.type=self.shape.type;
	    }
        self.startX=self.shape.startX;
        self.startY=self.shape.startY;
        self.endX=self.shape.endX;
        self.endY=self.shape.endY;
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