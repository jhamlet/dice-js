
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

function numericSort (a, b) { return a - b; }

function rollDie (sides) { return Math.floor(Math.random() * sides) + 1; }

function reduceSum (t, d) { return (t + d); }

module.exports = {
    slice:       slice,
    merge:       merge,
    numericSort: numericSort,
    rollDie:     rollDie,
    reduceSum:   reduceSum
};

merge(module.exports, require("./util-properties"));

