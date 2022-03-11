const {Astar} = require("./Astar");

const a = new Astar(10, 10, 1);

a.addPoint(0, 0);
a.addPoint(0, 9);

//a.setRiskyPoint(0, 5, 100);

a.calculate();
console.log(a.getPaths());
a.reset();


a.addPoint(9, 9);
a.addPoint(9, 0);
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
                line += ' X |';
                break;

            case 4:
                line += ' R |';
                break;

            default:
                line += '   |';
                break;
        }
    }
    console.log(line);
}
