/*globals suite, test, setup, teardown */

var Dice        = require("dice-js"),
    Expression  = Dice.Expression,
    should      = require("should")
;

suite("Expression", function () {
    
    test("working", function () {
        var exp = new Expression();
        
        exp.add(new Dice.FfgStarWarsAbilityDice(2));
        exp.add(new Dice.FfgStarWarsProficiencyDice(2));
        exp.add(new Dice.FfgStarWarsDifficultyDice(1));
        exp.add(new Dice.FfgStarWarsChallengeDice(1));
        exp.add(new Dice.FfgStarWarsBoostDice(1));
        exp.add(new Dice.FfgStarWarsSetbackDice(1));
        exp.add(new Dice.FfgStarWarsForceDice(4));

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