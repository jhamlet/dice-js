module.exports = function repeat (count, fn) {
    Array(count).join("-").split("-").forEach(fn);
};
