$(function() {
	var c = document.getElementById("whiteBand");
	var cxt = c.getContext("2d");
	// 标记左键是否处于按下状态:0未点击；1点击
	// 监听鼠标事件
	flag = 0;
	var startX = 0;
	var startY = 0;
	var oldstartX = 0;
	var oldstartY = 0;
	var oldendX = 0;
	var oldendY = 0;
	$("#whiteBand").mousedown(function(e) {
		if (1 == e.which) { // 这 是左键单击事件,右击为3
			flag = 1;
			var vanvasPos = getCanvasPos(c, e);
			startX = vanvasPos.x;
			startY = vanvasPos.y;
		}
	})
	$("#whiteBand").mouseup(function(e) {
		if (1 == e.which) { // 这 是左键单击事件
			flag = 0;
			var vanvasPos = getCanvasPos(c, e);
			if (whichShape != -1)
				addShape(startX, startY, vanvasPos.x, vanvasPos.y);
		}
	})
	$("#whiteBand").mousemove(function(e) {
		if (flag == 1) {
			var vanvasPos = getCanvasPos(c, e);
			clearCanvas(cxt, c);
			reviewAll(cxt);
			switch (whichShape) {
			case -1:
				break;
			case 0:
				addRect(cxt, startX, startY, vanvasPos.x, vanvasPos.y);
				break;
			case 1:
				addCircle(cxt, startX, startY, vanvasPos.x, vanvasPos.y);
				break;
			case 2:
				addLine(cxt,startX, startY, vanvasPos.x, vanvasPos.y);
				break;
			default:
				break;
			}
			savePoint(startX,startY,vanvasPos.x, vanvasPos.y);

		}
	})
});
// list数组：存放所有矢量图
var shapeList = new Array();
// 判断当前工具栏选择何种矢量图
var whichShape = -1;
// 获取鼠标在canvas上的坐标
function getCanvasPos(canvas, e) {
	var rect = canvas.getBoundingClientRect();
	return {
		x : (e.clientX - rect.left) * (canvas.width / rect.width),
		y : (e.clientY - rect.top) * (canvas.height / rect.height)
	};
}

// 清空画布
function clearCanvas(cxt, canvas) {
	var rect = canvas.getBoundingClientRect();
	cxt.clearRect(0, 0, rect.width, rect.height);
}
// 重绘所有已绘制图形
function reviewAll(cxt) {
	for (x in shapeList) {
		var shape = shapeList[x];
		switch (shape.type) {
		case 0:
			addRect(cxt, shape.startX, shape.startY, shape.endX, shape.endY);
			break;
		case 1:
			addCircle(cxt, shape.startX, shape.startY, shape.endX, shape.endY);
			break;
		case 2:
			addLine(cxt,shape.startX, shape.startY, shape.endX, shape.endY);
			break;
		default:
			break;
		}
	}
}
// 鼠标放开时 添加图形进数组
function addShape(startX, startY, endX, endY) {
	shape = new Object();
	shape.type = whichShape;
	shape.startX = startX;
	shape.startY = startY;
	shape.endX = endX;
	shape.endY = endY;
	shapeList.push(shape);
}
// 保存坐标（用于移动绘制时删除前次）
function savePoint(startX,startY,endX,endY) {
	oldstartX = startX;
	oldstartY = startY;
	oldendX = endX;
	oldendY = endY;
}

// 工具栏选择矢量图
function selectShape(type) {
	whichShape = type;
}