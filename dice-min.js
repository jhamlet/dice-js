(function(a){function i(a,b,c){return Array.prototype.slice.call(a,b,c)}function j(){var a=i(arguments);return a.reduce(function(a,b){return Object.keys(b).reduce(function(a,c){a[c]=b[c];return a},a)},a.shift())}function k(a,b){return j({},h,{value:a},b||{})}function l(a,b){return j(k(a,b),{enumerable:!1})}function m(a,b){return a-b}function n(a){return Math.floor(Math.random()*a)+1}function o(a,b){return a+b}function p(a,b,c){if(arguments.length===1){b=a;a=1}this.count=a;this.sides=b;Object.defineProperty(this,"_behaviors",l([]));c&&this.addBehavior.apply(this,c)}function q(){var a=this.init;a&&typeof a=="function"&&a.apply(this,arguments)}function r(a,b){var c=function(){q.apply(this,arguments)};j(c.prototype=e(q.prototype),b);return d[a]=c}function s(a){var b,c,f=d[a];if(!f)throw new Error("Unknown behavior '"+a+"'");b=f.prototype;if(typeof b.init=="function"){c=e(b);f.apply(c,i(arguments,1));return c}return b}function t(a,b){return function(c){var d=new p(c,a);b&&b.forEach(function(a){d.addBehavior(g(a)?s.apply(null,a):s(a))});return d}}var b,c,d,e=Object.create,f=function(){},g=Array.isArray,h={enumerable:!0,writable:!0,configurable:!0};b=k;c=l;p.prototype=e(Object.prototype,{count:k(1),sides:k(0),rolled:k(!1),total:k(0),roll:b(function(){if(this.rolled)return this.total;this.total=this._roll();this.rolled=!0;this._applyBehaviors("roll");return this.total}),reroll:b(function(){this.reset();return this.roll()}),reset:b(function(){delete this.total;delete this.results;delete this.rolled;this._applyBehaviors("reset");return this}),addBehavior:b(function(){i(arguments).forEach(function(a){this.push(a)},this._behaviors);return this}),toString:b(function(){var a,b={count:this.count,sides:this.sides,total:this.total,modifiers:[],results:this.results||[],suffix:"",addenda:""};this._applyBehaviors("toString",[b]);a=b.modifiers.reduce(o,0);return(b.count>1?b.count:"")+"d"+b.sides+(a!==0?a>0?"+"+a:a:"")+(this.rolled?" ["+this.results.join(", ")+"] = "+b.total+(b.suffix?b.suffix:"")+(b.addenda?" ("+b.addenda+")":""):"")}),_roll:c(function(){var a,b=0,c=this.count,d=this.sides,e=0,f=this.results=[];for(b;b<c;b++){a=n(d);f.push(a);e+=a}return e}),_applyBehaviors:c(function(a,b){b=b||[];b.unshift(this);this._behaviors.forEach(function(c){c[a].apply(c,b)},this);return this})});p.behaviors=d={};q.prototype=e(Object.prototype,{roll:b(f),reset:b(f),toString:b(f)});p.DiceBehavior=q;p.createBehavior=r;p.getBehavior=s;p.makeDiceFactory=t;r("ResultModifier",{init:function(a){this.amount=a},roll:function(a){a.total+=this.amount},toString:function(a,b){b.modifiers.push(this.amount)}});r("DieModifier",{init:function(a){this.amount=a},roll:function(a){a.total+=this.amount*a.count},toString:function(a,b){b.modifiers.push(this.amount*a.count)}});r("RemoveLowest",{init:function(a){this.amount=a},roll:function(a){var b=a.results.sort(m).reverse();a.lowResults=b.splice(a.count-this.amount);a.total=b.reduce(o,0)},reset:function(a){delete a.lowResults},toString:function(a,b){b.addenda+="low: ["+a.lowResults.join(", ")+"]"}});r("SuccessDice",{init:function(a){this.minimum=a},roll:function(a){var b,c,d=0,e=0,f=a.results,g=f.length,h=a.count,i=this.minimum;for(b=0;b<g;b++){c=f[b];c>=i?d++:b<h&&c===1&&e++}a.successes=d;a.failures=e;a.total=Math.max(d-e,0);a.fumbled=e>d},reset:function(a){delete a.successes;delete a.failures;delete a.fumbled},toString:function(a,b){b.suffix+=" successes"+(a.fumbled?"!":"")}});r("HeroNormalDice",{roll:function(a){a.body=a.results.reduce(function(a,b){switch(b){case 1:break;case 6:a+=2;break;default:a+=1}return a},0);a.stun=a.total},reset:function(a){delete a.body;delete a.stun},toString:function(a,b){b.suffix+=" stun, "+a.body+" body"}});r("WildDice",{init:function(a){this.amount=a||0},roll:function(a){var b=a.results.slice().reverse(),c=b.slice(0,this.amount||a.results.length),d=0;c.forEach(function(b){var c,e=a.sides;if(b===e){do{c=n(e);a.results.push(c)}while(c===e)}else b===1&&d++});a.total=a.results.reduce(o,0);a.complications=d;a.complication=d>0},reset:function(a){delete a.wildDice;delete a.complication;delete a.complications},toString:function(a,b){var c=a.complication,d=a.complications;b.suffix+=c?Array(d+1).join("!"):""}});j(a,{Dice:p,heroDice:t(6,["HeroNormalDice"]),shadowrunDice:t(6,["WildDice",["SuccessDice",5]]),d6StarWarsDice:function(a,b){var c=new p(a,6,[s("WildDice",1)]);typeof b=="number"&&c.addBehavior(s("ResultModifier",b));return c}})})(typeof module!="undefined"&&module.exports||(this.dice={}))