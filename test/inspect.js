var nutil = require("util");

module.exports = function inspect () {
    return console.log(nutil.inspect.apply(nutil, arguments));
};
