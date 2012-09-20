/*globals suite, test, setup, teardown */

var Dice = require("dice-js"),
    tries = 5000,
    format = require("util").format,
    faces = [4, 6, 8, 10, 12, 20, 100]
;

function repeat (fn, times) {
    Array(times).join("-").split("-").forEach(fn);
}

suite("Exploding Dice", function () {
    
    faces.forEach(function (faces) {
        var fnName = format("ExplodingD%s", faces);
        
        test(
            format("%s rolled %s times", fnName, tries),
            function () {
                repeat(function () {
                    var dice = new Dice[fnName](),
                        result = dice.result,
                        count = 0;
                    ;

                    result.should.not.equal(faces);
                    
                    if (result > faces) {
                        dice.results.forEach(function (result) {
                            count += result === faces ? 1 : 0;
                        });
                        (dice.exploded.length).should.equal(count);
                    }
                }, tries);
            }
        );
    });
    
});

    