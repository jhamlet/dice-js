/*globals suite, test, setup, teardown */

var Dice        = require("dice-js"),
    Operator    = Dice.Operator,
    should      = require("should")
;

suite("Operator", function () {
    
    test("Very basic addition", function () {
        var op = new Dice.Operator("+", 8, 5);
        // op.valueOf().should.equal(13);

        op = new Dice.Operator("+", new Dice(3, 6), 12);
        op.valueOf().should.be.within(15, 30);
        console.log(op.valueOf());
        
        op = new Dice.Operator("+", new Dice(8, 6), new Dice(8, 6));
        op.valueOf().should.be.within(16, 96);
        // console.log(op.valueOf());
        
        op = new Dice.Operator("+",
            new Dice.FfgStarWarsForceDice(4),
            new Dice.FfgStarWarsForceDice(1)
        );
        console.log(op.valueOf());

        op = new Dice.Operator("+",
            new Dice.FfgStarWarsAbilityDice(2),
            new Dice.Operator("+",
                new Dice.FfgStarWarsProficiencyDice(1),
                new Dice.Operator("+",
                    new Dice.FfgStarWarsDifficultyDice(1),
                    new Dice.Operator("+",
                        new Dice.FfgStarWarsChallengeDice(1),
                        new Dice.Operator("+",
                            new Dice.FfgStarWarsBoostDice(1),
                            new Dice.FfgStarWarsSetbackDice(1)
                        )
                    )
                )
            )
        );
        console.log(op.valueOf());
    });
    
});