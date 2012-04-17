
(function (exports) {
    var util = require("./util"),
        noOp = function () {},
        isArray = Array.isArray,
        behaviors
    ;
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

        Object.defineProperty(this, "_behaviors", util.privateProperty([]));

        if (behaviors) {
            this.addBehavior.apply(this, behaviors);
        }
    }
    
    Dice.prototype = util.derive(Object.prototype, {
        /**
         * The number of dice
         * 
         * @property count
         * @type {number}
         * @default 1
         */
        count:  util.property(1),
        /**
         * The number of sides (i.e: type)
         * 
         * @property sides
         * @type {number}
         * @default 0
         */
        sides:  util.property(0),
        /**
         * @property rolled
         * @type {boolean}
         * @default false
         */
        rolled: util.property(false),
        /**
         * Total of the rolled dice
         * 
         * @property total
         * @type {number}
         * @default 0
         */
        total: util.property(0),
        /**
         * Roll the dice and return the total
         * 
         * @method roll
         * @returns {number}
         */
        roll: util.method(function () {
            if (this.rolled) {
                return this.total;
            }
            this.total = this._roll();
            this.rolled = true;
            this._applyBehaviors("roll");
            return this.total;
        }),
        /**
         * Reset the dice and roll again
         * 
         * @method reroll
         * @returns {number}
         */
        reroll: util.method(function () {
            this.reset();
            return this.roll();
        }),
        /**
         * Reset the dice
         * 
         * @method reset
         * @returns {Dice} the instance
         */
        reset: util.method(function () {
            delete this.total;
            delete this.results;
            delete this.rolled;
            this._applyBehaviors("reset");
            return this;
        }),
        /**
         * Add a behavior function to the results set
         * 
         * @method addBehavior
         * @param rest {function} one or more functions
         * @returns {Dice} the instance
         */
        addBehavior: util.method(function (/*rest*/) {
            util.slice(arguments).forEach(function (fn) {
                this.push(fn);
            }, this._behaviors);
            return this;
        }),
        /**
         * @method toString
         * @override Object#toString
         * @returns {string}
         */
        toString: util.method(function () {
            var spec = {
                    count: this.count,
                    sides: this.sides,
                    total: this.total,
                    modifiers: [],
                    results: this.results || [],
                    suffix: "",
                    addenda: ""
                },
                mod
            ;
            
            this._applyBehaviors("toString", [spec]);
            
            mod = spec.modifiers.reduce(util.reduceSum, 0);
            
            return (spec.count > 1 ? spec.count : "") + "d" + spec.sides +
                (mod !== 0 ? (mod > 0 ? "+" + mod : mod) : "") +
                (this.rolled ? " [" + this.results.join(", ") + "] = " + spec.total +
                    (spec.suffix ? spec.suffix : "") + 
                    (spec.addenda ? " (" + spec.addenda + ")" : "") :
                    "");
        }),
        /**
         * @method _roll
         * @private
         * @returns {number}
         */
        _roll: util.privateMethod(function () {
            var i = 0,
                len = this.count,
                sides = this.sides,
                total = 0,
                results = (this.results = []),
                result
            ;
            
            for (i; i < len; i++) {
                result = util.rollDie(sides);
                results.push(result);
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
        _applyBehaviors: util.privateMethod(function (aspect, args) {
            args = args || [];
            args.unshift(this);
            this._behaviors.forEach(function (behavior) {
                behavior[aspect].apply(behavior, args);
            }, this);
            return this;
        })
        
    });
    
    //-----------------------------------------------------------------------
    // Dice Behaviors
    //-----------------------------------------------------------------------
    Dice.behaviors = behaviors = {};
    
    function DiceBehavior () {
        var init = this.init;
        if (init && typeof init === "function") {
            init.apply(this, arguments);
        }
    }

    DiceBehavior.prototype = util.derive(Object.prototype, {
        roll:     util.method(noOp),
        reset:    util.method(noOp),
        toString: util.method(noOp)
    });
    
    Dice.DiceBehavior = DiceBehavior;
    
    function createBehavior (name, props) {
        var ctor = function () { DiceBehavior.apply(this, arguments); };
        util.merge((ctor.prototype = util.derive(DiceBehavior.prototype)), props);
        return (behaviors[name] = ctor);
    }
    
    Dice.createBehavior = createBehavior;

    function getBehavior (name) {
        var behavior = behaviors[name],
            proto, init, inst
        ;
        
        if (!behavior) {
            // throw an error
            throw new Error("Unknown behavior '" + name + "'");
        }
        else {
            proto = behavior.prototype;
            if (typeof proto.init === "function") {
                inst = util.derive(proto);
                behavior.apply(inst, util.slice(arguments, 1));
                return inst;
            }
            else {
                return proto;
            }
        }
    }
    
    Dice.getBehavior = getBehavior;
    
    function makeDiceFactory (sides, behaviors) {
        return function (num) {
            var dice = new Dice(num, sides);
            if (behaviors) {
                behaviors.forEach(function (args) {
                    dice.addBehavior(
                        isArray(args) ?
                            getBehavior.apply(null, args) :
                            getBehavior(args)
                    );
                });
            }
            return dice;
        };
    }
    
    Dice.makeDiceFactory = makeDiceFactory;
    
    //-----------------------------------------------------------------------
    // Bits and Pieces
    //-----------------------------------------------------------------------
    /**
     * Apply a modifier to the total
     * 
     * @param amt {number}
     * @mutates Dice#total
     */
    createBehavior("ResultModifier", {
        init: function (amt) {
            this.amount = amt;
        },
        
        roll: function (dice) {
            dice.total += this.amount;
        },
        
        toString: function (dice, spec) {
            spec.modifiers.push(this.amount);
        }
    });
    
    /**
     * Apply a modifier to every die
     * 
     * @param amt {number}
     * @mutates Dice#total
     * @mutates Dice#results
     */
    createBehavior("DieModifier", {
        init: function (amt) {
            this.amount = amt;
        },
        
        roll: function (dice) {
            dice.total += (this.amount * dice.count);
        },
        
        toString: function (dice, spec) {
            spec.modifiers.push(this.amount * dice.count);
        }
    });
    
    /**
     * Remove *amt* lowest dice from the results.
     * 
     * @param amt {number} number of low dice to discard
     * @mutates Dice#total
     * @property Dice#lowResults {array[number]}
     */
    createBehavior("RemoveLowest", {
        init: function (amt) {
            this.amount = amt;
        },
        
        roll: function (dice) {
            var results = dice.results.sort(util.numericSort).reverse();
            
            dice.lowResults = results.splice(dice.count - this.amount);
            dice.total = results.reduce(util.reduceSum, 0);
        },
        
        reset: function (dice) {
            delete dice.lowResults;
        },
        
        toString: function (dice, spec) {
            spec.addenda += "low: [" + dice.lowResults.join(", ") + "]";
        }
    });

    /**
     * Count the number of dice above a certain threshold
     * 
     * @param amt {number} number or greater to count as a success
     * @mutates Dice#total
     * @mutates Dice#toString
     * @property Dice#successes {number}
     * @property Dice#failures {number}
     * @property Dice#fumbled {boolean}
     */
    createBehavior("SuccessDice", {
        init: function (min) {
            this.minimum = min;
        },
        
        roll: function (dice) {
            var total    = 0,
                failures = 0,
                results  = dice.results,
                len      = results.length,
                count    = dice.count,
                min      = this.minimum,
                i, d
            ;
            
            for (i = 0; i < len; i++) {
                d = results[i];
                if (d >= min) {
                    total++;
                }
                // We only count ones as failures if in the original
                // result set
                else if (i < count && d === 1) {
                    failures++;
                }
            }

            dice.successes = total;
            dice.failures  = failures;
            dice.total     = Math.max(total - failures, 0);
            dice.fumbled   = failures > total;
        },
        
        reset: function (dice) {
            delete dice.successes;
            delete dice.failures;
            delete dice.fumbled;
        },
        
        toString: function (dice, spec) {
            spec.suffix += " successes" + (dice.fumbled ? "!" : "");
        }
    });
    
    /**
     * Determine the amount of Stun and Body
     * 
     * @mutates Dice#toString
     * @property Dice#body {number} number of body (die result: 1 = 0, 2-5 = 1, 6 = 2)
     * @property Dice#stun {number} total of dice
     */
    createBehavior("HeroNormalDice", {
        roll: function (dice) {
            dice.body = dice.results.reduce(function (total, d) {
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
            dice.stun = dice.total;
        },
        
        reset: function (dice) {
            delete dice.body;
            delete dice.stun;
        },
        
        toString: function (dice, spec) {
            spec.suffix += " stun, " + dice.body + " body";
        }
    });
    
    /**
     * Specify a number of dice that are *wild*.  If these dice roll the
     * maximum amount, roll another die and add that to the total.  The
     * wild di(c)e continue to add as long as they roll the maximum.
     * 
     * @param amt {number}
     * @property Dice#wildDice {array[number]} results of the wild dice
     * @property Dice#complications {boolean} if the wild die comes up a 1
     * @mutates Dice#total
     */
    createBehavior("WildDice", {
        init: function (amt) {
            this.amount = amt || 0;
        },
        
        roll: function (dice) {
            var results = dice.results.slice().reverse(),
                dicesWild = results.slice(0, this.amount || dice.results.length),
                complications = 0
            ;
                
            dicesWild.forEach(function (die) {
                var sides = dice.sides,
                    result
                ;
                
                if (die === sides) {
                    do {
                        result = util.rollDie(sides);
                        dice.results.push(result);
                    } while (result === sides);
                }
                else if (die === 1) {
                    complications++;
                }
            });
            
            dice.total = dice.results.reduce(util.reduceSum, 0);
            dice.complications = complications;
            dice.complication = complications > 0;
        },
        
        reset: function (dice) {
            delete dice.wildDice;
            delete dice.complication;
            delete dice.complications;
        },
        
        toString: function (dice, spec) {
            var fails = dice.complication,
                failures = dice.complications
            ;
            
            spec.suffix += (fails ? Array(failures+1).join("!") : "");
        }
    });
    
    //-----------------------------------------------------------------------
    // Exports
    //-----------------------------------------------------------------------
    util.merge(exports, {
        Dice: Dice,
        /**
         * Utility function/Class for creating Hero System Normal Dice
         * 
         * @function heroDice
         * @param num {number}
         * @returns {Dice}
         */
        heroDice: makeDiceFactory(6, ["HeroNormalDice"]),
        /**
         * Utility function/Class for creating a batch of Shadowrun Dice
         * 
         * @function shadowrunDice
         * @param num {number}
         * @returns {Dice}
         */
        shadowrunDice: makeDiceFactory(6, ["WildDice", ["SuccessDice", 5]]),
        /**
         * Utility function/Class for creating West End Game's Star Wars
         * flavor Dice
         * 
         * @function d6StarWarsDice
         * @param num {number}
         * @param pips {number}
         * @returns {Dice}
         */
        d6StarWarsDice: function (num, pips) {
            var dice = new Dice(num, 6, [getBehavior("WildDice", 1)]);
            
            if (typeof pips === "number") {
                dice.addBehavior(getBehavior("ResultModifier", pips));
            }
            
            return dice;
        }
    });
    
}((typeof module !== "undefined" ? module.exports : (this.diceJsLib = {}))));
