function addJointToList(obj_id, object) {
	return `
		<div class="object_settings joint_settings" id="joint-settings-${obj_id}">
			<h2>${object.name} ${obj_id} налаштування:</h2>
										
			<label>Обмежити кут? (градуси)</label>
			<select name="limit" id="joint-limit-${obj_id}" id_my=${obj_id}>
				<option value="false">Без ліміту</option>
				<option value="0" selected="selected">Зафіксовано</option>
				<option value="15">15</option>
				<option value="30">30</option>
				<option value="45">45</option>
				<option value="60">60</option>
				<option value="90">90</option>
				<option value="180">180</option>
			</select>
			<button class="update-button joint-update-button" id="update-elem-${obj_id}" id_my = "${obj_id}">Оновити зміни</button>
			<button class="delete-button box-delete-button" id="update-elem-${obj_id}" id_my = "${obj_id}">Видалити</button>
		</div>
	`
}