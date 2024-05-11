class Camera {
	constructor(x, y, zoom, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.zoom = zoom

		this.moveLeft = false;
		this.moveRight = false;
		this.moveUp = false;
		this.moveDown = false;
	}
	update() {
		if (this.moveLeft) {
			this.x -= this.speed;
		}
		if (this.moveRight) {
			this.x += this.speed;
		}
		if (this.moveDown) {
			this.y -= this.speed;
		}
		if (this.moveUp) {
			this.y += this.speed;
		}
	}
	scale(event) {
		if (this.zoom < 50 && event.deltaY < 0) {
			this.zoom -= event.deltaY/80;
		}
		if (this.zoom > -90 && event.deltaY > 0) {
			this.zoom -= event.deltaY/80;
		}
	}
}