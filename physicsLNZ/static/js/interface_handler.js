// for interface update
function interfaceUpdate() {
	// change modes texts
	if (mode == 1) {
		$("#mode").text("Коробка");
	}
	if (mode == 8) {
		$("#mode").text("Стіна");
	}
	if (mode == 2) {
		$("#mode").text("Круг");
	}
	if (mode == 3) {
		$("#mode").text("З'єднання");
	}
	if (mode == 4) {
		$("#mode").text("Рухати");
	}
	if (mode == 5) {
		$("#mode").text("Вибрати");
	}
	if (mode == 6) {
		$("#mode").text("Видалити");
	}
	if (mode == 7) {
		$("#mode").text("Скопіювати");
		for (var i = 0; i < objects.length; i++) {
			objects[i].over_selected = false;
		}	
	}
	// change buttons names
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

	// when rename -> update names everywhere
	$(".rename-input").on("change", function(){
		var id = $(this).attr("id_my");
		var newName = $(this).val();
		var object = findObjectById(id)[0];
		object.name = newName;
		$(`#${id}`).text(newName);
	});
	// updating gravity on change in input
	$("#world_gravity").on("change", function(){
		var grav = parseFloat($(this).val());
		updateGravity(grav);
	});
	// when selecting material -> change interface
	$(".box_settings > select").on("change", function(){
		var id = $(this).attr("id_my");
		var material = $(this).val()

		var updateOptions = updateBox(id);

		if (updateOptions[3] == "none"){
			$(`#box_density-${id}`).show();
			$(`#box_friction-${id}`).show();
			$(`#box_restitution-${id}`).show();
			$(`#label-box_density-${id}`).text(`Щільність коробки (кг/м^2):`);
			$(`#label-box_friction-${id}`).text(`Тертя коробки:`);
			$(`#label-box_restitution-${id}`).text(`Пружність коробки:`)
			$(`.box-update-button`).show();
		} else {
			$(`#box_density-${id}`).hide();
			$(`#box_friction-${id}`).hide();
			$(`#box_restitution-${id}`).hide();
			$(`#label-box_density-${id}`).text(`Щільність коробки (кг/м^2): ${updateOptions[0]}`);
			$(`#label-box_friction-${id}`).text(`Тертя коробки: ${updateOptions[1]}`);
			$(`#label-box_restitution-${id}`).text(`Пружність коробки: ${updateOptions[2]}`)
		}

		$(`#box_mass-value-${id}`).text(updateOptions[4]);
	});
	$(".circle_settings > select").on("change", function(){
		var id = $(this).attr("id_my");
		var material = $(this).val()
		

		var updateOptions = updateCircle(id);

		if (updateOptions[3] == "none"){
			$(`#circle_density-${id}`).show();
			$(`#circle_friction-${id}`).show();
			$(`#circle_restitution-${id}`).show();
			$(`#label-circle_density-${id}`).text(`Щільність круга (кг/м^2):`);
			$(`#label-circle_friction-${id}`).text(`Тертя круга:`);
			$(`#label-circle_restitution-${id}`).text(`Пружність круга:`)
			$(`.circle-update-button`).show();
		} else {
			$(`#circle_density-${id}`).hide();
			$(`#circle_friction-${id}`).hide();
			$(`#circle_restitution-${id}`).hide();
			$(`#label-circle_density-${id}`).text(`Щільність круга (кг/м^2): ${updateOptions[0]}`);
			$(`#label-circle_friction-${id}`).text(`Тертя круга: ${updateOptions[1]}`);
			$(`#label-circle_restitution-${id}`).text(`Пружність круга: ${updateOptions[2]}`)
		}
		$(`#circle_mass-value-${id}`).text(updateOptions[4]);
	});
}

$("#create_box").click(function(e) {
	mode = 1;
	$("#hint").text("Затисніть і потягніть щоб створити коробку. Затисніть control (ctrl) щоб створити ідеальний квадрат.");
	$('.menu-button').removeClass('active');
	$(this).addClass("active");
});

$("#create_circle").click(function(e) {
	mode = 2;
	$("#hint").text("Натисніть щоб створити круг. Прокрутіть колесо миші для зміни радіуса кола.");
	$('.menu-button').removeClass('active');
	$(this).addClass("active");
});

$("#create_wall").click(function(e) {
	mode = 8;
	$("#hint").text("Затисніть і потягніть щоб створити не фізичну коробку. Затисніть control (ctrl) щоб створити ідеальний квадрат.");
	$('.menu-button').removeClass('active');
	$(this).addClass("active");
});

$("#create_joint").click(function(e) {
	mode = 3;
	$("#hint").text("Виберіть по порядку обʼєкти які ви хочете скріпити. Після цього поставьте точку зʼєднання в потрібному місці. Навколо неї обʼєкти будуть рухатися.");
	$('.menu-button').removeClass('active');
	$(this).addClass("active");
	for (var i = 0; i < objects.length; i++) {
		objects[i].selected = false;
		objects[i].over_selected = false;
	}
});

$("#move").click(function(e) {
	mode = 4;
	$("#hint").text("Наведіть та затисніть ліву кнопку миші. Після цього ви можете перетаскувти обʼєкт фізично. Якщо фізична симуляція вимкнена, ви будете просто перетаскувати обʼєкт.");
	$('.menu-button').removeClass('active');
	$(this).addClass("active");
});

$("#select").click(function(e) {
	mode = 5;
	$("#hint").text("Натисніть на обʼєкт, який хочете вибрати. Справа в списку відкриється меню його налаштувань.");
	$('.menu-button').removeClass('active');
	$(this).addClass("active");
});

$("#delete").click(function(e) {
	mode = 6;
	$("#hint").text("Натисніть на обʼєкт, який хочете видалити.");
	$('.menu-button').removeClass('active');
	$(this).addClass("active");
});

$("#copy").click(function(e) {
	mode = 7;
	$("#hint").text("Натисніть на обʼєкт, який хочете скопіювати. Натисніть ще раз, щоб створити скопійований обʼєкт.");
	$('.menu-button').removeClass('active');
	$(this).addClass("active");
});


$("#see_object_list").click(function(e) {
	if ($("#objects_list").css("display") == "none"){
		$(this).text(`Список об'єктів (${objects.length}) ↑`)
		$("#objects_list").show()
	} else {
		$(this).text(`Список об'єкті (${objects.length}) ↓`)
		$("#objects_list").hide()
	}
})

$("#objects_list").on("click", ".list-elem", function(e) {
	var id = $(this).attr("id");
	for (var i = 0; i < objects.length; i++) {
		$(`.${objects[i].type}_settings`).hide();
		objects[i].over_selected = false;
	}
	var object = findObjectById(id)[0];
	$(".object_settings").hide();
	if ($(`#${object.type}-settings-${id}`).css("display") == "none"){
		$(`#${object.type}-settings-${id}`).show();
		object.over_selected = true;
	}
});

$("#gravity").click(function(){
	if(gravityOn) {
		updateGravity(0);

	} else {
		if (gravityStrength != 0){
			updateGravity(gravityStrength);	
		} else {
			updateGravity(standartEarthGravity);	
		}
		$("#world_gravity").val(gravityStrength);
	}
});

$("#physics").click(function(){
	if(physicsOn) {
		physicsOn = false;
	} else {
		physicsOn = true;		
	}
});


$("#objects_list").on("click", ".box-update-button", function(e) {
	var id = $(this).attr("id_my");
	var updateOptions = updateBox(id);
	$(`#box_density-${id}`).val(updateOptions[0]);
	$(`#box_friction-${id}`).val(updateOptions[1]);
	$(`#box_restitution-${id}`).val(updateOptions[2]);
	$(`#box_mass-value-${id}`).text(updateOptions[4]);
});

$("#objects_list").on("click", ".circle-update-button", function(e) {
	var id = $(this).attr("id_my");
	var updateOptions = updateCircle(id);
	$(`#circle_density-${id}`).val(updateOptions[0]);
	$(`#circle_friction-${id}`).val(updateOptions[1]);
	$(`#circle_restitution-${id}`).val(updateOptions[2]);
	$(`#circle_mass-value-${id}`).text(updateOptions[4]);
});

$("#objects_list").on("click", ".joint-update-button", function(e) {
	var id = $(this).attr("id_my");
	var object = findObjectById(id)[0];
	var limit = $(`#joint-limit-${id}`).val();
	object.change(limit);
	$(`#joint-settings-${id}`).hide();
});

$("#objects_list").on("click", ".delete-button", function(e) {
	var id = $(this).attr("id_my");
	var object = findObjectById(id);
	deleteObject(object[0], object[1], object[0].type)  
});

setInterval(interfaceUpdate, 50);

$("#delete_project").click(function() {
	$(".are-you-sure").css('display', "block");
	$(this).css('display', 'none');
})

$("#no_delete").click(function() {
	$(".are-you-sure").css('display', "none");
	$("#delete_project").css('display', 'block');
})

function save() {
	var save_objects_list = [];
	for (object of objects) {
		if(object.type == "box") {
			save_objects_list.push({x: object.body.GetPosition().x, y: object.body.GetPosition().y, width: object.width, height: object.height, id: object.id, options: object.options, material: object.material, name: object.name, type: object.type, angle: object.angle});
		}

		if(object.type == "circle") {
			save_objects_list.push({x: object.body.GetPosition().x, y: object.body.GetPosition().y, radius: object.radius, id: object.id, options: object.options, material: object.material, name: object.name, type: object.type, angle: object.angle});
		}

		if(object.type == "joint") {
			save_objects_list.push({x: object.joint.GetAnchorA().x, y: object.joint.GetAnchorA().y, bodyA: object.bodyA_id, bodyB: object.bodyB_id, lowerAngle: object.jointDef.lowerAngle, upperAngle: object.jointDef.upperAngle, enableLimit: object.jointDef.enableLimit, type: object.type, name: object.name, id: object.id });
		}
	}	
	$("#saveWorld").val(JSON.stringify(save_objects_list));
	$("#saveWorldSettings").val(JSON.stringify(
		{
			standartEarthGravity,
			gravityStrength,
			gravityOn,
			physicsOn,
			cameraInfo: camera,
	}));
	$("#preview").val($("#canvas")[0].toDataURL("image/jpeg"))
}

$("#project-settings").click(function() {
	$("#project-settings-modal").css("display", "block");
});

$("#close-settings").click(function() {
	$("#project-settings-modal").css("display", "none");
});

$("#base-learning").click(function() {
	$("#base-learning-modal").css("display", "block");
});

$("#close-base-learning").click(function() {
	$("#base-learning-modal").css("display", "none");
});


$(".modal").draggable({ containment: "window" });