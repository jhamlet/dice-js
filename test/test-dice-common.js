/*globals suite, test, setup, teardown */

var Dice = require("dice-js"),
    repeat = require("./repeat"),
    tries = 5000,
    format = require("util").format,
    faces = [4, 6, 8, 10, 12, 20, 100]
;

suite("Dice - Common", function () {
    //-----------------------------------------------------------------------
    // Exploding
    //-----------------------------------------------------------------------
    faces.forEach(function (faces) {
        var fnName = format("ExplodingD%s", faces);
        
        test(
            format("%s rolled %s times", fnName, tries),
            function () {
                repeat(tries, function () {
                    var dice = new Dice[fnName](),
                        result = dice.result,
                        count = 0
                    ;

                    result.should.not.equal(faces);
                    
                    if (result > faces) {
                        dice.results.forEach(function (result) {
                            count += result === faces ? 1 : 0;
                        });
                        (dice.exploded.length).should.equal(count);
                    }
                });
            }
        );
    });
    //-----------------------------------------------------------------------
    // Lowest
    //-----------------------------------------------------------------------
    faces.forEach(function (faces) {
        
        test(format("5d%s keep 3 lowest results (%s times)", faces, tries), function () {
            
            repeat(tries, function () {
                var dice        = new Dice(5, faces),
                    op          = new Dice.Operator("Low", dice, 3),
                    results     = dice.results,
                    opResults   = op.valueOf(),
                    highest     = results.slice().sort(Dice.util.ascendingNumeric).slice(0, 3)
                ;

                highest.length.should.equal(3);

                highest.forEach(function (val, idx) {
                    opResults[idx].should.equal(val);
                });
            });
        });
    });
    //-----------------------------------------------------------------------
    // Highest
    //-----------------------------------------------------------------------
    faces.forEach(function (faces) {
        
        test(format("5d%s keep 3 highest results (%s times)", faces, tries), function () {
            
            repeat(tries, function () {
                var dice        = new Dice(5, faces),
                    op          = new Dice.Operator("High", dice, 3),
                    results     = dice.results,
                    opResults   = op.valueOf(),
                    highest     = results.slice().sort(Dice.util.descendingNumeric).slice(0, 3)
                ;

                highest.length.should.equal(3);

                highest.forEach(function (val, idx) {
                    opResults[idx].should.equal(val);
                });
            });
            
        });
    });
    //-----------------------------------------------------------------------
    // Drop
    //-----------------------------------------------------------------------
    faces.forEach(function (faces) {
        
        test(format("5d%s drop 2 low results and sum (%s times)", faces, tries), function () {
            
            repeat(tries, function () {
                var dice        = new Dice(5, faces),
                    op          = new Dice.Operator("Drop", dice, 2),
                    results     = dice.results,
                    opResults   = op.valueOf(),
                    highest     = results.slice().sort(Dice.util.descendingNumeric).slice(0, 3)
                ;

                // console.log(highest);
                highest.length.should.equal(3);
                opResults.should.equal(highest.reduce(Dice.util.reduceSum, 0));
            });
        });
    });
    //-----------------------------------------------------------------------
    // Keep
    //-----------------------------------------------------------------------
    faces.forEach(function (faces) {
        
        test(format("5d%s keep 3 high results and sum (%s times)", faces, tries), function () {
            
            repeat(tries, function () {
                var dice        = new Dice(5, faces),
                    op          = new Dice.Operator("Keep", dice, 3),
                    results     = dice.results,
                    opResults   = op.valueOf(),
                    highest     = results.slice().sort(Dice.util.descendingNumeric).slice(0, 3)
                ;

                highest.length.should.equal(3);
                opResults.should.equal(highest.reduce(Dice.util.reduceSum, 0));
            });
        });
    });
    
});

