
var Dice = require("../"),
    Die = Dice.Die
;

suite("Die", function () {
    
    test("Instantiation", function () {
        var die = new Die(6);
        
        die.rolled.should.equal(false);
        die.result.should.equal(0);
    });
    
    test("Rolling", function () {
        var die = new Die(6),
            result;
        
        result = die.roll();
        result.should.be.within(1, 6);
        
        die.rolled.should.equal(true);
        
        die.result.should.equal(result);
    });
    
    test("Same result without reset", function () {
        var die = new Die(6),
            result1,
            result2
        ;
            
        result1 = die.roll();
        result2 = die.roll();
        
        result2.should.equal(result1);
    });
    
    test("reset", function () {
        var die = new Die(6),
            result;
        
        result = die.roll();
        die.rolled.should.equal(true);
        die.result.should.not.equal(0);
        
        die.reset();
        die.rolled.should.equal(false);
        die.result.should.equal(0);
    });
});