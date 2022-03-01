class Astar {

	/*

	-If a coordinate not exists in map, is empty.
	-Possible values:
		+.0: start point.
		+.1: end point.
		+.2: obstacle.

	*/

	constructor(maxX, maxY) {
		this.maxX = maxX;
		this.maxY = maxY;
		this.map = new Map();
	}

	_getKeyFromPoint(point) {
		return point.x * this.maxX + point.y;
	}

	_getPointFromKey(key) {
		return {x: parseInt(key / this.maxX), y: key % this.maxX};
	}

	setStartPoint(x, y) {
		const point = {x: x, y: y};
		this.map.set(this._getKeyFromPoint(point), 0);
		this.startPoint = point;
	}


	setEndPoint(x, y) {
		const point = {x: x, y: y};
		this.map.set(this._getKeyFromPoint(point), 1);
		this.endPoint = point;
	}


	setObstacle(x, y) {
		const point = {x: x, y: y};
		this.map.set(this._getKeyFromPoint(point), 2);
	}

	_drawRoad(node) {
		while (node) {
			console.log(node.key);
			node = node.parent;
		}
	}

	_f(node) {
		return node.g + node.h;
	}

	_pita(node) {
		const a = this.endPoint.x - node.x;
		const b = this.endPoint.y - node.y;

		return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	}

	calculate() {
		const closed = new Set();
		let open = new Array();

		open.push({key: this._getKeyFromPoint(this.startPoint), g: 0, h: this._pita(this.startPoint), parent: undefined});

		let endPoitnFound = false;
		let actual;
		let sol;

		do {
			actual = open.shift();
			closed.add(actual.key);
			for (var iX = -1; iX <= 1; iX++) {
				for (var iY = -1; iY <= 1; iY++) {
					const point = this._getPointFromKey(actual.key);
					point.x += iX;
					point.y += iY;
					const key = this._getKeyFromPoint(point);
					const g = iX == 0 || iY == 0 ? 1 : Math.sqrt(2);

					if (point.x >= 0 &&
						point.x < this.maxX &&
						point.y >= 0 &&
						point.y < this.maxY &&
						(!this.map.has(key) || this.map.get(key) !== 2)) {

						//Just make something if is not in the closed list
						if (!closed.has(key)) {
							const index = open.findIndex(n => n.key === key);
							
							if (index === -1) {
								if (key !== this._getKeyFromPoint(this.endPoint)) {
									open.push({key: key, g: actual.g + g, h: this._pita(point), parent: actual});
								} else {
									endPoitnFound = true;
									sol = {key: key, g: actual.g + g, parent: actual};
								}
								// In this version, not need update
							} else {
								// In this version, nothing
							}
						}
					}
				}
			}
			open = open.sort((a, b) => this._f(a) - this._f(b));
		} while(!endPoitnFound);

		
		while (sol) {
			if (!this.map.has(sol.key)) {
				this.map.set(sol.key, 3);
			}
			sol = sol.parent;
		}
	}

	draw() {
		// ### DEBUG ONLY ###
		console.log('Start point: ' + JSON.stringify(this.startPoint));
		console.log('End point: ' + JSON.stringify(this.endPoint));

		let line = ' |';
		for (var y = 0; y < this.maxY; y++) {
			line += ' ' + y + ' |';
		}
		console.log(line);
		for (var x = 0; x < this.maxX; x++) {
			line = x + '|';
			for (var y = 0; y < this.maxY; y++) {
				const key = this._getKeyFromPoint({x: x, y: y});
				if (this.map.has(key)) {
					switch (this.map.get(key)) {
						case 0:
							line += ' I |';
							break;

						case 1:
							line += ' F |';
							break;

						case 2:
							line += ' # |';
							break;

						case 3:
							line += ' . |';
							break;
					}
				} else {
					line += '   |';
				}
			}
			console.log(line);
		}
	}
}

const a = new Astar(10, 10);

a.setStartPoint(0, 0);
a.setEndPoint(9, 9);

a.setObstacle(1, 0);
a.setObstacle(1, 1);
a.setObstacle(1, 2);
a.setObstacle(1, 3);
a.setObstacle(1, 4);
a.setObstacle(1, 5);
a.setObstacle(1, 6);
a.setObstacle(1, 7);
a.setObstacle(1, 8);

a.setObstacle(3, 1);
a.setObstacle(3, 2);
a.setObstacle(3, 3);
a.setObstacle(3, 4);
a.setObstacle(3, 5);
a.setObstacle(3, 6);
a.setObstacle(3, 7);
a.setObstacle(3, 8);
a.setObstacle(3, 9);

a.setObstacle(5, 0);
a.setObstacle(5, 1);
a.setObstacle(5, 2);
a.setObstacle(5, 3);
a.setObstacle(5, 4);
a.setObstacle(5, 5);
a.setObstacle(5, 6);
a.setObstacle(5, 7);
a.setObstacle(5, 8);

a.setObstacle(7, 1);
a.setObstacle(7, 2);
a.setObstacle(7, 3);
a.setObstacle(7, 4);
a.setObstacle(7, 5);
a.setObstacle(7, 6);
a.setObstacle(7, 7);
a.setObstacle(7, 8);
a.setObstacle(7, 9);

a.calculate();
a.draw();