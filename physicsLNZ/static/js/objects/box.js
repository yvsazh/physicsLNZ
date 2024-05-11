class Box {
	constructor(world, x, y, width, height, id, options, material) {
		this.world = world;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.loaded = false;
		this.selected = false;
		this.name = "Коробка"
		this.type = "box";
		this.id = id
		this.over_selected = false;
		this.delete_selected = false;
		this.material = material;
		this.angle = 0;

		this.fillColor = "#ffffff"

		this.options = $.extend(true, {
			density: 1.0,
			friction : 1.0,
			restitution: 0.5,

			linearDamping: 0.0,
			angularDamping: 0.0,

			type: box2d.b2Body.b2_dynamicBody,

			fixedRotation: false,
		}, options);

		if (this.options.type == box2d.b2Body.b2_dynamicBody) {
			this.name = "Коробка"
		}
		if (this.options.type == box2d.b2Body.b2_staticBody) {
			this.name = "Стіна"
		}

		this.body = createBox(world, this.x, this.y, this.width, this.height, this.options);
	}
	changeCoords(newX, newY) {
		this.x = newX;
		this.y = newY;

		this.body.SetPosition(new box2d.b2Vec2(this.x/SCALE, this.y/SCALE))
	}
	draw(context) {
		if (!this.body) {
			return false;
		}

		var bodyPos = this.body.GetPosition();
		var bodyAngle = this.body.GetAngle();

		var width = this.width * SCALE * 2;
		var height = this.height * SCALE * 2;

		if (physicsOn) {
			this.angle = bodyAngle;
		} else {
			this.body.SetAngle(this.angle);
		}
		bodyAngle = this.angle;
		

		this.x = bodyPos.x * SCALE - (width/2);
		this.y = bodyPos.y * SCALE - (height/2);

		switch(this.material) {
			case "none":
				this.fillColor = "#ffffff";
				break;
			case "tree":
				this.fillColor = "#DEB887";
				break;
			case "iron":
				this.fillColor = "#dedcd9";
				break;
			case "glass":
				this.fillColor = "rgba(194, 245, 255, 0.4)";
				break;
			case "paper":
				this.fillColor = "#fff7bd";
				break;
		}
		context.save()
		context.translate(this.x + width / 2, this.y + height / 2);
		context.rotate(bodyAngle);
		if (this.selected || this.over_selected) {
			context.fillStyle = "#fcff77"
		} else{
			if (this.options.type != box2d.b2Body.b2_staticBody){
				context.fillStyle = this.fillColor;
			} else {
				context.fillStyle = "lightgreen"				
			}
		}

			if (this.delete_selected) {
				context.fillStyle = "#f7665e";
			} 
		context.strokeStyle = "#000000"
		context.lineWidth = 5;
		context.fillRect(-width / 2, -height / 2, width, height);
		context.strokeRect(-width / 2, -height / 2, width, height)
		context.restore();
	}
	update(event, mode, mouse_pos) {
		if (this.over_selected == false || mode == 6) {
			var pos = $("#canvas").offset();
			var mouseX = mouse_pos[0] - this.width;
			var mouseY = mouse_pos[1] - this.height;

			var bodyPos = this.body.GetPosition();

			var width = this.width * SCALE * 2;
			var height = this.height * SCALE * 2;

			var localMouseX = Math.cos(-this.body.GetAngle()) * (mouseX - bodyPos.x * SCALE) - Math.sin(-this.body.GetAngle()) * (mouseY - bodyPos.y * SCALE) + bodyPos.x * SCALE;
			var localMouseY = Math.sin(-this.body.GetAngle()) * (mouseX - bodyPos.x * SCALE) + Math.cos(-this.body.GetAngle()) * (mouseY - bodyPos.y * SCALE) + bodyPos.y * SCALE;

			this.x = bodyPos.x * SCALE - (width/2);
			this.y = bodyPos.y * SCALE - (height/2);
			
			if (mode == 3 || mode == 4 || mode == 5 || mode == 7) {
				if (localMouseX >= this.x && localMouseX <= this.x + width && localMouseY >= this.y && localMouseY <= this.y + height) {
					this.selected = true;
				} else {
					this.selected = false;
				}                   
			} 
			if (mode == 6) {
				if (localMouseX >= this.x && localMouseX <= this.x + width && localMouseY >= this.y && localMouseY <= this.y + height) {
					this.delete_selected = true;
				} else {
					this.delete_selected = false;
				}                   
			}
		}
	}
	select(event, mode) {
		this.over_selected = true;
		this.selected = false;

		return this.body;
	}
}