/*globals suite, test, setup, teardown */

var Dice    = require("dice-js"),
    repeat  = require("./repeat"),
    inspect = require("./inspect"),
    should  = require("should"),
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
    var dice = Dice["FfgStarWars" + type + "Dice"](1),
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
        
    })
    
}

suite("FFG Star Wars Dice", function () {
    
    Object.keys(FACES).forEach(function (key) {
        dieResultTest(key, FACES[key]);
    });
    
    // test("Pool", function () {
    //     var dice = Dice.FfgStarWarsChallengeDice(3);
    //     
    //     // inspect(dice.result, true, 10);
    //     // inspect(dice.results, true, 10);
    // });
});