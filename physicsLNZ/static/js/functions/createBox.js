function createBox(world, x, y, width, height, options) {
	options = $.extend(true, {
		density: 1.0,
		friction : 1.0,
		restitution: 0.5,

		linearDamping: 0.0,
		angularDamping: 0.0,

		type: box2d.b2Body.b2_dynamicBody,

		fixedRotation: false,
	}, options);

	var bodyDef = new box2d.b2BodyDef();
	var fixDef = new box2d.b2FixtureDef();

	fixDef.density = options.density;
	fixDef.friction = options.friction;
	fixDef.restitution = options.restitution;

	fixDef.shape = new box2d.b2PolygonShape();
	fixDef.shape.SetAsBox(width, height);

	bodyDef.position.Set(x, y);

	bodyDef.linearDamping = options.linearDamping;
	bodyDef.angularDamping = options.angularDamping;

	bodyDef.type = options.type;
	bodyDef.userDara = options.user_data;
	bodyDef.fixedRotation = options.fixedRotation;

	var b = world.CreateBody(bodyDef);
	var f = b.CreateFixture(fixDef);

	return b;
};