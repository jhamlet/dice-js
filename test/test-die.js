
var Die     = require("dice-js/die"),
    tries   = 10000,
    dice    = [2, 4, 6, 8, 10, 12, 20, 100],
    format  = require("util").format
;

suite("Die", function () {
    
    test("Bad argument to constructor throws an error", function () {
        
        ["1", NaN, undefined, {}, [], null, true, false, -1, 0, 1].forEach(function (value) {
            (function () {
                new Die(value);
            }).should.throw();
        });
    });
    
    test("Correct #toString output: '[d${sides}]'", function () {
        dice.forEach(function (sides) {
            var die = new Die(sides);
            [die].join().should.equal(format("[d%s]", sides));
        });
    });

    test("Die#sides is immutable", function () {
        dice.forEach(function (sides) {
            var die = new Die(sides);
            die.sides = sides * 2;
            die.sides.should.equal(sides);
        });
    });
    
    dice.forEach(function (sides) {
        var min = 1,
            max = sides
        ;
        
        test(
            format("d%s rolled %s times falls within %s..%s", sides, tries, min, max),
            function () {
                Array(tries).join("-").split("-").forEach(function (nil, idx) {
                    var die = new Die(sides);
                    // takes advantage of Die#valueOf method
                    die.should.be.within(min, max);
                });
            }
        );
        
    });
    
    test("Only one instance of any one type of die", function () {
        dice.forEach(function (sides) {
            var base = new Die(sides),
                i = tries,
                die
            ;
            
            while (i--) {
                die = new Die(sides);
                (base === die).should.equal(true);
            }
        });
    });

});