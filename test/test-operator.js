/*globals suite, test, setup, teardown */

var Dice       = require("dice-js"),
    Operator   = Dice.Operator,
    Expression = Dice.Expression,
    should     = require("should")
;

suite("Operator", function () {
    
    test("Very basic addition", function () {
        var op          = new Dice.Operator("+", 8, 5),
            PlusOp      = Dice.Operator.Addition,
            Ability     = Dice.FfgStarWarsAbility,
            Proficiency = Dice.FfgStarWarsProficiency,
            Difficulty  = Dice.FfgStarWarsDifficulty,
            Challenge   = Dice.FfgStarWarsChallenge,
            Boost       = Dice.FfgStarWarsBoost,
            Setback     = Dice.FfgStarWarsSetback,
            Force       = Dice.FfgStarWarsForce
        ;
        // op.valueOf().should.equal(13);
        
        op = new Dice.Operator.Addition(new Dice(3, 6), 12);
        op.valueOf().should.be.within(15, 30);
        console.log(op.valueOf());
        
        op = new Dice.Operator["+"](new Dice(8, 6), new Dice(8, 6));
        op.valueOf().should.be.within(16, 96);
        // console.log(op.valueOf());
        
        op = new PlusOp(Force(4), new PlusOp(Force(1), Setback(1)));
        console.log(op.valueOf());
        
        op = new PlusOp(
            Ability(2),
            new PlusOp(
                Proficiency(1),
                new PlusOp(
                    Difficulty(1),
                    new PlusOp(
                        Challenge(1),
                        new PlusOp(
                            Boost(1),
                            Setback(1)
                        )
                    )
                )
            )
        );
        console.log(op.valueOf());
        
        op = new PlusOp(
            new Expression(new Dice(3, 6), new Dice(3, 6), new Dice(3, 6)),
            new Expression(new Dice(2, 8), new Dice(2, 8), new Dice(2, 8))
        );
        console.log(op.valueOf());
    });
    
});