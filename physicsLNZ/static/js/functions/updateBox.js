function updateBox(id) {
	var object = findObjectById(id)[0];
	var bodyToUpdate = object.body;

	var fixture = bodyToUpdate.GetFixtureList();
	var shape = fixture.GetShape();

	var newWidth = Number($(`#box_width-${id}`).val())/SCALE;
	var newHeight = Number($(`#box_height-${id}`).val())/SCALE;

	var newDensity, newFriction, newRestitution;

	var material = $(`#box-material-${id}`).val();

	var newCenterX = bodyToUpdate.GetPosition().x;
	var newCenterY = bodyToUpdate.GetPosition().y;
	if (material == "none"){
		newDensity = Number($(`#box_density-${id}`).val());
		newFriction = Number($(`#box_friction-${id}`).val());
		newRestitution = Number($(`#box_restitution-${id}`).val());	
		if (newDensity < 0) {
			newDensity = 0;
		}
		if (newFriction < 0) {
			newFriction = 0;
		}
		if (newRestitution < 0) {
			newRestitution = 0;
		}
	}
	if (material == "tree"){
		newDensity = 0.7;
		newFriction = 0.5;
		newRestitution = 0.3;		
	}
	if (material == "glass"){
		newDensity = 2.5;
		newFriction = 0.94;
		newRestitution = 0.6;	
	}
	if (material == "iron"){
		newDensity = 7.8;
		newFriction = 1;
		newRestitution = 0.2;	
	}
	if (material == "paper"){
		newDensity = 0.8;
		newFriction = 0.3;
		newRestitution = 0.1;
	}

	fixture.SetDensity(newDensity);
	fixture.SetFriction(newFriction);
	fixture.SetRestitution(newRestitution);
	object.options.density = newDensity;
	object.options.friction = newFriction;
	object.options.restitution = newRestitution;	

	object.material = material;
	if (object.options.type == box2d.b2Body.b2_staticBody){
		shape.SetAsBox(newWidth, newHeight);
		object.width = newWidth;
		object.height = newHeight;
	}
	bodyToUpdate.SetPosition(new box2d.b2Vec2(newCenterX, newCenterY));

	bodyToUpdate.ResetMassData();

	return [newDensity, newFriction, newRestitution, material, bodyToUpdate.GetMass()];
}