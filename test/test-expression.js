/*globals suite, test, setup, teardown */

var Dice        = require("dice-js"),
    Expression  = Dice.Expression,
    should      = require("should")
;

suite("Expression", function () {
    
    test("working", function () {
        var exp = new Expression();
        
        exp.add(new Dice.FfgStarWarsAbility(2));
        exp.add(new Dice.FfgStarWarsProficiency(2));
        exp.add(new Dice.FfgStarWarsDifficulty(1));
        exp.add(new Dice.FfgStarWarsChallenge(1));
        exp.add(new Dice.FfgStarWarsBoost(1));
        exp.add(new Dice.FfgStarWarsSetback(1));
        exp.add(new Dice.FfgStarWarsForce(4));

        // exp.add(new Dice(3, 6));
        // exp.add(new Dice(3, 6));
        // exp.add(new Dice(3, 6));
        // exp.add(new Dice(3, 6));
        // exp.add(new Dice(3, 6));
        // exp.add(new Dice(3, 6));

        // exp.add(new Dice(1, 4));
        // exp.add(new Dice(1, 6));
        // exp.add(new Dice(1, 8));
        // exp.add(new Dice(1, 10));
        // exp.add(new Dice(1, 12));
        // exp.add(new Dice(1, 20));

        exp.add(new Dice(1, 10));
        exp.add(new Dice(1, 10));
        
        console.log(exp.valueOf());
    });
});