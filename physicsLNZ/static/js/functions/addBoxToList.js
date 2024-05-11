function addBoxToList(obj_id, object) {
	if (object.options.type == box2d.b2Body.b2_dynamicBody) {
		return `
		<div class="object_settings box_settings" id="box-settings-${obj_id}">
			<h2><input class="rename-input box-rename-input" id_my="${obj_id}" placeholder="Введіть ім'я об'єкта" value="${object.name} ${obj_id}"/> налаштування:</h2>
			<hr>
			<label>Виберіть матеріал:</label>
			<select name="material" id="box-material-${obj_id}" id_my=${obj_id}>
				<option value="none">Свій</option>
				<option value="iron">Залізо</option>
				<option value="paper">Папір</option>
				<option value="tree">Дерево</option>
				<option value="glass">Скло</option>
			</select>
			<label id="label-box_mass-${obj_id}">Маса коробки (кг) <span style="color:orange; font-weight:bold;" id="box_mass-value-${obj_id}">${object.body.GetMass()}</span></label>
			<br>
			<label id="label-box_density-${obj_id}">Щільність коробки (кг/м^2)</label>
			<br>
			<input type="number min="0" step="0.01" id_my="${obj_id}" id="box_density-${obj_id}" placeholder="Щільність" value="${object.options.density}">
			<label id="label-box_friction-${obj_id}">Тертя коробки</label>
			<br>
			<input type="number" min="0" step="0.01" id_my="${obj_id}" id="box_friction-${obj_id}" placeholder="Тертя" value="${object.options.friction}">
			<label id="label-box_restitution-${obj_id}">Пружність коробки</label>
			<br>
			<input type="number" min="0" step="0.01" id_my="${obj_id}" id="box_restitution-${obj_id}" placeholder="Пружність" value="${object.options.restitution}">
			<button class="update-button box-update-button" id="update-elem-${obj_id}" id_my = "${obj_id}">Оновити зміни</button>
			<button class="delete-button box-delete-button" id="update-elem-${obj_id}" id_my = "${obj_id}">Видалити</button>
		</div>
		`;
	} else if (object.options.type == box2d.b2Body.b2_staticBody) {
		return `
		<div class="object_settings box_settings" id="box-settings-${obj_id}">
			<h2><input class="rename-input box-rename-input" id_my="${obj_id}" placeholder="Введіть ім'я об'єкта" value="${object.name} ${obj_id}"/> налаштування:</h2>
			<label>Ширина коробки (м)</label>
			<input type="number" step="0.01" id="box_width-${obj_id}" placeholder="Довжина" value="${object.width*SCALE}">
			<label>Висота коробки (м)</label>
			<input type="number" step="0.01" id="box_height-${obj_id}" placeholder="Висота" value="${object.height*SCALE}">
			<button class="update-button box-update-button" id="update-elem-${obj_id}" id_my = "${obj_id}">Оновити зміни</button>
			<button class="delete-button box-delete-button" id="update-elem-${obj_id}" id_my = "${obj_id}">Видалити</button>
		</div>
		`;		
	}

}