/*globals suite, test, setup, teardown */

var Dice        = require("dice-js"),
    should      = require("should"),
    repeat      = require("./repeat"),
    Expression  = Dice.Expression,
    Operator    = Expression.Operator,
    format      = require("util").format,
    tries       = 5000,
    faces       = [4, 6, 8, 10, 12, 20, 100],
    ops = [
        {
            name: "Addition",
            symbol: "+"
        },
        {
            name: "Subtraction",
            symbol: "-"
        },
        {
            name: "Division",
            symbol: "/"
        },
        {
            name: "Multiplication",
            symbol: "*"
        }
    ]
;

function evalMath (left, operator, right) {
    return eval(format("%s %s %s", left, operator, right))
}

suite("Operator", function () {
    
    ops.forEach(function (obj) {
        var left    = 8,
            right   = 5,
            symbol  = obj.symbol,
            result  = evalMath(left, symbol, right)
        ;
        
        test(format("Numeric %s", obj.name), function () {
            var op = new Operator[symbol](left, right);
            op.valueOf().should.equal(result);
        });

        faces.forEach(function (faces) {

            test(format("D%s %s (%s times)", faces, obj.name, tries), function () {

                repeat(tries, function (nil, idx) {
                    var left    = new Dice(faces),
                        right   = new Dice(faces),
                        op      = new Operator[symbol](left, right),
                        result  = evalMath(left.result, symbol, right.result)
                    ;

                    op.valueOf().should.equal(result);
                });
            });

        });
        
    });
    
});