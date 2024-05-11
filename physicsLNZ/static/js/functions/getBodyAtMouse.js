function getBodyAtMouse(includeStatic) {
	mousePVec = new box2d.b2Vec2(mouseX/SCALE, mouseY/SCALE);
	var aabb = new box2d.b2AABB();
	aabb.lowerBound.Set(mouseX/SCALE - 0.001, mouseY/SCALE - 0.001);
	aabb.upperBound.Set(mouseX/SCALE + 0.001, mouseY/SCALE + 0.001);

	function getBodyCB(fixture) {
		if(fixture.GetBody().GetType() != box2d.b2Body.b2_staticBody) {
			if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
				selectedBody = fixture.GetBody();
				return false;
				}
			}
		return true;
	}

	selectedBody = null;
	world.QueryAABB(getBodyCB, aabb);
	return selectedBody;
};