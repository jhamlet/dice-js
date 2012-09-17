/*globals suite, test, setup, teardown */

var Dice        = require("dice-js"),
    Behaviors   = Dice.Behaviors,
    should      = require("should"),
    tries       = 1000
;

suite("Behaviors - Common", function () {
    
    test("ResultModifier", function () {
        Array(tries).join("-").split("-").forEach(function () {
            var dice = new Dice(3, 6, ["ResultModifier", 2]);
            dice.roll();
            dice.result.should.be.within(5, 20);
        });
    });
});