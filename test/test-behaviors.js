/*globals suite, test, setup, teardown */

var Dice        = require("dice-js"),
    Behaviors   = Dice.Behaviors,
    should      = require("should")
;

suite("Behaviors", function () {
    
    test("Basic Filter", function () {
        var simpleFilter, dice;
        
        simpleFilter = Behaviors.create("SimpleFilter", {
            results: function (dice) {
                return dice.results.map(function (result) {
                    return result > 3;
                });
            }
        });
        
        Behaviors.get("SimpleFilter").should.equal(simpleFilter);
        
        dice = new Dice(3, 6, ["SimpleFilter"]);
        should.exist(dice.__behaviorMgr__);

        dice.__behaviorMgr__.dice.should.equal(dice);
        dice.__behaviorMgr__.results.should.be.a("object");
        dice.__behaviorMgr__.__behaviors__[0].name.should.equal("SimpleFilter");
        
        dice.roll().should.equal(dice);
        
        dice.roll().results.forEach(function (result) {
            should.exist(result);
            result.should.be.a("boolean");
        });
    });
    
});