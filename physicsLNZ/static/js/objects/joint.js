class Joint {
	constructor(world, x, y, bodyA, bodyB, lowerAngle, upperAngle, enableLimit, id) {
		this.x = x;
		this.y = y;
		this.world = world;
		this.bodyA = bodyA;
		this.bodyB = bodyB;
		this.bodyA_id;
		this.bodyB_id;
		this.SCALE = SCALE;
		this.name = "З'єднання";
		this.id = id;
		this.selected = false;
		this.over_selected = false;
		this.delete_selected = false;
		this.width = 8;
		this.height = 8;
		this.type = "joint";
		this.lAngle = lowerAngle;
		this.uAngle = upperAngle;
		this.enableLimit = enableLimit;

		var jointDef = new box2d.b2RevoluteJointDef();
		this.jointDef = jointDef;
		jointDef.enableLimit = this.enableLimit;
		jointDef.lowerAngle = this.lAngle;
		jointDef.upperAngle = this.uAngle;
		jointDef.Initialize(this.bodyA, this.bodyB, new box2d.b2Vec2(x, y));
		this.joint = this.world.CreateJoint(jointDef);
	}
	degToRad(degrees) {
		return degrees * (Math.PI / 180);
	}
	change(limit) {
		var jointA = this.joint.GetAnchorA();
		var x = jointA.x;
		var y = jointA.y;

		if (limit == "false") {
				this.world.DestroyJoint(this.joint);
				var jointDef = new box2d.b2RevoluteJointDef();
				this.jointDef = jointDef;
				jointDef.enableLimit = false;
				jointDef.Initialize(this.bodyA, this.bodyB, new box2d.b2Vec2(x, y));
				this.joint = this.world.CreateJoint(jointDef);
		} else {
			this.world.DestroyJoint(this.joint);
			var jointDef = new box2d.b2RevoluteJointDef();
			this.jointDef = jointDef;
			jointDef.enableLimit = true;
			jointDef.lowerAngle = this.degToRad(-limit);
			jointDef.upperAngle = this.degToRad(limit);
			jointDef.Initialize(this.bodyA, this.bodyB, new box2d.b2Vec2(x, y));
			this.joint = this.world.CreateJoint(jointDef);			
		}	
		
	}
	draw(context) {
		var jointA = this.joint.GetAnchorA();

		this.x = jointA.x * SCALE;
		this.y = jointA.y * SCALE;

		if (this.selected || this.over_selected) {
			context.fillStyle = "#fcff77"
			context.strokeStyle = "#000000"
		} else{
			context.fillStyle = "#000000"
			context.strokeStyle = "#ffffff"
		}

		if (this.delete_selected) {
			context.fillStyle = "#f7665e"
			context.strokeStyle = "#000000"
		} 
		context.lineWidth = 2;
		context.fillRect(this.x, this.y, this.width, this.height);
		context.strokeRect(this.x, this.y, this.width, this.height);
	}
	update(event, mode, mouse_pos) {
		if (this.over_selected == false || mode == 6) {
			var pos = $("#canvas").offset();
			var mouseX = mouse_pos[0];
			var mouseY = mouse_pos[1];

			var width = this.width * SCALE;
			var height = this.height * SCALE;

			var jointA = this.joint.GetAnchorA();

			this.x = jointA.x * SCALE;
			this.y = jointA.y * SCALE;

			if (mode == 3 || mode == 4 || mode == 5) {
				if ( mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height ) {
					this.selected = true;
				} else {
					this.selected = false;
				}					
			} 
			if (mode == 6) {
				if ( mouseX >= this.x && mouseX <= this.x + this.width && mouseY >= this.y && mouseY <= this.y + this.height ) {
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

		return this.joint;
	}
}