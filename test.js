const {Astar} = require("./Astar");

const a = new Astar(10, 10, 1);

a.addPoint(0, 0);
a.addPoint(1, 9);
a.addPoint(9, 9);

a.setObstacle(0, 1);
a.setObstacle(1, 1);
a.setObstacle(1, 0);

//a.setRiskyPoint(0, 5, 100);

a.calculate();

console.log(a.getPaths());


// ### CONSOLE PRINT ###
let line = ' |';
let y;
for (y = 0; y < a.getMaxY(); y++) {
    line += ' ' + y + ' |';
}
console.log(line);
for (let x = 0; x < a.getMaxX(); x++) {
    line = x + '|';
    for (y = 0; y < a.getMaxY(); y++) {
        const point = a.getInPoint({x: x, y: y});
        switch (point) {
            case Astar.START_POINT:
                line += ' I |';
                break;

            case Astar.END_POINT:
                line += ' F |';
                break;

            case Astar.OBSTACLE:
                line += ' # |';
                break;

            case Astar.INACCESSIBLE:
                line += ' X |';
                break;

            case Astar.RISKY:
                line += ' R |';
                break;

            default:
                line += '   |';
                break;
        }
    }
    console.log(line);
}
