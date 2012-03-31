
var Dice = require("../").Dice,
    behaviors = Dice.behaviors
;

suite("Dice", function () {
    
    test("Instantiation", function () {
        var dice = new Dice(3, 6);
        
        dice.count.should.equal(3);
        dice.rolled.should.equal(false);
        dice.total.should.equal(0);
        ("" + dice).should.equal("3d6");
    });
    
    test("Roll d6", function () {
        var dice = new Dice(1, 6),
            result
        ;

        ("" + dice).should.equal("d6");
        
        result = dice.roll();
        result.should.be.within(1, 6);
        dice.rolled.should.equal(true);
        dice.total.should.not.equal(0);
        dice.results.length.should.equal(1);
        
        console.log("" + dice);
        ("" + dice).should.match(/d6 \[(\d+)\] = \d+/);
    });

    test("Roll 3d6", function () {
        var dice = new Dice(3, 6),
            result
        ;
        
        ("" + dice).should.equal("3d6");

        result = dice.roll();
        result.should.be.within(1, 18);
        dice.rolled.should.equal(true);
        dice.total.should.not.equal(0);
        dice.results.length.should.equal(3);
        
        console.log("" + dice);
        ("" + dice).should.match(/d6 \[(\d+(?:, )?){3}\] = \d+/);
    });
    
    test("Roll 3d6+2", function () {
        var dice = new Dice(3, 6, [behaviors.resultModifier(2)]),
            result, dietotal
        ;
        
        result = dice.roll();
        result.should.be.within(5, 20);
        
        dietotal = dice.results.reduce(function (p, d) {
            return p + d;
        }, 0);
        
        dietotal.should.equal(result - 2);

        console.log("" + dice);
    });

    test("Roll 3d6 and add 1 to every die", function () {
        var dice = new Dice(3, 6, [behaviors.dieModifier(1)]),
            result, dietotal
        ;
        
        result = dice.roll();
        result.should.be.within(6, 21);
        
        dietotal = dice.results.reduce(function (p, d) {
            return (p + d);
        }, 0);
        
        dietotal.should.equal(result - 3);

        console.log("" + dice);
    });
    
    test("5d6 minus two lowest (5d6-2low)", function () {
        var dice = new Dice(5, 6),
            results
        ;
        
        dice.addBehavior(behaviors.removeLowest(2));
        
        results = dice.roll();
        results.should.be.within(3, 18);
        
        dice.results.length.should.equal(3);
        dice.lowResults.length.should.equal(2);
        
        console.log("" + dice);
    });
    
    test("10d6 Hero Dice", function () {
        var dice = new Dice(10, 6);
        
        dice.addBehavior(behaviors.heroDice());
        
        dice.roll();
        dice.stun.should.be.within(10, 60);
        dice.body.should.be.within(0, 20);
        
        console.log("" + dice);
    });
    
    test("6d6 Success dice", function () {
        var dice = new Dice(6, 6);
        
        dice.addBehavior(behaviors.successDice(5));
        
        dice.roll();
        dice.total.should.be.within(0, 6);

        console.log("" + dice);
    });
    
    test("6d6 Shadowrun dice", function () {
        var dice = new Dice(6, 6);
        
        dice.addBehavior(
            behaviors.wildDice(),
            behaviors.successDice(5)
        );
        
        dice.roll();
        
        console.log("" + dice);
    });
    
    test("6d6 WEG Star Wars", function () {
        var dice = new Dice(6, 6);
        
        dice.addBehavior(behaviors.wildDice(1));
        
        dice.roll();
        
        console.log("" + dice);
    });
});