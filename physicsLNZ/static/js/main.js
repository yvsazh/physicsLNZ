// box2dweb
var box2d = {
	b2Vec2: Box2D.Common.Math.b2Vec2,
	b2BodyDef: Box2D.Dynamics.b2BodyDef,
	b2Body: Box2D.Dynamics.b2Body,
	b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
	b2Fixture: Box2D.Dynamics.b2Fixture,
	b2World: Box2D.Dynamics.b2World,
	b2MassData: Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape: Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw: Box2D.Dynamics.b2DebugDraw,
	b2MouseJointDef:  Box2D.Dynamics.Joints.b2MouseJointDef,
	b2RevoluteJointDef: Box2D.Dynamics.Joints.b2RevoluteJointDef,
	b2Shape: Box2D.Collision.Shapes.b2Shape,
	b2Joint: Box2D.Dynamics.Joints.b2Joint,
	b2Settings: Box2D.Common.b2Settings,
	b2AABB: Box2D.Collision.b2AABB,
};

// scaling
var SCALE = 100;

// useful
var world;
var physicsOn = true;
var canvas = $("#canvas");
var canvas_width = canvas[0].width;
var canvas_height = canvas[0].width;
var ctx = canvas[0].getContext('2d');
var fps = 60;
var pos = $("#canvas").offset();
var mode = 0 // 0 - no mode; 1 - create box; 2 - create circle; 3 - create joint; 4 - move object; 5 - select object; 6 - delete object; 7 - copy object; 8 - create wall
var mouse_pressed = false;
var mouseX, mouseY, mousePVec, selectedBody, mouseJoint, offsetX, offsetY;

// objects
var obj_id = 0;
var objects = [];

// world
var doSleep = false;
var standartEarthGravity = 10;
var gravityStrength = standartEarthGravity;
var gravityOn = true;

// camera
var camera = new Camera(0, 0, 1, 10);

// parse World Settings
if ($("#saveWorldSettings").val() != "") {
	var worldSettingsData = JSON.parse($("#saveWorldSettings").val());
	standartEarthGravity = worldSettingsData.standartEarthGravity;
	gravityStrength = worldSettingsData.gravityStrength;
	gravityOn = worldSettingsData.gravityOn;	
	physicsOn = worldSettingsData.physicsOn;
	try {
		camera = new Camera(worldSettingsData.cameraInfo.x, worldSettingsData.cameraInfo.y, worldSettingsData.cameraInfo.zoom, 10);
	} catch {

	}

	// interface
	$("#world_gravity").val(gravityStrength);
	if(gravityOn) {
		$("#gravity").text("Виключити гравітацію");
	} else {
		$("#gravity").text("Включити гравітацію");
	}

	if(physicsOn) {
		$("#physics").text("Виключити фізичну симуляцію");
	} else {
		$("#physics").text("Включити фізичну симуляцію");
	}
}

var selectedObject;

// box options
var box_options = {
	density: 1.0,
	friction : 1.0,
	restitution: 0.5,
	mass: 1,
	type: box2d.b2Body.b2_dynamicBody,
	fixedRotation: false,
}

var boxFirstCord;
var newBoxWidth;
var newBoxHeight;
var drawBoxPreview = false;

// copy box
var copyBoxWidth, copyBoxHeight, copyBoxAngle;
var copyObject;
var boxCopyPreview = false;

// copy circle
var copyCircleRadius, copyCircleAngle;
var circleCopyPreview = false;

// circle options
var circle_options = {
	density: 1.0,
	friction : 1.0,
	restitution: 0.5,
	mass: 1,
	type: box2d.b2Body.b2_dynamicBody,
	fixedRotation: false,
}

var circleCord;
var startCircleRadius = 30;
var circleRadius = 30;
var drawCirclePreview = false;

// joint options
var selectedBodies = 0;
var bodyA, bodyB;
var jointPos;
var jointPreview = false;
var jointCreate = 0;

var bodyA_id;
var bodyB_id;

var shiftPressed = false;
var ctrlPressed = false;

// create world func
function createWorld(context) {
	var gravity = new box2d.b2Vec2(0, gravityStrength);
	var world = new box2d.b2World(gravity, doSleep);

	updateDebugDraw(context, world);

	return world;
};

// drawing world func
function drawWorld(world, context) {
	ctx.clearRect(0, 0, canvas_width, canvas_height);
	// world.DrawDebugData();

	ctx.save();
	ctx.translate(-camera.x, camera.y)

	for (var i = 0; i < objects.length; i++) {
		objects[i].draw(ctx);
	}

	if (mode != 2) {
		circleRadius = startCircleRadius;
	}

	if (drawBoxPreview) {
		if (mode == 8) {
			ctx.fillStyle = "rgba(144, 238, 144, 0.5)"
		} else {
			ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
		}
		
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
		ctx.lineWidth = 5;
		ctx.fillRect(boxFirstCord[0], boxFirstCord[1], newBoxWidth, newBoxHeight);
		ctx.strokeRect(boxFirstCord[0], boxFirstCord[1], newBoxWidth, newBoxHeight);
	}

	if (drawCirclePreview) {
		ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.arc(mouseX, mouseY, circleRadius, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
	}

	if (jointPreview) {
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
		ctx.strokeStyle = "rgba(232, 255, 31, 0.5)"
		ctx.lineWidth = 2;
		ctx.fillRect(mouseX-4, mouseY-4, 8, 8);
		ctx.strokeRect(mouseX-4, mouseY-4, 8, 8);
	}

	if (boxCopyPreview) {
		ctx.fillStyle = "rgba(252, 255, 119, 0.5)";
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
		ctx.lineWidth = 5;
		ctx.save();
		ctx.translate(mouseX, mouseY);
		ctx.rotate(copyBoxAngle);
		ctx.fillRect(-copyBoxWidth / 2, -copyBoxHeight / 2, copyBoxWidth, copyBoxHeight);
		ctx.strokeRect(-copyBoxWidth / 2, -copyBoxHeight / 2, copyBoxWidth, copyBoxHeight);
		ctx.restore();		
	}
	if (circleCopyPreview) {
		ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
		ctx.strokeStyle = "rgba(0, 0, 0, 0.5)"
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.arc(mouseX, mouseY, copyCircleRadius, 0, Math.PI*2);
		ctx.fill();
		ctx.stroke();
	}

	var halfSize = 10; // Розмір пів квадрата
	ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищення канвасу
	ctx.beginPath();
	ctx.moveTo(mouseX, mouseY); // Починаємо з поточних координат курсора
	ctx.lineTo(mouseX + halfSize, mouseY); // Лінія вправо від курсора
	ctx.lineTo(mouseX, mouseY + halfSize); // Лінія вниз від курсора
	ctx.closePath();
	ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Задаємо колір пів квадрата
	ctx.fill();

	save();
	ctx.restore();
}

function copy(type) {
	var changeX = (copyBoxWidth/SCALE/2);
	var changeY = (copyBoxHeight/SCALE/2);
	if (type == "box") {
		objects.push(new Box(world, (mouseX - (copyBoxWidth/2))/SCALE + changeX, (mouseY - (copyBoxHeight/2))/SCALE + changeY, changeX, changeY, obj_id, copyObject.options, copyObject.material));
		objects[objects.length-1].angle = copyBoxAngle;
	}
	if (type == "circle") {
		objects.push(new Circle(world, mouseX/SCALE, mouseY/SCALE, copyCircleRadius/SCALE, obj_id, copyObject.options, copyObject.material));
		objects[objects.length-1].angle = copyCircleAngle;
	}
	$("#objects_list").append(`<a href="#" id="${obj_id}" class="list-elem">${objects[objects.length-1].name} <span>${objects[objects.length-1].id}</span></a>`);
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].id == obj_id && type == "box") {
			$(`#${obj_id}`).after(addBoxToList(obj_id, objects[i]));
		}
		if (objects[i].id == obj_id && type == "circle") {
			$(`#${obj_id}`).after(addCircleToList(obj_id, objects[i]));
		}
	}
	$(`#${type}-settings-${obj_id}`).hide();
	obj_id ++;
	boxCopyPreview = false;
	copyBoxWidth = undefined;
	copyBoxHeight = undefined;		
	copyObject = undefined;	
	circleCopyPreview = false;
	copyCircleRadius = undefined;	
	copyObject = undefined;	
}

// deleting object
function deleteObject(object, i, type) {
	if (type == "box"){
		world.DestroyBody(object.body);
		$(`#${object.id}`).remove();
		$(`#box-settings-${object.id}`).remove();
		objects.splice(i, 1);						
	}
	if (type == "circle"){
		world.DestroyBody(object.body);
		$(`#${object.id}`).remove();
		$(`#circle-settings-${object.id}`).remove();
		objects.splice(i, 1);						
	}
	if (type == "joint"){
		world.DestroyJoint(object.joint);
		$(`#${object.id}`).remove();
		$(`#joint-settings-${object.id}`).remove();
		objects.splice(i, 1);						
	}
}

// updating debug draw
function updateDebugDraw(context, world) {
	var debugDraw = new box2d.b2DebugDraw();
	debugDraw.SetSprite(context);
	debugDraw.SetDrawScale(SCALE);
	debugDraw.SetFillAlpha(0.8);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);

	world.SetDebugDraw(debugDraw);
}

// moving objects using mouse
function moveObjects() {
	if (physicsOn) {
		$("#hint").text("Затисніть ЛКМ, щоб рухати обʼєкт. Зараз увімкнена фізична симуляція, тому обʼєкти будуть рухатися фізично.");
		if(mouse_pressed && (!mouseJoint)) {
			var body = getBodyAtMouse(mouseX/SCALE, mouseY/SCALE);
			if(body) {
				var def = new box2d.b2MouseJointDef();
				def.bodyA = world.GetGroundBody();
				def.bodyB = body;
				def.target.Set(mouseX/SCALE, mouseY/SCALE);
				def.collideConnected = true;
				def.maxForce = 1000 * body.GetMass();
				mouseJoint = world.CreateJoint(def);
				body.SetAwake(true);
			}
		}
		if(mouseJoint) {
			if(mouse_pressed) {
				mouseJoint.SetTarget(new box2d.b2Vec2(mouseX/SCALE, mouseY/SCALE));
			} else {
				world.DestroyJoint(mouseJoint);
				mouseJoint = null;
			}
		}		
	} else {
		$("#hint").text("Затисніть ЛКМ, щоб рухати обʼєкт. Зараз фізична симуляція вимкнена, тому обʼєкти рухаються не фізично. ОБЕРЕЖНО: коли ви починаєте рухати обʼєкт, його центр переноситься на місце курсора.");
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].selected) {
				$("#hint").text("Покрутіть колесо миші аби повернути обʼєкт.");
			}
		}		
		if (mouse_pressed) {
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].selected) {
					objects[i].changeCoords(mouseX, mouseY);
				}
			}
		}
	}
}

function findObjectById(id) {
	for (var i = 0; i < objects.length; i++) {
		objects[i].over_selected = false;
		if (objects[i].id == id) {
			return [objects[i], i];
		}
	}
}

function findSelectedObject() {
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].selected || objects[i].delete_selected) {
			return [objects[i], i];
		}
	}
}

// updating gravity
function updateGravity(gravity) {
	if (gravity != gravityStrength) {
		world.SetGravity(new box2d.b2Vec2(0, gravity));
		gravityStrength = gravity;
		if (gravity != 0) {
			gravityOn = true;
		} else {
			gravityOn = false;
		}		
	}
}

function step() {
	var timeStep = 1/fps;

	if(physicsOn) {
		world.Step(timeStep, 8, 3);
		world.ClearForces();		
	}
	SCALE = 100 + camera.zoom
	updateDebugDraw(ctx, world);
	camera.update();
	if (mode != 3) {
		jointPreview = false;
		selectedBodies = 0;
		bodyA = null;
		bodyB = null;
		jointCreate = 0;
	}
	drawWorld(world, ctx);
}

document.addEventListener('mousedown', function(e) {
	if (e.target === document.getElementById("canvas")){
		mouse_pressed = true;
		if (mode == 1 || mode == 8) {
			boxFirstCord = [mouseX, mouseY];
		}
		if (mode == 2) {
			objects.push(new Circle(world, mouseX/SCALE, mouseY/SCALE, circleRadius/SCALE, obj_id, circle_options, "none"));
			$("#objects_list").append(`<a href="#" id="${obj_id}" class="list-elem">${objects[objects.length-1].name} <span>${objects[objects.length-1].id}</span></a>`);
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].id == obj_id) {
					$(`#${obj_id}`).after(addCircleToList(obj_id, objects[i]));
				}
			}
			$(`#circle-settings-${obj_id}`).hide();
			obj_id ++;
			mouse_pressed = false;
		}
		if (mode == 3) {
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].selected == true && objects[i].over_selected == false && selectedBodies < 2 && (objects[i].type == "box" || objects[i].type == "circle")) {
					objects[i].select(e);
					selectedBodies++;
					if (selectedBodies == 1) {
						bodyA = objects[i].body;
						bodyA_id = objects[i].id;
						$("#hint").text("Виберіть другий обʼєкт.");
					}
					if (selectedBodies == 2) {
						bodyB = objects[i].body;
						bodyB_id = objects[i].id;
						jointPreview = true;
						$("#hint").text("Поставте точку скріплення. Навколо цієї точки обʼєкти будуть обертатися.");
					}
				}
			}
			if (jointPreview) {
				jointCreate++;
				if (jointCreate >= 2) {
					objects.push(new Joint(world, (mouseX-4)/SCALE, (mouseY-4)/SCALE, bodyA, bodyB, 0, 0, true, obj_id));
					$("#objects_list").append(`<a href="#" id="${obj_id}" class="list-elem">${objects[objects.length-1].name} <span>${objects[objects.length-1].id}</span></a>`);
					objects[objects.length-1].bodyA_id = bodyA_id;
					objects[objects.length-1].bodyB_id = bodyB_id;
					bodyA_id = null;
					bodyB_id = null;
					for (var i = 0; i < objects.length; i++) {
						objects[i].selected = false
						objects[i].over_selected = false
						if (objects[i].id == obj_id) {
							$(`#${obj_id}`).after(addJointToList(obj_id, objects[i]));
						}
					}
					$(`#joint-settings-${obj_id}`).hide();
					obj_id ++;
					jointPreview = false;
					selectedBodies = 0;
					bodyA = null;
					bodyB = null;
					jointCreate = 0;
					$("#hint").text("Зʼєднання було створено. В налаштуваннях зʼєднання можна обмежити кут обертання навколо нього.");
				}			
			}
		}
		if (mode == 5) {
			for (var i = 0; i < objects.length; i++) {
				$(`.${objects[i].type}_settings`).hide();
				objects[i].over_selected = false;
			}
			var object = findSelectedObject()[0];
			if (object.over_selected == false) {
				object.select(e);
				$(`#${object.type}-settings-${object.id}`).show();
				$("#hint").text(`Обʼєкт "${object.name}" було вибрано`);
			} 
		}
		if (mode == 6) {
			var object = findSelectedObject();
			deleteObject(object[0], object[1], object[0].type);
			$("#hint").text(`Обʼєкт "${object[0].name}" було видалено`);
		}
		if (mode == 7) {
			for (var i = 0; i < objects.length; i++) {
				objects[i].over_selected = false;
			}
			
			if (!boxCopyPreview && !circleCopyPreview) {
				copyObject = findSelectedObject()[0];
				if (copyObject.type == "circle") {
					copyCircleRadius = copyObject.radius*SCALE;
					copyCircleAngle = copyObject.angle;
					circleCopyPreview = true;
				}
				if (copyObject.type == "box"){
					copyBoxWidth = copyObject.width*SCALE*2;
					copyBoxHeight = copyObject.height*SCALE*2;
					copyBoxAngle = copyObject.angle;
					boxCopyPreview = true;
				}
				$("#hint").text(`Натисніть ще раз, щоб створити копію обʼєкта.`);
			} else {
				copy(copyObject.type);
				$("#hint").text(`Обʼєкт було скопійовано.`);
			}
		}
	}
});

// Event Listeners
document.addEventListener("mousemove", function(e){
	if (e.target === document.getElementById("canvas")){
		if (canvas.css("zoom") == 1) {
			var k = 10;
		}
		if (canvas.css("zoom") == 0.7) {
			var k = 2;
		}
		if (canvas.css("zoom") == 0.7 && $(".content").css("zoom") == 0.8) {
			var k = 1;
		}

		k*=$("body").css("zoom");
		
		mouseX = (e.clientX - pos.left) + camera.x - (0 - e.clientX)/k;
		mouseY = (e.clientY - pos.top) - camera.y - (0 - e.clientY)/k;
		var mouse = new box2d.b2Vec2(mouseX, mouseY)
		if (mode == 1 && mouse_pressed || mode == 8 && mouse_pressed) {
			if (mouseX > boxFirstCord[0]){
				newBoxWidth = Math.abs(boxFirstCord[0]-mouseX);	
			} 	
			if (mouseX < boxFirstCord[0]){
				newBoxWidth = -Math.abs(boxFirstCord[0]-mouseX);	
			} 	
			if (mouseY > boxFirstCord[1]){
				if (!ctrlPressed){
					newBoxHeight = Math.abs(boxFirstCord[1]-mouseY);	
				}else {
					if (newBoxWidth < 0) {
						newBoxHeight = -newBoxWidth;
					} else {
						newBoxHeight = newBoxWidth;
					}
				}
	
			}
			if (mouseY < boxFirstCord[1]){
				if (!ctrlPressed){
					newBoxHeight = -Math.abs(boxFirstCord[1]-mouseY);	
				}
				else {
					if (newBoxWidth < 0) {
						newBoxHeight = newBoxWidth;
					} else {
						newBoxHeight = -newBoxWidth;
					}
					
				}
			}			
			drawBoxPreview = true;
		}

		if(mode == 2) {
			drawCirclePreview = true;
		} else {
			drawCirclePreview = false;
		}

		if (mode == 4) {
			moveObjects();
		}
		for (var i = 0; i < objects.length; i++) {
			objects[i].update(e, mode, [mouseX, mouseY]);
		}
	} else {
		for (var i = 0; i < objects.length; i++) {
			objects[i].selected = false;
			objects[i].delete_selected = false;
		}
	}
})

document.addEventListener('mouseup', function(e) {
	
	var changeX = (newBoxWidth/SCALE/2);
	var changeY = (newBoxHeight/SCALE/2);

	mouse_pressed = false;

	if (newBoxWidth < 0) {
		newBoxWidth = -newBoxWidth;
	}
	if (newBoxHeight < 0) {
		newBoxHeight = -newBoxHeight;
	}

	if (boxFirstCord != undefined) {
		if (mode == 8) {
			box_options.type = box2d.b2Body.b2_staticBody;
		} else {
			box_options.type = box2d.b2Body.b2_dynamicBody;
		}
		objects.push(new Box(world, boxFirstCord[0]/SCALE + changeX, boxFirstCord[1]/SCALE + changeY, (newBoxWidth/SCALE/2), (newBoxHeight/SCALE/2), obj_id, box_options, "none"));
		$("#objects_list").append(`<a href="#" id="${obj_id}" class="list-elem">${objects[objects.length-1].name} <span>${objects[objects.length-1].id}</span></a>`);
		for (var i = 0; i < objects.length; i++) {
			if (objects[i].id == obj_id) {
				$(`#${obj_id}`).after(addBoxToList(obj_id, objects[i]));
			}
		}
		$(`#box-settings-${obj_id}`).hide();
		obj_id ++;
		mouse_pressed = false;
		drawBoxPreview = false;
		boxFirstCord = undefined;
		newBoxWidth = 1;
		newBoxHeight = 1;		
	}

});

document.addEventListener('wheel', function(e) {
	if (mode != 2) {
		if (physicsOn) {
			if (e.target == document.getElementById("canvas")) {
				camera.scale(e);
			}			
		}
		if (!physicsOn && mode != 4) {
			if (e.target == document.getElementById("canvas")) {
				camera.scale(e);
			}	
		}
		if (!physicsOn && mode == 4) {
			try {
				var object = findSelectedObject()[0];
				object.angle += e.deltaY/1000;	
			} catch {
				if (e.target == document.getElementById("canvas")) {
					camera.scale(e);
				}	
			}		
		}
	} else {
		if (circleRadius >= 1) {
			circleRadius += e.deltaY/50;
		}else {
			circleRadius = 1;
		}
	}
});

document.addEventListener('keydown', function(e) {
	switch(e.keyCode) {
		case 87: // w
			camera.moveUp = true;
			break;
		case 65: // a
			camera.moveLeft = true;
			break;
		case 83: // s
			camera.moveDown = true;
			break;
		case 68: // d
			camera.moveRight = true;
			break;
		case 16: // shift
			shiftPressed = true;
			break;
		case 17: // ctrl
			ctrlPressed = true;
			break;
		// changing modes using keyboard
		case 85: // U
			mode = 1;
			$("#hint").text("Затисніть і потягніть щоб створити коробку. Затисніть control (ctrl) щоб створити ідеальний квадрат.");
			$('.menu-button').removeClass('active');
			$("#create_box").addClass("active");
			for (var i = 0; i < objects.length; i++) {
				objects[i].delete_selected = false;
			}
			break;
			
		case 73: // I
			mode = 8;
			$("#hint").text("Затисніть і потягніть щоб створити не фізичну коробку. Затисніть control (ctrl) щоб створити ідеальний квадрат.");
			$('.menu-button').removeClass('active');
			$("#create_wall").addClass("active");
			for (var i = 0; i < objects.length; i++) {
				objects[i].delete_selected = false;
			}
			break;
		case 79: // O
			mode = 2;
			$("#hint").text("Натисніть щоб створити круг. Прокрутіть колесо миші для зміни радіуса кола.");
			$('.menu-button').removeClass('active');
			$("#create_circle").addClass("active");
			for (var i = 0; i < objects.length; i++) {
				objects[i].delete_selected = false;
			}
			break;
		case 80: // P
			mode = 3;
			$("#hint").text("Виберіть по порядку обʼєкти які ви хочете скріпити. Після цього поставьте точку зʼєднання в потрібному місці. Навколо неї обʼєкти будуть рухатися.");
			$('.menu-button').removeClass('active');
			$("#create_joint").addClass("active");
			for (var i = 0; i < objects.length; i++) {
				objects[i].selected = false;
				objects[i].delete_selected = false;
				objects[i].over_selected = false;
			}
			break;
		case 72: // H
			mode = 4;
			$("#hint").text("Наведіть та затисніть ліву кнопку миші. Після цього ви можете перетаскувти обʼєкт фізично. Якщо фізична симуляція вимкнена, ви будете просто перетаскувати обʼєкт.");
			$('.menu-button').removeClass('active');
			$("#move").addClass("active");
			for (var i = 0; i < objects.length; i++) {
				objects[i].delete_selected = false;
			}
			break;
		case 74: // J
			mode = 5;
			$("#hint").text("Натисніть на обʼєкт, який хочете вибрати. Справа в списку відкриється меню його налаштувань.");
			$('.menu-button').removeClass('active');
			$("#select").addClass("active");
			for (var i = 0; i < objects.length; i++) {
				objects[i].delete_selected = false;
			}
			break;
		case 75: // K
			mode = 6;
			$("#hint").text("Натисніть на обʼєкт, який хочете видалити.");
			$('.menu-button').removeClass('active');
			$("#delete").addClass("active");
			for (var i = 0; i < objects.length; i++) {
				objects[i].delete_selected = false;
			}
			break;
		case 76: // L
			mode = 7;
			$("#hint").text("Натисніть на обʼєкт, який хочете скопіювати. Натисніть ще раз, щоб створити скопійований обʼєкт.");
			$('.menu-button').removeClass('active');
			$("#copy").addClass("active");
			for (var i = 0; i < objects.length; i++) {
				objects[i].delete_selected = false;
			}
			break;
	}
});

document.addEventListener('keyup', function(e) {
	switch(e.keyCode) {
		case 87: // w
			camera.moveUp = false;
			break;
		case 65: // a
			camera.moveLeft = false;
			break;
		case 83: // s
			camera.moveDown = false;
			break;
		case 68: // d
			camera.moveRight = false;
			break;
		case 16: // shift
			shiftPressed = false;
			break;
		case 17: // ctrl
			ctrlPressed = false;
			break;
	}
})

function radToDegree(rad) {
	return rad * (180/Math.PI);
}

// CREATE WORLD HERE ---->

world = createWorld(ctx);

// parse
if ($("#saveWorld").val() != "") {
	var data = JSON.parse($("#saveWorld").val());
	for (object of data) {
		if (object.type == "box") {
			objects.push(new Box(world, object.x, object.y, object.width, object.height, object.id, object.options, object.material));
			objects[objects.length-1].name = object.name;
			objects[objects.length-1].angle = object.angle;
			objects[objects.length-1].body.SetAngle(object.angle);
			obj_id = object.id;
			$("#objects_list").append(`<a href="#" id="${obj_id}" class="list-elem">${objects[objects.length-1].name} <span>${objects[objects.length-1].id}</span></a>`);
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].id == obj_id) {
					$(`#${obj_id}`).after(addBoxToList(obj_id, objects[objects.length-1]));
				}
			}
			$(`#box-settings-${obj_id}`).hide();
			$(`#box-material-${obj_id}`).val(object.material);
			if (object.material != "none") {
				$(`#box_density-${obj_id}`).hide();
				$(`#box_friction-${obj_id}`).hide();
				$(`#box_restitution-${obj_id}`).hide();
			}
			$(`#label-box_density-${obj_id}`).text(`Щільність коробки (кг/м^2): ${objects[objects.length-1].options.density}`);
			$(`#label-box_friction-${obj_id}`).text(`Тертя коробки: ${objects[objects.length-1].options.friction}`);
			$(`#label-box_restitution-${obj_id}`).text(`Пружність коробки: ${objects[objects.length-1].options.restitution}`);
			$(`#box_mass-value-${obj_id}`).text(objects[objects.length-1].body.GetMass());
		}

		if (object.type == "circle") {
			objects.push(new Circle(world, object.x, object.y, object.radius, object.id, object.options, object.material));
			objects[objects.length-1].name = object.name;
			objects[objects.length-1].body.SetAngle(object.angle);
			obj_id = object.id;
			$("#objects_list").append(`<a href="#" id="${obj_id}" class="list-elem">${objects[objects.length-1].name} <span>${objects[objects.length-1].id}</span></a>`);
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].id == obj_id) {
					$(`#${obj_id}`).after(addCircleToList(obj_id, objects[objects.length-1]));
				}
			}
			$(`#circle-settings-${obj_id}`).hide();
			$(`#circle-material-${obj_id}`).val(object.material);
			if (object.material != "none") {
				$(`#circle_density-${obj_id}`).hide();
				$(`#circle_friction-${obj_id}`).hide();
				$(`#circle_restitution-${obj_id}`).hide();
			}
			$(`#label-circle_density-${obj_id}`).text(`Щільність круга (кг/м^2): ${objects[objects.length-1].options.density}`);
			$(`#label-circle_friction-${obj_id}`).text(`Тертя круга: ${objects[objects.length-1].options.friction}`);
			$(`#label-circle_restitution-${obj_id}`).text(`Пружність круга: ${objects[objects.length-1].options.restitution}`)
			$(`#circle_mass-value-${obj_id}`).text(objects[objects.length-1].body.GetMass());
		}
		if (object.type == "joint") {
			objects.push(new Joint(world, object.x, object.y, findObjectById(object.bodyA)[0].body, findObjectById(object.bodyB)[0].body, object.lowerAngle, object.upperAngle, object.enableLimit, object.id));
			objects[objects.length-1].name = object.name;
			objects[objects.length-1].bodyA_id = object.bodyA;
			objects[objects.length-1].bodyB_id = object.bodyB;
			objects[objects.length-1].name = object.name;
			obj_id = object.id;
			$("#objects_list").append(`<a href="#" id="${obj_id}" class="list-elem">${objects[objects.length-1].name} <span>${objects[objects.length-1].id}</span></a>`);
			for (var i = 0; i < objects.length; i++) {
				if (objects[i].id == obj_id) {
					$(`#${obj_id}`).after(addJointToList(obj_id, objects[objects.length-1]));
				}
			}
			$(`#joint-settings-${obj_id}`).hide();
			if (object.enableLimit) {
				var degrees = Math.round(Math.abs(radToDegree(object.lowerAngle)));
				$(`#joint-settings-${obj_id} > #joint-limit-${obj_id}`).val(degrees);	
			} else {
				$(`#joint-settings-${obj_id} > #joint-limit-${obj_id}`).val("false");	
			}
		}
	}
	obj_id ++;
} else {
	objects.push(new Box(world, (canvas_width/2)/SCALE, 1020/SCALE, canvas_width/SCALE/2 + 20, 600/SCALE/2, obj_id, {type: box2d.b2Body.b2_staticBody}));

	objects[0].name = "Платформа";
	$("#objects_list").append(`<a href="#" id="${obj_id}" class="list-elem">${objects[objects.length-1].name} <span>${objects[objects.length-1].id}</span></a>`);
	for (var i = 0; i < objects.length; i++) {
		if (objects[i].id == obj_id) {
			$(`#${obj_id}`).after(addBoxToList(obj_id, objects[i]));
		}
	}
	$(`#box-settings-${obj_id}`).hide();
	obj_id ++;
}

$("#see_object_list").text(`Список об'єктів (${objects.length}) ↑`);

setInterval(step, 1000/fps);