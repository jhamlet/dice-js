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
            Dice.FfgStarWarsForce(4),
            Dice.FfgStarWarsForce(1)
        );
        console.log(op.valueOf());

        op = new Dice.Operator("+",
            Dice.FfgStarWarsAbility(2),
            new Dice.Operator("+",
                Dice.FfgStarWarsProficiency(1),
                new Dice.Operator("+",
                    Dice.FfgStarWarsDifficulty(1),
                    new Dice.Operator("+",
                        Dice.FfgStarWarsChallenge(1),
                        new Dice.Operator("+",
                            Dice.FfgStarWarsBoost(1),
                            Dice.FfgStarWarsSetback(1)
                        )
                    )
                )
            )
        );
        console.log(op.valueOf());
    });
    
});