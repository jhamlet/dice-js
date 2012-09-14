
var Dice    = require("dice-js/dice"),
    count   = 10,
    tries   = 1000,
    dice    = [2, 4, 6, 8, 10, 12, 20, 100],
    format  = require("util").format
;

suite("Dice", function () {

    dice.forEach(function (sides) {
        test(
            format("d%s die sides correctly set when ommitting first argument", sides),
            function () {
                var dice = new Dice(sides);
                dice.sides.should.equal(sides);
            }
        );

        test(
            format("d%s#rolled correctly set", sides),
            function () {
                var dice = new Dice(sides);
                dice.rolled.should.equal(false);
                dice.roll();
                dice.rolled.should.equal(true);
                dice.reset();
                dice.rolled.should.equal(false);
            }
        );
        
        test("Correct #toString output", function () {
            var dice = new Dice(sides);
            // #join sets the appropriate hinting mechanism to "string"
            [dice].join().should.equal(format("[d%s]", sides));
            dice.roll();
            (dice + "").should.be.within(0, sides);
            [dice].join().should.match(/^\[d\d+ \(\d+\) = \d+\]$/);
        });
        
        Array(count).join("-").split("-").forEach(function (nil, idx) {
            var num = idx + 1,
                min = num,
                max = min * sides
            ;
            
            test(
                format("%sd%s rolled %s times all fall within %s and %s", num, sides, tries, min, max),
                function () {
                    Array(tries).join("-").split("-").forEach(function () {
                        var dice = new Dice(num, sides);
                        dice.roll().result.should.be.within(num, num * sides);
                    });
                }
            );
        });
    });
    
});
