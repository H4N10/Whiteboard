function freeGraphic(type,canvas){
	this._init(type,canvas);
}
freeGraphic.prototype._init=function(type,canvas){
	var self=this;
	if(!type||type===undefined)
		return;
	if(!canvas||canvas===undefined)
		return;
	self.type=type;
	// self.canvas=canvas;
	self.canvas=document.getElementById("canvas");
	self.context=this.canvas.getContext("2d");
	self.startX=self.startY=self.endX=self.endY=0;
	self.isClick=false;
    // Html连接webSocket demo
    self.ws = new WebSocket("ws://localhost:"+window.sessionStorage.getItem("key"));
    // self.ws.onopen = function (ev) {
    //     console.log(1)
    //     console.log('Connection to server opened');
    //     self.ws.send('哈哈哈');
    // }
    // console.log(self.ws)
    self.ws.onmessage=function(ev){
        var getInfo=JSON.parse(ev.data);
    	console.log(getInfo)
		// self.ws.close()

    }
	self.canvas.onmousedown=function(e){
		self.mouseDown(e)
	}
	self.canvas.onmousemove=function(e){
		self.mouseMove(e);
	}
	self.canvas.onmouseup=function(e){
		self.mouseUp(e);
	}
}
freeGraphic.prototype.mouseDown=function(e){
	if(1 == e.which){
        this.isClick=true;
        this.startX=e.clientX;
        this.startY=e.clientY;
	}
}
freeGraphic.prototype.mouseMove=function(e){
	if(this.isClick){
		this.endX=e.clientX;
		this.endY=e.clientY;
		this.drawGraphic();
	}else{
		return;
	}
}
freeGraphic.prototype.mouseUp=function(e){
	this.isClick=false;
}
freeGraphic.prototype.drawGraphic=function(){
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
	}
    // var toDataUrl=this.canvas.toDataURL("image/png");
    // this.ws.send(toDataUrl);
	var self=this;
	self.shapeList={
		"type":self.type,
		"startX":self.startX,
		"startY":self.startY,
		"endX":self.endX,
		"endY":self.endY
	}
	console.log(self.shapeList)
	this.ws.send(JSON.stringify(self.shapeList))
	console.log(this.ws)
}
freeGraphic.prototype.drawLine=function(){
	this.context.beginPath();
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.context.moveTo(this.startX,this.startY);
	this.context.lineTo(this.endX,this.endY);
	this.context.stroke();
	this.context.closePath();
	this.context.restore();
}
freeGraphic.prototype.drawRect=function(){
	this.context.beginPath();
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.context.rect(this.startX,this.startY,this.endX-this.startX,this.endY-this.startY);
	this.context.fill();
	this.context.closePath();
	this.context.restore();
}
freeGraphic.prototype.drawCircle=function(){
	this.context.beginPath();
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	this.context.arc(this.startX,this.startY,Math.sqrt((this.endX-this.startX)*(this.endX-this.startX)+(this.endY-this.startY)*(this.endY-this.startY)),0,2*Math.PI,false);
	this.context.fill();
	this.context.closePath();
	this.context.restore();
}
