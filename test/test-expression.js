/*globals suite, test, setup, teardown */

var Dice        = require("dice-js"),
    should      = require("should"),
    dutil       = Dice.util,
    Expression  = Dice.Expression,
    faces       = [4, 6, 8, 10, 12, 20, 100]
;

suite("Expression", function () {
    
    test("Basic Addition Expression", function () {
        var values = [1, 2, 3, 4, 5, 6, 7, 8],
            exp = new Expression()
        ;
        
        values.forEach(function (val) {
            exp["+"](val);
        });
        
        exp.valueOf().should.equal(values.reduce(dutil.reduceSum, 0));
    });
    
    test("Addition Expression with Dice", function () {
        var exp = new Expression(),
            dice = faces.map(function (faces) {
                var die = new Dice(faces);
                exp["+"](die);
                return die;
            }),
            expected,
            actual
        ;
        
        actual = exp.valueOf();
        expected = dice.reduce(dutil.reduceSum, 0);
        
        actual.should.equal(expected);
    });
    
    test("Addition Expression with Object Return Value", function () {
        var exp = new Expression(),
            dice = [
                new Dice.FfgStarWarsAbility(),
                new Dice.FfgStarWarsAbility(),
                new Dice.FfgStarWarsProficiency(),
                new Dice.FfgStarWarsDifficulty(),
                new Dice.FfgStarWarsChallenge(),
                new Dice.FfgStarWarsBoost(),
                new Dice.FfgStarWarsSetback(),
                new Dice.FfgStarWarsForce(4)
            ],
            expected,
            actual
        ;
        
        dice.forEach(function (die) {
            exp["+"](die);
        });
        
        actual = exp.valueOf();
        expected = dice.reduce(function (acc, die) {
            var result = die.result;
            Object.keys(result).forEach(function (key) {
                acc[key] += result[key];
            });
            return acc;
        }, {
            success: 0,
            failure: 0,
            advantage: 0,
            threat: 0,
            triumph: 0,
            despair: 0,
            lightside: 0,
            darkside: 0
        });
        
        Object.keys(expected).forEach(function (key) {
            actual[key].should.equal(expected[key]);
        });
        
        console.log(actual);
    });
});