 // 绘制矩形
function addRect(cxt, startX, startY, endX, endY) {
	cxt.fillStyle = "#EED5B7";
//	cxt.fillRect(startX, startY, endX - startX, endY - startY);
	cxt.strokeRect(startX, startY, endX - startX, endY - startY);
}
// 绘制圆形
function addCircle(cxt, startX, startY, endX, endY) {
	cxt.fillStyle = "#EED5B7";
	r = getDistance( startX, startY, endX, endY);
	cxt.beginPath();
	cxt.arc(startX,startY,r/2,0,2*Math.PI);
	cxt.stroke();
}
// 绘制直线
function addLine(ctx, startX, startY, endX, endY){
	ctx.beginPath();
	ctx.lineWidth="1";
	ctx.strokeStyle="red"; // 红色路径
	ctx.moveTo(startX,startY);
	ctx.lineTo(endX, endY);
	ctx.stroke(); // 进行绘制
}
//求两点间距离
function getDistance(x1,y1,x2,y2){
	calX = x2-x1;
	calY = y2-y1;
	return Math.pow((calX *calX + calY * calY), 0.5);
}