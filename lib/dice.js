
(function (exports) {
    var derive = Object.create,
        plainSpec = {
            enumerable: true,
            writable: true,
            configurable: true
        },
        method, privateMethod
    ;
    
    //-----------------------------------------------------------------------
    // Utilities
    //-----------------------------------------------------------------------
    function slice (list, start, end) {
        return Array.prototype.slice.call(list, start, end);
    }
    
    function merge () {
        var args = slice(arguments);
        
        return args.reduce(function (base, obj) {
            return Object.keys(obj).reduce(function (b, k) {
                b[k] = obj[k];
                return b;
            }, base);
        }, args.shift());
    }
    
    function property (val, spec) {
        return merge({}, plainSpec, {value: val}, spec || {});
    }
    method = property;
    
    function privateProperty (val, spec) {
        return merge(property(val, spec), {enumerable: false});
    }
    privateMethod = privateProperty;
    
    function numericSort (a, b) {
        return a - b;
    }
    
    function rollDie (sides) {
        return Math.floor(Math.random() * sides) + 1;
    }
    
    function reduceSum (t, d) {
        return (t + d);
    }
    //-----------------------------------------------------------------------
    // Dice
    //-----------------------------------------------------------------------
    function Dice (num, sides, behaviors) {
        if (arguments.length === 1) {
            sides = num;
            num = 1;
        }
        this.count = num;
        this.sides = sides;

        Object.defineProperty(this, "_behaviors", privateProperty([]));

        if (behaviors) {
            this.addBehavior.apply(this, behaviors);
        }
    }
    
    Dice.prototype = derive(Object.prototype, {
        /**
         * The number of dice
         * 
         * @property count
         * @type {number}
         * @default 1
         */
        count:  property(1),
        /**
         * The number of sides (i.e: type)
         * 
         * @property sides
         * @type {number}
         * @default 0
         */
        sides:  property(0),
        /**
         * @property rolled
         * @type {boolean}
         * @default false
         */
        rolled: property(false),
        /**
         * Total of the rolled dice
         * 
         * @property total
         * @type {number}
         * @default 0
         */
        total: property(0),
        /**
         * Roll the dice and return the total
         * 
         * @method roll
         * @returns {number}
         */
        roll: method(function () {
            if (this.rolled) {
                return this.total;
            }
            this.total = this._roll();
            this.rolled = true;
            this._applyBehaviors();
            return this.total;
        }),
        /**
         * Reset the dice and roll again
         * 
         * @method reroll
         * @returns {number}
         */
        reroll: method(function () {
            this.reset();
            return this.roll();
        }),
        /**
         * Reset the dice
         * 
         * @method reset
         * @returns {Dice} the instance
         */
        reset: method(function () {
            delete this.total;
            delete this.dice;
            delete this.rolled;
            this._applyBehaviors();
            return this;
        }),
        /**
         * Add a behavior function to the dice set
         * 
         * @method addBehavior
         * @param rest {function} one or more functions
         * @returns {Dice} the instance
         */
        addBehavior: method(function (/*rest*/) {
            slice(arguments).forEach(function (fn) {
                this.push(fn);
            }, this._behaviors);
            return this;
        }),
        /**
         * @method toString
         * @override Object#toString
         * @returns {string}
         */
        toString: method(function () {
            var count = this.count,
                total = this.total
            ;
            
            return (count > 1 ? count : "") + "d" + this.sides +
                (this.rolled ? " [" + this.dice.join(", ") + "] = " + total : "");
        }),
        /**
         * @method _roll
         * @private
         * @returns {number}
         */
        _roll: privateMethod(function () {
            var i = 0,
                len = this.count,
                sides = this.sides,
                total = 0,
                dice = (this.dice = []),
                result
            ;
            
            for (i; i < len; i++) {
                result = rollDie(sides);
                dice.push(result);
                total += result;
            }
            
            return total;
        }),
        /**
         * Apply any behaviors attached to this dice object
         * 
         * @method _applyBehaviors
         * @private
         * @returns {Dice} the instance
         */
        _applyBehaviors: privateMethod(function () {
            this._behaviors.forEach(this._applyBehavior, this);
            return this;
        }),
        /**
         * Apply the passed behavior to this object
         * 
         * @method _applyBehavior
         * @private
         * @param {function}
         */
        _applyBehavior: privateMethod(function (fn) {
            fn.call(this);
        })
    });
    
    exports.Dice = Dice;
    
    //-----------------------------------------------------------------------
    // Behaviors
    //-----------------------------------------------------------------------
    exports.behaviors = {
        /**
         * Apply a modifier to the total
         * 
         * @param amt {number}
         * @mutates Dice#total
         */
        resultModifier: function (amt) {
            return function () {
                if (!this.rolled) {
                    return;
                }
                this.total += amt;
            };
        },
        /**
         * Apply a modifier to every die
         * 
         * @param amt {number}
         * @mutates Dice#total
         * @mutates Dice#dice
         */
        dieModifier: function (amt) {
            return function () {
                if (!this.rolled) {
                    return;
                }

                this.total += amt * this.dice.length;
            };
        },
        /**
         * Remove *amt* lowest dice from the results.
         * 
         * @param amt {number} number of low dice to discard
         * @mutates Dice#toal
         * @mutates Dice#toString
         * @property lowDice {array[number]}
         */
        removeLowest: function (amt) {
            return function () {
                var dice;
                
                if (!this.rolled) {
                    delete this.lowDice;
                    delete this.toString;
                }
                else {
                    this.lowDice = this.dice.sort(numericSort).reverse().
                            splice(this.count - amt);
                            
                    this.total = this.dice.reduce(reduceSum, 0);
                    
                    this.toString = function () {
                        return Dice.prototype.toString.call(this) +
                            " (low: [" + this.lowDice.join(", ") + "])";
                    };
                }
            };
        },
        /**
         * Count the number of dice above a certain threshold
         * 
         * @param amt {number} number or greater to count as a success
         * @mutates Dice#total
         * @mutates Dice#toString
         */
        successDice: function (min) {
            return function () {
                if (!this.rolled) {
                    delete this.toString;
                }
                else {
                    this.total = this.dice.filter(function (d) {
                        return d >= min;
                    }).reduce(function (t, d) {
                        return ++t;
                    }, 0);
                    this.toString = function () {
                        return Dice.prototype.toString.call(this) + " successes";
                    };
                }
            };
        },
        /**
         * Determine the amount of Stun and Body
         * 
         * @mutates Dice#toString
         * @property body {number} number of body (die result: 1 = 0, 2-5 = 1, 6 = 2)
         * @property stun {number} total of dice
         */
        heroDice: function () {
            return function () {
                if (!this.rolled) {
                    delete this.body;
                    delete this.stun;
                    delete this.toString;
                }
                else {
                    this.body = this.dice.reduce(function (total, d) {
                        switch (d) {
                            case 1:
                                break;
                            case 6:
                                total += 2;
                                break;
                            default:
                                total += 1;
                        }
                        return total;
                    }, 0);
                    this.stun = this.total;
                    this.toString = function () {
                        return Dice.prototype.toString.call(this) +
                            " stun, " + this.body + " body";
                    };
                }
            };
        },
        /**
         * Specify a number of dice that are *wild*.  If these dice roll the
         * maximum amount, roll another die and add that to the total.  The
         * wild di(c)e continue to add as long as they roll the maximum.
         * 
         * @param amt {number}
         * @property wildDice {array[number]} results of the wild dice
         * @property complications {boolean} if the wild die comes up a 1
         * @mutates Dice#total
         */
        wildDice: function (amt) {
            return function () {
                var dicesWild;
                
                if (!this.rolled) {
                    delete this.wildDice;
                    delete this.complication;
                    delete this.toString;
                }
                else {
                    dicesWild = this.dice.slice().reverse().
                        slice(0, amt || this.dice.length);
                        
                    dicesWild.forEach(function (die) {
                        var sides = this.sides,
                            result
                        ;
                        
                        if (die === sides) {
                            do {
                                result = rollDie(sides);
                                this.dice.push(result);
                            } while (result === sides);
                        }
                        else if (die === 1) {
                            if (!this.complications) {
                                this.complications = 0;
                            }
                            this.complications++;
                        }
                    }, this);
                    
                    this.total = this.dice.reduce(reduceSum, 0);
                    
                    this.toString = function () {
                        var fails = this.complications;
                        return Dice.prototype.toString.call(this) + 
                            (fails ? Array(fails + 1).join("!") : "");
                    };
                }
            };
        }
    };
    
}((typeof module !== "undefined" && module.exports) || this));