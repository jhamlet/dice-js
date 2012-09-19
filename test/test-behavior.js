/*globals suite, test, setup, teardown */

var Dice        = require("dice-js"),
    Behavior    = Dice.Behavior,
    should      = require("should")
;

suite("Behavior", function () {
    
    test("Basic Filter", function () {
        var simpleFilter, dice;
        
        simpleFilter = new Behavior("SimpleFilter", {
            results: function (dice, value) {
                return value.map(function (result) {
                    return result > 3;
                });
            }
        });
        
        Behavior.get("SimpleFilter").should.equal(simpleFilter);
        
        dice = new Dice(3, 6);
        simpleFilter.attach(dice);
        
        dice.results.forEach(function (result) {
            result.should.be.a("boolean");
        });
    });
    
});