(function () {
    var util = require("./util"),
        plainSpec = {
            enumerable: true,
            writable: true,
            configurable: true
        }
    ;

    function property (val, spec) {
        return util.merge({}, plainSpec, {value: val}, spec || {});
    }

    function privateProperty (val, spec) {
        return util.merge(property(val, spec), {enumerable: false});
    }

    module.exports = {
        derive: Object.create,
        property: property,
        method: property,
        privateProperty: privateProperty,
        privateMethod: privateProperty
    };
    
}());
