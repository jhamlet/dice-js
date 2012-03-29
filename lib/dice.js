
(function (exports) {
    var ObjCreate = Object.create,
        ObjProto = Object.prototype
    ;
    
    //-----------------------------------------------------------------------
    // Die
    //-----------------------------------------------------------------------
    function Die (sides) {
        this.sides = sides;
        this.reset();
    }
    
    Die.prototype = ObjCreate(ObjProto, {
        roll: {
            value: function () {
                if (this.rolled) {
                    return this.result;
                }
                this.result = Math.floor(Math.random() * this.sides) + 1;
                this.rolled = true;
                return this.result;
            }
        },
        
        reset: {
            value: function () {
                this.result = 0;
                this.rolled = false;
            }
        },
        
        toString: {
            value: function () {
                return "d" + this.sides;
            }
        }
    });
    
    exports.Die = Die;
    
    //-----------------------------------------------------------------------
    // Dice
    //-----------------------------------------------------------------------
    function Dice (num, sides) {
        var i = 0;
        
        this.dice = [];
        this.reset();
        
        if (arguments.length === 2 && typeof num === "number") {
            for (i; i < num; i++) {
                this.dice.push(new Die(sides));
            }
        }
        else if (typeof num === "string") {
            return Dice.parse(num);
        }
    }
    
    Dice.parse = function (str) {
        var dice = new Dice(3, 6);
        dice.dice.push(new Die(4));
        dice.dice.push(new Die(8));
        dice.dice.push(new Die(10));
        dice.dice.push(new Die(12));
        dice.dice.push(new Die(20));
        return dice;
    };
    
    Dice.prototype = ObjCreate(Die.prototype, {
        roll: {
            value: function () {
                if (this.rolled) {
                    return this.result;
                }

                this.dice.forEach(function (d) {
                    this.result += d.roll();
                }, this);

                this.rolled = true;
                return this.result;
            }
        },
        
        toString: {
            value: function () {
                var groups = this.dice.reduce(function (obj, d) {
                        var sides = d.sides;
                        if (typeof obj[sides] === "number") {
                            obj[sides]++;
                        }
                        else {
                            obj[sides] = 1;
                        }
                        return obj;
                    }, {})
                ;
                
                return Object.keys(groups).sort(function (a, b) {
                    return b - a;
                }).map(function (type) {
                    return groups[type] + "d" + type;
                }).join(" + ");
            }
        }
    });
    
    exports.Dice = Dice;

}((module && module.exports) || this));