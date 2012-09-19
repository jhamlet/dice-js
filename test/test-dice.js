/*globals suite, test, setup, teardown */

var Dice    = require("dice-js/dice"),
    count   = 20,
    tries   = 5000,
    dice    = [2, 4, 6, 8, 10, 12, 20, 100],
    format  = require("util").format
;

suite("Dice", function () {

    test("Bad arguments throw an error", function () {
        [1, -1, 0, null, true, false, "2", NaN].forEach(function (faces) {
            (function () {
                new dice(faces);
            }).should.throw();
        });
    });
    
    test("Empty arguments produces a 1d6", function () {
        var dice = new Dice();
        dice.faces.should.equal(6);
        dice.count.should.equal(1);
    }),
    
    dice.forEach(function (faces) {
        test(
            format("d%s die faces correctly set when ommitting first argument", faces),
            function () {
                var dice = new Dice(faces);
                dice.faces.should.equal(faces);
            }
        );

        test(
            format("d%s#rolled correctly set", faces),
            function () {
                var dice = new Dice(faces);
                dice.rolled.should.equal(false);
                dice.roll();
                dice.rolled.should.equal(true);
                dice.reset();
                dice.rolled.should.equal(false);
            }
        );
        
        test("Correct #toString output", function () {
            var dice = new Dice(faces);
            // #join sets the appropriate hinting mechanism to "string"
            [dice].join().should.equal(format("[d%s]", faces));
            dice.roll();
            (dice + "").should.be.within(0, faces);
            [dice].join().should.match(/^\[d\d+ \(\d+\) = \d+\]$/);
        });
        
        Array(count).join("-").split("-").forEach(function (nil, idx) {
            var num = idx + 1,
                min = num,
                max = min * faces
            ;
            
            test(
                format("%sd%s rolled %s times all fall within %s and %s", num, faces, tries, min, max),
                function () {
                    Array(tries).join("-").split("-").forEach(function () {
                        var dice = new Dice(num, faces);
                        dice.roll().result.should.be.within(num, num * faces);
                    });
                }
            );
        });
    });
    
});
