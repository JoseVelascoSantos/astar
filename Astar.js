'use strict'

exports.START_POINT = 0;
exports.END_POINT = 1;
exports.OBSTACLE = 2;
exports.INACCESSIBLE = 3;
exports.RISKY = 4;

exports.Astar = class Astar {
	constructor(maxX, maxY, distance) {
		this.maxX = maxX;
		this.maxY = maxY;
		this.distance = distance;
		this.map = new Map();
		this.paths = [];
		this.points = [];
		this.risks = new Map();
	}

	reset() {
		this.map = new Map();
		this.paths = [];
		this.points = [];
		this.risks = new Map();
	}

	getMaxX() {
		return this.maxX;
	}

	setMaxX(maxX) {
		this.maxX = maxX;
	}

	getMaxY() {
		return this.maxY;
	}

	setMaxY(maxY) {
		this.maxY = maxY;
	}

	_getKeyFromPoint(point) {
		return point.x * this.maxX + point.y;
	}

	_getPointFromKey(key) {
		return {x: Math.floor(key / this.maxX), y: key % this.maxX};
	}

	addPoint(x, y) {
		const point = {x: x, y: y};
		this.points.push(point);
	}

	setObstacle(x, y) {
		const point = {x: x, y: y};
		this.map.set(this._getKeyFromPoint(point), exports.OBSTACLE);
	}

	setInaccessible(x, y) {
		const point = {x: x, y: y};
		this.map.set(this._getKeyFromPoint(point), exports.INACCESSIBLE);
	}

	setRiskyPoint(x, y, risk) {
		const point = {x: x, y: y};
		this.map.set(this._getKeyFromPoint(point), exports.RISKY);
		this.risks.set(this._getKeyFromPoint(point), risk);
	}

	_f(node) {
		return node.g + node.h;
	}

	_g(node) {
		const a = (this.endPoint.x - node.x) * this.distance;
		const b = (this.endPoint.y - node.y) * this.distance;

		return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
	}

	calculate() {
		if (this.points.length > 0) {
			do {
				if (this.startPoint) {
					this.map.delete(this._getKeyFromPoint(this.startPoint));
					this.startPoint = this.endPoint;
					this.map.set(this._getKeyFromPoint(this.startPoint), exports.START_POINT);
				} else {
					this.startPoint = this.points.shift();
					this.map.set(this._getKeyFromPoint(this.startPoint), exports.START_POINT);
				}

				this.endPoint = this.points.shift();
				this.map.set(this._getKeyFromPoint(this.endPoint), exports.END_POINT);

				const closed = new Set();
				let open = [];

				open.push({
					key: this._getKeyFromPoint(this.startPoint),
					g: 0,
					h: this._g(this.startPoint),
					parent: undefined
				});

				let endPoitnFound = false;
				let openIsEmpty = false;
				let actual;
				const expand = (point, iX, iY) => {
					point.x += iX;
					point.y += iY;
					const key = this._getKeyFromPoint(point);
					const g = iX === 0 || iY === 0 ? 1 : Math.sqrt(Math.pow(this.distance, 2) + Math.pow(this.distance, 2));

					if (point.x >= 0 &&
						point.x < this.maxX &&
						point.y >= 0 &&
						point.y < this.maxY &&
						(!this.map.has(key) || (this.map.get(key) !== exports.OBSTACLE && this.map.get(key) !== exports.INACCESSIBLE))) {

						if (!closed.has(key)) {
							const index = open.findIndex(n => n.key === key);

							if (index === -1) {
								const aux = {
									key: key,
									g: actual.g + g,
									h: this._g(point),
									parent: actual
								};
								aux.f = this._f(aux);

								if (this.map.has(key) && this.map.get(key) === exports.RISKY) {
									aux.h += this.risks.get(key);
								}
								open.push(aux);
							} else if (actual.g + g < open[index].g) {
								open[index].g = actual.g + g;
								open[index].parent = actual;
							}
						}
					}
				};

				do {
					if (open.length > 0) {
						actual = open.shift();
						closed.add(actual.key);
						if (actual.key !== this._getKeyFromPoint(this.endPoint)) {
							expand(this._getPointFromKey(actual.key), -1, -1);
							expand(this._getPointFromKey(actual.key), -1, 0);
							expand(this._getPointFromKey(actual.key), -1, 1);
							expand(this._getPointFromKey(actual.key), 0, -1);
							expand(this._getPointFromKey(actual.key), 0, 1);
							expand(this._getPointFromKey(actual.key), 1, -1);
							expand(this._getPointFromKey(actual.key), 1, 0);
							expand(this._getPointFromKey(actual.key), 1, 1);
						} else endPoitnFound = true;
						open = open.sort((a, b) => this._f(a) - this._f(b));
					} else openIsEmpty = true;
				} while (!endPoitnFound && !openIsEmpty);
				const sol = [];

				while (endPoitnFound && actual) {
					sol.push(this._getPointFromKey(actual.key));
					actual = actual.parent;
				}

				this.paths.push(sol);
			} while (this.points.length > 0);
		}
	}

	getInPoint(point) {
		return this.map.get(this._getKeyFromPoint(point));
	}

	getPaths() {
		return this.paths;
	}
}
