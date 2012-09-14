
var DiceBehaviors = require("dice-js/dice-behaviors");

suite("DiceBehaviors", function () {
    
    test("One", function () {
        DiceBehaviors.create("ResultModifier", {
            init: function (amount) {
                this.modifier = amount;
            },
            result: 
        });
    });
});