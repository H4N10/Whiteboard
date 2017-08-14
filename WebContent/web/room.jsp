<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>电子白板</title>
<link rel="stylesheet" type="text/css" href="../css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="../css/room.css">
<link rel="stylesheet" type="text/css" href="../css/jquery.toolbar.css">

</head>
<body>
	<div class="container">
		<div class="row">
			<div class="col-md-10">
				<div class="panel panel-primary">
					<div class="panel-heading">
						<h3 class="panel-title">画板</h3>
					</div>
					<canvas id="whiteBand" class="panel-body" style=""> </canvas>
					<!-- 					工具栏 -->
					<div class="panel-footer">
						<div class="btn-group">
							<button type="button" class="btn btn-default"
								onclick="selectShape(0)">矩形</button>
							<button type="button" class="btn btn-default"
								onclick="selectShape(1)">圆形</button>
							<button type="button" class="btn btn-default"
								onclick="selectShape(2)">直线</button>
						</div>
					</div>
				</div>
			</div>
			<div class="col-md-2">
				<div class="well well-lg"></div>
			</div>
		</div>
	</div>

	<!-------JS------>
	<script type="text/javascript" src="../js/esl.js"></script>
	<script type="text/javascript" src="../js/jquery.min.js"></script>
	<script type="text/javascript" src="../js/bootstrap.min.js"></script>
	<script type="text/javascript" src="../js/addShape.js"></script>
	<script type="text/javascript" src="../js/room.js"></script>
	<script type="text/javascript" src="../js/jquery.toolbar.js"></script>
	<script type="text/javascript">
		$('.user-toolbar').toolbar({
			content : '#user-toolbar-options',
			position : 'top'
		});
	</script>
</body>
</html>