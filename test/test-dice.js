
var Dice = require("../").Dice;

suite("Dice", function () {
    
    test("Instantiation", function () {
        var dice = new Dice(3, 6);
        
        dice.dice.length.should.equal(3);
        dice.rolled.should.equal(false);
        dice.result.should.equal(0);
    });

    test("Handful of the same type of dice", function () {
        var dice = new Dice(3, 6),
            result
        ;
        
        result = dice.roll();
        result.should.be.within(1, 18);
        dice.rolled.should.equal(true);
        dice.result.should.not.equal(0);
    });
    
    test("Instantiation with a string", function () {
        var dice = new Dice("3d6"),
            result
        ;
        
        result = dice.roll();
        // result.should.be.within(1, 18);
        dice.rolled.should.equal(true);
        dice.result.should.not.equal(0);
        
        console.log("" + dice);
    });
});