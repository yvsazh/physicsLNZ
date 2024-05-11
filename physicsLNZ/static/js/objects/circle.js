class Circle {
	constructor(world, x, y, radius, id, options, material) {
		this.world = world;
		this.x = x;
		this.y = y;
        this.radius = radius;
		this.loaded = false;
		this.selected = false;
		this.name = "Круг"
		this.type = "circle";
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

		this.body = createCircle(world, this.x, this.y, this.radius, this.options);
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

		var radius = this.radius * SCALE;

		if (physicsOn) {
			this.angle = bodyAngle;
		} else {
			this.body.SetAngle(this.angle);
		}
		bodyAngle = this.angle;

		this.x = bodyPos.x * SCALE;
		this.y = bodyPos.y * SCALE;

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
        context.beginPath();
        context.arc(this.x, this.y, radius, 0, Math.PI*2)
        context.fill();
        context.stroke();
	}
	update(event, mode, mouse_pos) {
		if (this.over_selected == false || mode == 6) {
			var pos = $("#canvas").offset();
			var mouseX = mouse_pos[0];
            var mouseY = mouse_pos[1];

			var bodyPos = this.body.GetPosition();

			var radius = this.radius * SCALE * 2;

			this.x = bodyPos.x * SCALE;
			this.y = bodyPos.y * SCALE;
			
            var distance = Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2));

			if (mode == 3 || mode == 4 || mode == 5 || mode == 7) {
				if (distance <= radius/2) {
					this.selected = true;
				} else {
					this.selected = false;
				}                   
			} 
			if (mode == 6) {
				if (distance <= radius/2) {
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