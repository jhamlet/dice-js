/*globals suite, test, setup, teardown */

var Dice        = require("dice-js"),
    Expression  = Dice.Expression,
    Operator    = Expression.Operator,
    repeat      = require("./repeat"),
    inspect     = require("./inspect"),
    should      = require("should"),
    tries       = 5000,
    FACES,
    RESULTS
;

FACES = {
    Boost:       6,
    Setback:     6,
    Ability:     8,
    Difficulty:  8,
    Proficiency: 12,
    Challenge:   12,
    Force:       12
};

RESULTS = {
    Boost: [
        { success: 0, advantage: 0 },
        { success: 0, advantage: 0 },
        { success: 0, advantage: 2 },
        { success: 0, advantage: 1 },
        { success: 1, advantage: 1 },
        { success: 1, advantage: 0 }
    ],
    Setback: [
        { failure: 0, threat: 0 },
        { failure: 0, threat: 0 },
        { failure: 1, threat: 0 },
        { failure: 1, threat: 0 },
        { failure: 0, threat: 1 },
        { failure: 0, threat: 1 }
    ],
    Ability: [
        { success: 0, advantage: 0 },
        { success: 1, advantage: 0 },
        { success: 1, advantage: 0 },
        { success: 2, advantage: 0 },
        { success: 0, advantage: 1 },
        { success: 0, advantage: 1 },
        { success: 1, advantage: 1 },
        { success: 0, advantage: 2 }
    ],
    Difficulty: [
        { failure: 0, threat: 0 },
        { failure: 1, threat: 0 },
        { failure: 2, threat: 0 },
        { failure: 0, threat: 1 },
        { failure: 0, threat: 1 },
        { failure: 0, threat: 1 },
        { failure: 0, threat: 2 },
        { failure: 1, threat: 1 }
    ],
    Proficiency: [
        { success: 0, advantage: 0, triumph: 0 },
        { success: 1, advantage: 0, triumph: 0 },
        { success: 1, advantage: 0, triumph: 0 },
        { success: 2, advantage: 0, triumph: 0 },
        { success: 2, advantage: 0, triumph: 0 },
        { success: 0, advantage: 1, triumph: 0 },
        { success: 1, advantage: 1, triumph: 0 },
        { success: 1, advantage: 1, triumph: 0 },
        { success: 1, advantage: 1, triumph: 0 },
        { success: 0, advantage: 2, triumph: 0 },
        { success: 0, advantage: 2, triumph: 0 },
        { success: 0, advantage: 0, triumph: 1 }
    ],
    Challenge: [
        { failure: 0, threat: 0, despair: 0 },
        { failure: 1, threat: 0, despair: 0 },
        { failure: 1, threat: 0, despair: 0 },
        { failure: 2, threat: 0, despair: 0 },
        { failure: 2, threat: 0, despair: 0 },
        { failure: 0, threat: 1, despair: 0 },
        { failure: 0, threat: 1, despair: 0 },
        { failure: 1, threat: 1, despair: 0 },
        { failure: 1, threat: 1, despair: 0 },
        { failure: 0, threat: 2, despair: 0 },
        { failure: 0, threat: 2, despair: 0 },
        { failure: 0, threat: 0, despair: 1 }
    ],
    Force: [
        { lightside: 0, darkside: 1 },
        { lightside: 0, darkside: 1 },
        { lightside: 0, darkside: 1 },
        { lightside: 0, darkside: 1 },
        { lightside: 0, darkside: 1 },
        { lightside: 0, darkside: 1 },
        { lightside: 0, darkside: 2 },
        { lightside: 1, darkside: 0 },
        { lightside: 1, darkside: 0 },
        { lightside: 2, darkside: 0 },
        { lightside: 2, darkside: 0 },
        { lightside: 2, darkside: 0 }
    ]
};

function dieResultTest (type, faces) {
    var dice = Dice["FfgStarWars" + type](1),
        expected,
        result
    ;
    
    repeat(faces, function (nil, idx) {
        var face = idx + 1;

        expected = RESULTS[type][idx];
        
        do {
            dice.reset();
            result = dice.results[0];
        } while (result._ !== face);

        test(type + " die face " + face + " displays correct results", function () {
            Object.keys(expected).forEach(function (key) {
                result.should.have.property(key, expected[key]);
            });
        });
        
    });
    
}

suite("Dice - FFG - Star Wars", function () {
    
    Object.keys(FACES).forEach(function (key) {
        dieResultTest(key, FACES[key]);
    });
    
    test(
        "Mixed pool (2dA + 1dP + 2dD + 1dC + 1dB + 1dS + 1dF) Addition x" + tries,
        function () {
            repeat(tries, function () {
                var dice = [
                        new Dice.FfgStarWarsAbility(2),
                        new Dice.FfgStarWarsProficiency(1),
                        new Dice.FfgStarWarsDifficulty(2),
                        new Dice.FfgStarWarsChallenge(1),
                        new Dice.FfgStarWarsBoost(1),
                        new Dice.FfgStarWarsSetback(1),
                        new Dice.FfgStarWarsForce(1)
                    ],
                    exp = new Expression(
                        new Expression.Operator["+"](
                            dice[0], new Operator("+",
                                dice[1], new Operator("+",
                                    dice[2], new Operator("+",
                                        dice[3], new Operator("+",
                                            dice[4], new Operator("+",
                                                dice[5], dice[6]
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    expected,
                    actual
                ;
                
                expected = dice.reduce(function (acc, die) {
                    var result = die.result;
                    
                    Object.keys(result).forEach(function (key) {
                        acc[key] += result[key];
                    });
                    
                    return acc;
                }, {
                    success: 0,
                    advantage: 0,
                    triumph: 0,
                    failure: 0,
                    threat: 0,
                    despair: 0,
                    lightside: 0,
                    darkside: 0
                });
                
                actual = exp.valueOf();
                Object.keys(actual).forEach(function (key) {
                    actual[key].should.equal(expected[key]);
                });
            });
        }
    );
});