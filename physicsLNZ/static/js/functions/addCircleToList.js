function addCircleToList(obj_id, object) {
	if (object.options.type == box2d.b2Body.b2_dynamicBody) {
		return `
		<div class="object_settings circle_settings" id="circle-settings-${obj_id}">
			<h2><input class="rename-input circle-rename-input" id_my="${obj_id}" placeholder="Введіть ім'я об'єкта" value="${object.name} ${obj_id}"/> налаштування:</h2>		
            <hr>
			<label>Виберіть матеріал:</label>
			<select name="material" id="circle-material-${obj_id}" id_my=${obj_id}>
				<option value="none">Свій</option>
				<option value="iron">Залізо</option>
				<option value="paper">Папір</option>
				<option value="tree">Дерево</option>
				<option value="glass">Скло</option>
			</select>
			<label id="label-circle_mass-${obj_id}">Маса круга (кг) <span style="color:orange; font-weight:bold;" id="circle_mass-value-${obj_id}">${object.body.GetMass()}</span></label>
			<br>
			<label id="label-circle_density-${obj_id}">Щільність круга (кг/м^2)</label>
			<br>
			<input type="number" step="0.01" min="0" id_my="${obj_id}" id="circle_density-${obj_id}" placeholder="Щільність" value="${object.options.density}">
			<label id="label-circle_friction-${obj_id}">Тертя круга</label>
			<br>
			<input type="number" step="0.01" min="0" id_my="${obj_id}" id="circle_friction-${obj_id}" placeholder="Тертя" value="${object.options.friction}">
			<label id="label-circle_restitution-${obj_id}">Пружність круга</label>
			<br>
			<input type="number" step="0.01" min="0" id_my="${obj_id}" id="circle_restitution-${obj_id}" placeholder="Пружність" value="${object.options.restitution}">
			<button class="update-button circle-update-button" id="update-elem-${obj_id}" id_my = "${obj_id}">Оновити зміни</button>
			<button class="delete-button circle-delete-button" id="update-elem-${obj_id}" id_my = "${obj_id}">Видалити</button>
		</div>
		`;
	}
}