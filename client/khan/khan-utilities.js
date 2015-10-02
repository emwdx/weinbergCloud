var DEFAULT_TOLERANCE = 1e-9;
var EPSILON = Math.pow(2, -42);

$.extend(KhanUtil,{

    DEFAULT_TOLERANCE: DEFAULT_TOLERANCE,
    EPSILON: EPSILON,

    is: function(x) {
        return _.isNumber(x) && !_.isNaN(x);
    },

    equal: function(x, y, tolerance) {
        // Checking for undefined makes this function behave nicely
        // with vectors of different lengths that are _.zip'd together
        if (x == null || y == null) {
            return x === y;
        }
        if (tolerance == null) {
            tolerance = DEFAULT_TOLERANCE;
        }
        return Math.abs(x - y) < tolerance;
    },

    sign: function(x, tolerance) {
        return knumber.equal(x, 0, tolerance) ? 0 : Math.abs(x) / x;
    },

    // Round a number to a certain number of decimal places
    round: function(num, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
    },

    // Round num to the nearest multiple of increment
    // i.e. roundTo(83, 5) -> 85
    roundTo: function(num, increment) {
        return Math.round(num / increment) * increment;
    },

    floorTo: function(num, increment) {
        return Math.floor(num / increment) * increment;
    },

    ceilTo: function(num, increment) {
        return Math.ceil(num / increment) * increment;
    },

    isInteger: function(num, tolerance) {
        return knumber.equal(Math.round(num), num, tolerance);
    },

    /**
     * toFraction
     *
     * Returns a [numerator, denominator] array rational representation
     * of `decimal`
     *
     * See http://en.wikipedia.org/wiki/Continued_fraction for implementation
     * details
     *
     * toFraction(4/8) => [1, 2]
     * toFraction(0.66) => [33, 50]
     * toFraction(0.66, 0.01) => [2/3]
     * toFraction(283 + 1/3) => [850, 3]
     */
    toFraction: function(decimal, tolerance, max_denominator) {
        max_denominator = max_denominator || 1000;
        tolerance = tolerance || EPSILON; // can't be 0

        // Initialize everything to compute successive terms of
        // continued-fraction approximations via recurrence relation
        var n = [1, 0], d = [0, 1];
        var a = Math.floor(decimal);
        var rem = decimal - a;

        while (d[0] <= max_denominator) {
            if (knumber.equal(n[0] / d[0], decimal, tolerance)) {
                return [n[0], d[0]];
            }
            n = [a*n[0] + n[1], n[0]];
            d = [a*d[0] + d[1], d[0]];
            a = Math.floor(1 / rem);
            rem = 1/rem - a;
        }

        // We failed to find a nice rational representation,
        // so return an irrational "fraction"
        return [decimal, 1];
    }

});
$.extend(KhanUtil,{

    // Simplify formulas before display
    cleanMath: function(expr) {
        return typeof expr === "string" ?
            expr.replace(/\+\s*-/g, "- ")
                .replace(/-\s*-/g, "+ ")
                .replace(/\^1/g, "") :
            expr;
    },

    // A simple random number picker
    // Returns a random int in [0, num)
    rand: function(num) {
        return Math.floor(num * Math.random());
    },

    /* Returns an array of the digits of a nonnegative integer in reverse
     * order: digits(376) = [6, 7, 3] */
    digits: function(n) {
        if (n === 0) {
            return [0];
        }

        var list = [];

        while (n > 0) {
            list.push(n % 10);
            n = Math.floor(n / 10);
        }

        return list;
    },

    // Similar to above digits, but in original order (not reversed)
    integerToDigits: function(n) {
        return KhanUtil.digits(n).reverse();
    },

    // Convert a decimal number into an array of digits (reversed)
    decimalDigits: function(n) {
        var str = "" + Math.abs(n);
        str = str.replace(".", "");

        var list = [];
        for (var i = str.length; i > 0; i--) {
            list.push(str.charAt(i-1));
        }

        return list;
    },

    // Find number of digits after the decimal place
    decimalPlaces: function(n) {
        var str = "" + Math.abs(n);
        str = str.split(".");

        if (str.length === 1) {
            return 0;
        } else {
            return str[1].length;
        }
    },

    digitsToInteger: function(digits) {
        var place = Math.floor(Math.pow(10, digits.length - 1));
        var number = 0;

        $.each(digits, function(index, digit) {
            number += digit * place;
            place /= 10;
        });

        return number;
    },

    padDigitsToNum: function(digits, num) {
        digits = digits.slice(0);
        while (digits.length < num) {
            digits.push(0);
        }
        return digits;
    },

    powerToPlace: function(power) {
        if (power < 0) {
            return KhanUtil.placesRightOfDecimal[-1 * power];
        } else {
            return KhanUtil.placesLeftOfDecimal[power];
        }
    },


    //Adds 0.001 because of floating points uncertainty so it errs on the side of going further away from 0
    roundTowardsZero: function(x) {
        if (x < 0) {
            return Math.ceil(x - 0.001);
        }
        return Math.floor(x + 0.001);
    },

    // Bound a number by 1e-6 and 1e20 to avoid exponents after toString
    bound: function(num) {
        if (num === 0) {
            return num;
        } else if (num < 0) {
            return -KhanUtil.bound(-num);
        } else {
            return Math.max(1e-6, Math.min(num, 1e20));
        }
    },

    factorial: function(x) {
        if (x <= 1) {
            return x;
        } else {
            return x * KhanUtil.factorial(x - 1);
        }
    },

    getGCD: function(a, b) {
        if (arguments.length > 2) {
            var rest = [].slice.call(arguments, 1);
            return KhanUtil.getGCD(a, KhanUtil.getGCD.apply(KhanUtil, rest));
        } else {
            var mod;

            a = Math.abs(a);
            b = Math.abs(b);

            while (b) {
                mod = a % b;
                a = b;
                b = mod;
            }

            return a;
        }
    },

    getLCM: function(a, b) {
        if (arguments.length > 2) {
            var rest = [].slice.call(arguments, 1);
            return KhanUtil.getLCM(a, KhanUtil.getLCM.apply(KhanUtil, rest));
        } else {
            return Math.abs(a * b) / KhanUtil.getGCD(a, b);
        }
    },

    primes: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43,
        47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],

    denominators: [2, 3, 4, 5, 6, 8, 10, 12, 100],
    smallDenominators: [2, 3, 4, 5, 6, 8, 10, 12],

    getPrime: function() {
        return KhanUtil.primes[KhanUtil.rand(KhanUtil.primes.length)];
    },

    isPrime: function(n) {
        if (n <= 1) {
            return false;
        } else if (n < 101) {
            return !!$.grep(KhanUtil.primes, function(p, i) {
                return Math.abs(p - n) <= 0.5;
            }).length;
        } else {
            if (n <= 1 || n > 2 && n % 2 === 0) {
                return false;
            } else {
                for (var i = 3, sqrt = Math.sqrt(n); i <= sqrt; i += 2) {
                    if (n % i === 0) {
                        return false;
                    }
                }
            }

            return true;
        }

    },

    isOdd: function(n) {
        return n % 2 === 1;
    },

    isEven: function(n) {
        return n % 2 === 0;
    },

    getOddComposite: function(min, max) {
        if (min === undefined) {
            min = 0;
        }

        if (max === undefined) {
            max = 100;
        }

        var oddComposites = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55];
        oddComposites = oddComposites.concat([57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99]);

        var result = -1;
        while (result < min || result > max) {
            result = oddComposites[KhanUtil.rand(oddComposites.length)];
        }
        return result;
    },

    getEvenComposite: function(min, max) {
        if (min === undefined) {
            min = 0;
        }

        if (max === undefined) {
            max = 100;
        }

        var evenComposites = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26];
        evenComposites = evenComposites.concat([28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48]);
        evenComposites = evenComposites.concat([50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72]);
        evenComposites = evenComposites.concat([74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98]);

        var result = -1;
        while (result < min || result > max) {
            result = evenComposites[KhanUtil.rand(evenComposites.length)];
        }
        return result;
    },

    getComposite: function() {
        if (KhanUtil.randRange(0, 1)) {
            return KhanUtil.getEvenComposite();
        } else {
            return KhanUtil.getOddComposite();
        }
    },

    getPrimeFactorization: function(number) {
        if (number === 1) {
            return [];
        } else if (KhanUtil.isPrime(number)) {
            return [number];
        }

        var maxf = Math.sqrt(number);
        for (var f = 2; f <= maxf; f++) {
            if (number % f === 0) {
                return $.merge(KhanUtil.getPrimeFactorization(f), KhanUtil.getPrimeFactorization(number / f));
            }
        }
    },

    getFactors: function(number) {
        var factors = [],
            ins = function(n) {
                if (_(factors).indexOf(n) === -1) {
                    factors.push(n);
                }
            };

        var maxf2 = number;
        for (var f = 1; f * f <= maxf2; f++) {
            if (number % f === 0) {
                ins(f);
                ins(number / f);
            }
        }
        return KhanUtil.sortNumbers(factors);
    },

    // Get a random factor of a composite number which is not 1 or that number
    getNontrivialFactor: function(number) {
        var factors = KhanUtil.getFactors(number);
        return factors[KhanUtil.randRange(1, factors.length - 2)];
    },

    getMultiples: function(number, upperLimit) {
        var multiples = [];
        for (var i = 1; i * number <= upperLimit; i++) {
            multiples.push(i * number);
        }
        return multiples;
    },

    // splitRadical(24) gives [2, 6] to mean 2 sqrt(6)
    splitRadical: function(n) {
        if (n === 0) {
            return [0, 1];
        }

        var coefficient = 1;
        var radical = n;

        for (var i = 2; i * i <= n; i++) {
            while (radical % (i * i) === 0) {
                radical /= i * i;
                coefficient *= i;
            }
        }

        return [coefficient, radical];
    },

    // splitCube(24) gives [2, 3] to mean 2 cube_root(3)
    splitCube: function(n) {
        if (n === 0) {
            return [0, 1];
        }

        var coefficient = 1;
        var radical = n;

        for (var i = 2; i * i * i <= n; i++) {
            while (radical % (i * i * i) === 0) {
                radical /= i * i * i;
                coefficient *= i;
            }
        }

        return [coefficient, radical];
    },

    // randRange(min, max) - Get a random integer between min and max, inclusive
    // randRange(min, max, count) - Get count random integers
    // randRange(min, max, rows, cols) - Get a rows x cols matrix of random integers
    // randRange(min, max, x, y, z) - You get the point...
    randRange: function(min, max) {
        var dimensions = [].slice.call(arguments, 2);

        if (dimensions.length === 0) {
            return Math.floor(KhanUtil.rand(max - min + 1)) + min;
        } else {
            var args = [min, max].concat(dimensions.slice(1));
            return $.map(new Array(dimensions[0]), function() {
                return [KhanUtil.randRange.apply(null, args)];
            });
        }
    },

    // Get an array of unique random numbers between min and max
    randRangeUnique: function(min, max, count) {
        if (count == null) {
            return KhanUtil.randRange(min, max);
        } else {
            var toReturn = [];
            for (var i = min; i <= max; i++) {
                toReturn.push(i);
            }

            return KhanUtil.shuffle(toReturn, count);
        }
    },

    // Get an array of unique random numbers between min and max,
    // that ensures that none of the integers in the array are 0.
    randRangeUniqueNonZero: function(min, max, count) {
        if (count == null) {
            return KhanUtil.randRangeNonZero(min, max);
        } else {
            var toReturn = [];
            for (var i = min; i <= max; i++) {
                if (i === 0) {
                    continue;
                }
                toReturn.push(i);
            }

            return KhanUtil.shuffle(toReturn, count);
        }
    },

    // Get a random integer between min and max with a perc chance of hitting
    // target (which is assumed to be in the range, but it doesn't have to be).
    randRangeWeighted: function(min, max, target, perc) {
        if (KhanUtil.random() < perc || (target === min && target === max)) {
            return target;
        } else {
            return KhanUtil.randRangeExclude(min, max, [target]);
        }
    },

    // Get a random integer between min and max that is never any of the values
    // in the excludes array.
    randRangeExclude: function(min, max, excludes) {
        var result;

        do {
            result = KhanUtil.randRange(min, max);
        } while (_(excludes).indexOf(result) !== -1);

        return result;
    },

    // Get a random integer between min and max with a perc chance of hitting
    // target (which is assumed to be in the range, but it doesn't have to be).
    // It never returns any of the values in the excludes array.
    randRangeWeightedExclude: function(min, max, target, perc, excludes) {
        var result;

        do {
            result = KhanUtil.randRangeWeighted(min, max, target, perc);
        } while (_(excludes).indexOf(result) !== -1);

        return result;
    },

    // From limits_1
    randRangeNonZero: function(min, max) {
        return KhanUtil.randRangeExclude(min, max, [0]);
    },

    // Returns a random member of the given array
    // If a count is passed, it gives an array of random members of the given array
    randFromArray: function(arr, count) {
        if (count == null) {
            return arr[KhanUtil.rand(arr.length)];
        } else {
            return $.map(new Array(count), function() {
                return KhanUtil.randFromArray(arr);
            });
        }
    },

    // Returns a random member of the given array that is never any of the values
    // in the excludes array.
    randFromArrayExclude: function(arr, excludes) {
        var cleanArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (_(excludes).indexOf(arr[i]) === -1) {
                cleanArr.push(arr[i]);
            }
        }
        return KhanUtil.randFromArray(cleanArr);
    },

    // Round a number to the nearest increment
    // E.g., if increment = 30 and num = 40, return 30. if increment = 30 and num = 45, return 60.
    roundToNearest: function(increment, num) {
        return Math.round(num / increment) * increment;
    },

    // Round a number to a certain number of decimal places
    roundTo: function(precision, num) {
        var factor = Math.pow(10, precision).toFixed(5);
        return Math.round((num * factor).toFixed(5)) / factor;
    },

    /**
     * Return a string of num rounded to a fixed precision decimal places,
     * with an approx symbol if num had to be rounded, and trailing 0s
     */
    toFixedApprox: function(num, precision) {
        // TODO(jack): Make this locale-dependent like
        // KhanUtil.localeToFixed
        var fixedStr = num.toFixed(precision);
        if (knumber.equal(+fixedStr, num)) {
            return fixedStr;
        } else {
            return "\\approx " + fixedStr;
        }
    },

    /**
     * Return a string of num rounded to precision decimal places, with an
     * approx symbol if num had to be rounded, but no trailing 0s if it was
     * not rounded.
     */
    roundToApprox: function(num, precision) {
        var fixed = KhanUtil.roundTo(precision, num);
        if (knumber.equal(fixed, num)) {
            return String(fixed);
        } else {
            return KhanUtil.toFixedApprox(num, precision);
        }
    },

    floorTo: function(precision, num) {
        var factor = Math.pow(10, precision).toFixed(5);
        return Math.floor((num * factor).toFixed(5)) / factor;
    },

    ceilTo: function(precision, num) {
        var factor = Math.pow(10, precision).toFixed(5);
        return Math.ceil((num * factor).toFixed(5)) / factor;
    },

    // toFraction(4/8) => [1, 2]
    // toFraction(0.666) => [333, 500]
    // toFraction(0.666, 0.001) => [2, 3]
    //
    // tolerance can't be bigger than 1, sorry
    toFraction: function(decimal, tolerance) {
        if (tolerance == null) {
            tolerance = Math.pow(2, -46);
        }

        if (decimal < 0 || decimal > 1) {
            var fract = decimal % 1;
            fract += (fract < 0 ? 1 : 0);

            var nd = KhanUtil.toFraction(fract, tolerance);
            nd[0] += Math.round(decimal - fract) * nd[1];
            return nd;
        } else if (Math.abs(Math.round(Number(decimal)) - decimal) <= tolerance) {
            return [Math.round(decimal), 1];
        } else {
            var loN = 0, loD = 1, hiN = 1, hiD = 1, midN = 1, midD = 2;

            while (1) {
                if (Math.abs(Number(midN / midD) - decimal) <= tolerance) {
                    return [midN, midD];
                } else if (midN / midD < decimal) {
                    loN = midN;
                    loD = midD;
                } else {
                    hiN = midN;
                    hiD = midD;
                }

                midN = loN + hiN;
                midD = loD + hiD;
            }
        }
    },

    // Returns the format (string) of a given numeric string
    // Note: purposively more inclusive than answer-types' predicate.forms
    // That is, it is not necessarily true that interpreted input are numeric
    getNumericFormat: function(text) {
        text = $.trim(text);
        text = text.replace(/\u2212/, "-").replace(/([+-])\s+/g, "$1");
        if (text.match(/^[+-]?\d+$/)) {
            return "integer";
        } else if (text.match(/^[+-]?\d+\s+\d+\s*\/\s*\d+$/)) {
            return "mixed";
        }
        var fraction = text.match(/^[+-]?(\d+)\s*\/\s*(\d+)$/);
        if (fraction) {
            return parseFloat(fraction[1]) > parseFloat(fraction[2]) ?
                    "improper" : "proper";
        } else if (text.replace(/[,. ]/g, "").match(/^\d+$/)) {
            return "decimal";
        } else if (text.match(/(pi?|\u03c0|t(?:au)?|\u03c4|pau)/)) {
            return "pi";
        } else {
            return null;
        }
    },


    // Returns a string of the number in a specified format
    toNumericString: function(number, format) {
        if (number == null) {
            return "";
        } else if (number === 0) {
            return "0"; // otherwise it might end up as 0% or 0pi
        }

        if (format === "percent") {
            return number * 100 + "%";
        }

        if (format === "pi") {
            var fraction = knumber.toFraction(number / Math.PI);
            var numerator = Math.abs(fraction[0]), denominator = fraction[1];
            if (knumber.isInteger(numerator)) {
                var sign = number < 0 ? "-" : "";
                var pi = "\u03C0";
                return sign + (numerator === 1 ? "" : numerator) + pi +
                    (denominator === 1 ? "" : "/" + denominator);
            }
        }

        if (_(["proper", "improper", "mixed", "fraction"]).contains(format)) {
            var fraction = knumber.toFraction(number);
            var numerator = Math.abs(fraction[0]), denominator = fraction[1];
            var sign = number < 0 ? "-" : "";
            if (denominator === 1) {
                return sign + numerator; // for integers, irrational, d > 1000
            } else if (format === "mixed") {
                var modulus = numerator % denominator;
                var integer = (numerator - modulus) / denominator;
                return sign + (integer ? integer + " " : "") +
                        modulus + "/" + denominator;
            } // otherwise proper, improper, or fraction
            return sign + numerator + "/" + denominator;
        }

        // otherwise (decimal, float, long long)
        return String(number);
    },

    // Shuffle an array using a Fischer-Yates shuffle
    // If count is passed, returns an random sublist of that size
    shuffle: function(array, count) {
        array = [].slice.call(array, 0);
        var beginning = typeof count === "undefined" || count > array.length ? 0 : array.length - count;

        for (var top = array.length; top > beginning; top--) {
            var newEnd = Math.floor(KhanUtil.random() * top),
                tmp = array[newEnd];

            array[newEnd] = array[top - 1];
            array[top - 1] = tmp;
        }

        return array.slice(beginning);
    },

    sortNumbers: function(array) {
        return array.slice(0).sort(function(a, b) {
            return a - b;
        });
    },

    // From limits_1
    truncate_to_max: function(num, digits) {
        return parseFloat(num.toFixed(digits));
    },

    // Checks if a number or string representation thereof is an integer
    isInt: function(num) {
        return parseFloat(num) === parseInt(num, 10) && !isNaN(num);
    },


    /**
     * Add LaTeX color markup to a given value.
     */
    colorMarkup: function(val, color) {
        return "\\color{" + color + "}{" + val + "}";
    },

    /**
     * Like _.contains except using _.isEqual to verify if item is present.
     * (Works for lists of non-primitive values.)
     */
    contains: function(list, item) {
        return _.any(list, function(elem) {
            if (_.isEqual(item, elem)) {
                return true;
            }
            return false;
        });
    },

    BLUE: "#6495ED",
    ORANGE: "#FFA500",
    PINK: "#FF00AF",
    GREEN: "#28AE7B",
    PURPLE: "#9D38BD",
    RED: "#DF0030",
    GRAY: "gray",
    BLACK: "black",
    LIGHT_BLUE: "#9AB8ED",
    LIGHT_ORANGE: "#EDD19B",
    LIGHT_PINK: "#ED9BD3",
    LIGHT_GREEN: "#9BEDCE",
    LIGHT_PURPLE: "#DA9BED",
    LIGHT_RED: "#ED9AAC",
    LIGHT_GRAY: "#ED9B9B",
    LIGHT_BLACK: "#ED9B9B",
    GRAY10: "#D6D6D6",
    GRAY20: "#CDCDCD",
    GRAY30: "#B3B3B3",
    GRAY40: "#9A9A9A",
    GRAY50: "#808080",
    GRAY60: "#666666",
    GRAY70: "#4D4D4D",
    GRAY80: "#333333",
    GRAY90: "#1A1A1A",
    BLUE_A: "#C7E9F1",
    BLUE_B: "#9CDCEB",
    BLUE_C: "#58C4DD",
    BLUE_D: "#29ABCA",
    BLUE_E: "#1C758A",
    TEAL_A: "#ACEAD7",
    TEAL_B: "#76DDC0",
    TEAL_C: "#5CD0B3",
    TEAL_D: "#55C1A7",
    TEAL_E: "#49A88F",
    GREEN_A: "#C9E2AE",
    GREEN_B: "#A6CF8C",
    GREEN_C: "#83C167",
    GREEN_D: "#77B05D",
    GREEN_E: "#699C52",
    GOLD_A: "#F7C797",
    GOLD_B: "#F9B775",
    GOLD_C: "#F0AC5F",
    GOLD_D: "#E1A158",
    GOLD_E: "#C78D46",
    RED_A: "#F7A1A3",
    RED_B: "#FF8080",
    RED_C: "#FC6255",
    RED_D: "#E65A4C",
    RED_E: "#CF5044",
    MAROON_A: "#ECABC1",
    MAROON_B: "#EC92AB",
    MAROON_C: "#C55F73",
    MAROON_D: "#A24D61",
    MAROON_E: "#94424F",
    PURPLE_A: "#CAA3E8",
    PURPLE_B: "#B189C6",
    PURPLE_C: "#9A72AC",
    PURPLE_D: "#715582",
    PURPLE_E: "#644172",
    MINT_A: "#F5F9E8",
    MINT_B: "#EDF2DF",
    MINT_C: "#E0E5CC",
    GRAY_A: "#FDFDFD",
    GRAY_B: "#F7F7F7",
    GRAY_C: "#EEEEEE",
    GRAY_D: "#DDDDDD",
    GRAY_E: "#CCCCCC",
    GRAY_F: "#AAAAAA",
    GRAY_G: "#999999",
    GRAY_H: "#555555",
    GRAY_I: "#333333",
    KA_BLUE: "#314453",
    KA_GREEN: "#639B24",
    // Don't actually use _BACKGROUND! Make things transparent instead. The
    // background color used in exercises is subject to change at the whim
    // of fickle designers.
    _BACKGROUND: "#FDFDFD"  // TODO(eater): Get rid of this altogether.
});

$.extend(KhanUtil, {

    expr: function(expr, compute) {
        if (typeof expr === "object") {
            var op = expr[0],
                args = expr.slice(1),
                table = compute ? KhanUtil.computeOperators : KhanUtil.formatOperators;

            return table[op].apply(this, args);
        } else {
            return compute ? expr : expr.toString();
        }
    },

    exprType: function(expr) {

        if (typeof expr === "object") {
            if (expr[0] === "color") {
                return KhanUtil.exprType(expr[2]);
            }

            return expr[0];

        } else {

            return typeof(expr);

        }
    },

    // Do I start with a minus sign?
    exprIsNegated: function(expr) {
        switch (KhanUtil.exprType(expr)) {
            case "color":
            return KhanUtil.exprIsNegated(expr[2]);

            case "/":
            return KhanUtil.exprIsNegated(expr[1]);

            case "+":
            case "-":
            return true;

            case "number":
            return expr < 0;

            case "string":
            return expr.charAt(0) === "-";

            default:
            // case "*":
            return false;
        }
    },

    // Mostly, is it okay to add a coefficient to me without adding parens?
    exprIsShort: function(expr) {
        switch (KhanUtil.exprType(expr)) {
            case "color":
            return KhanUtil.exprIsShort(expr[2]);

            case "+":
            case "-":
            case "*":
            case "/":
            case "frac":
            return false;

            case "^":
            return KhanUtil.exprType(expr[1]) !== "number" || expr[1] < 0;

            case "number":
            case "sqrt":
            return true;

            default:
            return expr.length <= 1;
        }
    },

    exprParenthesize: function(expr) {
        return KhanUtil.exprIsShort(expr) ?
            KhanUtil.expr(expr) :
            "(" + KhanUtil.expr(expr) + ")";
    },

    formatOperators: {
        "color": function(color, arg) {

            // Arguments should look like ["blue", [...]]
            return "\\color{" + color + "}{" + KhanUtil.expr(arg) + "}";
        },

        "+": function() {
            var args = [].slice.call(arguments, 0);
            var terms = $.grep(args, function(term, i) {
                return term != null;
            });

            // Remove terms that evaluate to 0
            terms = _.filter(terms, function(term) {
                return "" + KhanUtil.expr(term) !== "0";
            });

            terms = $.map(terms, function(term, i) {
                var parenthesize;
                switch (KhanUtil.exprType(term)) {
                    case "+":
                    parenthesize = true;
                    break;

                    case "-":
                    parenthesize = (term.length > 2);
                    break;

                    default:
                    // case "*":
                    // case "/":
                    // case "^":
                    parenthesize = false;
                }

                term = KhanUtil.expr(term);

                if (parenthesize) {
                    term = "(" + term + ")";
                }

                if (term.charAt(0) !== "-" || parenthesize) {
                    term = "+" + term;
                }

                return term;
            });

            var joined = terms.join("");

            if (joined.charAt(0) === "+") {
                return joined.slice(1);
            } else {
                return joined;
            }
        },

        "-": function() {
            if (arguments.length === 1) {
                return KhanUtil.expr(["*", -1, arguments[0]]);
            } else {
                var args = [].slice.call(arguments, 0);
                var terms = $.map(args, function(term, i) {
                    var negate = KhanUtil.exprIsNegated(term);
                    var parenthesize;
                    switch (KhanUtil.exprType(term)) {
                        case "+":
                        case "-":
                        parenthesize = true;
                        break;

                        default:
                        // case "*":
                        // case "/":
                        // case "^":
                        parenthesize = false;
                    }

                    term = KhanUtil.expr(term);

                    if ((negate && i > 0) || parenthesize) {
                        term = "(" + term + ")";
                    }

                    return term;
                });

                var joined = terms.join("-");

                return joined;
            }
        },

        "*": function() {
            var rest = Array.prototype.slice.call(arguments, 1);
            rest.unshift("*");

            // If we're multiplying by 1, ignore it, unless we have ["*", 1] and
            // should return 1
            if (arguments[0] === 0) {
                return 0;
            } else if (arguments[0] === 1 && rest.length > 1) {
                return KhanUtil.expr(rest);
            } else if (arguments[0] === -1 && rest.length > 1) {
                var form = KhanUtil.expr(rest);
                if (KhanUtil.exprIsNegated(rest[1])) {
                    return "-(" + form + ")";
                } else {
                    return "-" + form;
                }
            }

            if (arguments.length > 1) {
                var args = [].slice.call(arguments, 0);
                var parenthesizeRest = KhanUtil.exprType(arguments[0]) === "number" &&
                    KhanUtil.exprType(arguments[1]) === "number";
                var factors = $.map(args, function(factor, i) {
                    var parenthesize;
                    switch (KhanUtil.exprType(factor)) {
                        case "number":
                        if (i > 0) {
                            parenthesize = true;
                        }
                        break;

                        default:
                        parenthesize = !KhanUtil.exprIsShort(factor);
                        break;
                    }

                    parenthesizeRest = parenthesizeRest || parenthesize;
                    factor = KhanUtil.expr(factor);

                    if (parenthesizeRest) {
                        factor = "(" + factor + ")";
                    }

                    return factor;
                });

                return factors.join("");
            } else {
                return KhanUtil.expr(arguments[0]);
            }
        },

        "times": function(left, right) {
            var parenthesizeLeft = !KhanUtil.exprIsShort(left);
            var parenthesizeRight = !KhanUtil.exprIsShort(right);

            left = KhanUtil.expr(left);
            right = KhanUtil.expr(right);

            left = parenthesizeLeft ? "(" + left + ")" : left;
            right = parenthesizeRight ? "(" + right + ")" : right;

            return left + " \\times " + right;
        },

        "dot": function(left, right) {
            var parenthesizeLeft = !KhanUtil.exprIsShort(left);
            var parenthesizeRight = !KhanUtil.exprIsShort(right);

            left = KhanUtil.expr(left);
            right = KhanUtil.expr(right);

            left = parenthesizeLeft ? "(" + left + ")" : left;
            right = parenthesizeRight ? "(" + right + ")" : right;

            return left + " \\cdot " + right;
        },

        "/": function(num, den) {
            var parenthesizeNum = !KhanUtil.exprIsShort(num);
            var parenthesizeDen = !KhanUtil.exprIsShort(den);

            num = KhanUtil.expr(num);
            den = KhanUtil.expr(den);

            num = parenthesizeNum ? "(" + num + ")" : num;
            den = parenthesizeDen ? "(" + den + ")" : den;

            return num + "/" + den;
        },

        "frac": function(num, den) {
            return "\\dfrac{" + KhanUtil.expr(num) + "}{" +
                KhanUtil.expr(den) + "}";
        },

        "^": function(base, pow) {
            if (pow === 0) {
                return "";
            } else if (pow === 1) {
                return KhanUtil.expr(base);
            }

            var parenthesizeBase, trigFunction;
            switch (KhanUtil.exprType(base)) {
                case "+":
                case "-":
                case "*":
                case "/":
                case "^":
                case "ln":
                parenthesizeBase = true;
                break;

                case "number":
                parenthesizeBase = base < 0;
                break;

                case "sin":
                case "cos":
                case "tan":
                case "csc":
                case "sec":
                case "cot":
                parenthesizeBase = false;
                trigFunction = true;
                break;

                default:
                parenthesizeBase = false;
                trigFunction = false;
            }

            base = KhanUtil.expr(base);
            if (parenthesizeBase) {
                base = "(" + base + ")";
            }

            pow = KhanUtil.expr(pow);

            if (trigFunction) {
                return base.replace(/\\(\S+?)\{/, function(match, word) {
                    return "\\" + word + "^{" + pow + "} {";
                });
            } else {
                return base + "^{" + pow + "}";
            }
        },

        "sqrt": function(arg) {
            return "\\sqrt{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "sin": function(arg) {
            return "\\sin{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "cos": function(arg) {
            return "\\cos{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "tan": function(arg) {
            return "\\tan{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "sec": function(arg) {
            return "\\sec{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "csc": function(arg) {
            return "\\sec{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "cot": function(arg) {
            return "\\sec{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "ln": function(arg) {
            return "\\ln{" + KhanUtil.exprParenthesize(arg) + "}";
        },

        "+-": function() {
            if (arguments.length === 1) {
                return "\\pm " + KhanUtil.exprParenthesize(arguments[0]);
            } else {
                var args = [].slice.call(arguments, 0);
                return $.map(args, function(term, i) {
                    return KhanUtil.expr(term);
                }).join(" \\pm ");
            }
        }
    },

    computeOperators: {
        "color": function(color, arg) {
            return KhanUtil.expr(arg, true);
        },

        "+": function() {
            var args = [].slice.call(arguments, 0);
            var sum = 0;

            $.each(args, function(i, term) {
                sum += KhanUtil.expr(term, true);
            });

            return sum;
        },

        "-": function() {
            if (arguments.length === 1) {
                return -KhanUtil.expr(arguments[0], true);
            } else {
                var args = [].slice.call(arguments, 0);
                var sum = 0;

                $.each(args, function(i, term) {
                    sum += (i === 0 ? 1 : -1) * KhanUtil.expr(term, true);
                });

                return sum;
            }
        },

        "*": function() {
            var args = [].slice.call(arguments, 0);
            var prod = 1;

            $.each(args, function(i, term) {
                prod *= KhanUtil.expr(term, true);
            });

            return prod;
        },

        "/": function() {
            var args = [].slice.call(arguments, 0);
            var prod = 1;

            $.each(args, function(i, term) {
                var e = KhanUtil.expr(term, true);
                prod *= (i === 0 ? e : 1 / e);
            });

            return prod;
        },

        "^": function(base, pow) {
            return Math.pow(KhanUtil.expr(base, true), KhanUtil.expr(pow, true));
        },

        "sqrt": function(arg) {
            return Math.sqrt(KhanUtil.expr(arg, true));
        },

        "+-": function() {
            return NaN;
        }
    },

    // Remove ["color", ...] tags from an expression
    exprStripColor: function(expr) {
        if (typeof expr !== "object") {
            return expr;
        } else if (expr[0] === "color") {
            return KhanUtil.exprStripColor(expr[2]);
        } else {
            return $.map(expr, function(el, i) {

                // Wrap in an array because $.map flattens the result by one level
                return [(i === 0) ? el : KhanUtil.exprStripColor(el)];
            });
        }
    },

    // simplify an expression by collapsing all the associative
    // operations.  e.g. ["+", ["+", 1, 2], 3] -> ["+", 1, 2, 3]
    exprSimplifyAssociative: function(expr) {
        if (typeof expr !== "object") {
            return expr;
        }

        var simplified = $.map(expr.slice(1), function(x) {
            //encapsulate in a list so $.map unpacks it correctly
            return [KhanUtil.exprSimplifyAssociative(x)];
        });

        var flattenOneLevel = function(e) {
            switch (expr[0]) {
                case "+":
                if (e[0] === "+") {
                    return e.slice(1);
                }
                break;

                case "*":
                if (e[0] === "*") {
                    return e.slice(1);
                }
                break;
            }
            //make sure that we encapsulate e in an array so $'s map
            //does't accidently unpacks e itself.
            return [e];
        };

        //here we actually want the $ behavior of
        //having any lists that flattenOneLevel returns merged into
        //the result
        var ret = $.map(simplified, flattenOneLevel);
        ret.unshift(expr[0]);

        return ret;
    }


});
$.extend(KhanUtil, {
    /* Wraps a number in paretheses if it's negative. */
    negParens: function(n, color) {
        var n2 = color ? "\\" + color + "{" + n + "}" : n;
        return n < 0 ? "(" + n2 + ")" : n2;
    },

    /* Wrapper for `fraction` which takes a decimal instead of a numerator and
     * denominator. */
    decimalFraction: function(num, defraction, reduce, small, parens) {
        var f = KhanUtil.toFraction(num);
        return KhanUtil.fraction(f[0], f[1], defraction, reduce, small, parens);
    },

    reduce: function(n, d) {
        var gcd = KhanUtil.getGCD(n, d);
        n = n / gcd;
        d = d / gcd;
        return [n, d];
    },

    toFractionTex: function(n, dfrac) {
        var f = KhanUtil.toFraction(n);
        if (f[1] === 1) {
            return f[0];
        } else {
            return (n < 0 ? "-" : "") + "\\" + (dfrac ? "d" : "") + "frac{" + Math.abs(f[0]) + "}{" + Math.abs(f[1]) + "}";
        }
    },

    /* Format the latex of the fraction `n`/`d`.
     * - Will use latex's `dfrac` unless `small` is specified as truthy.
     * - Will wrap the fraction in parentheses if necessary (ie, unless the
     * fraction reduces to a positive integer) if `parens` is specified as
     * truthy.
     * - Will reduce the fraction `n`/`d` if `reduce` is specified as truthy.
     * - Will defraction (spit out 0 if `n` is 0, spit out `n` if `d` is 1, or
     * spit out `undefined` if `d` is 0) if `defraction` is specified as
     * truthy. */
    fraction: function(n, d, defraction, reduce, small, parens) {
        var frac = function(n, d) {
            return (small ? "\\frac" : "\\dfrac") + "{" + n + "}{" + d + "}";
        };

        var neg = n * d < 0;
        var sign = neg ? "-" : "";
        n = Math.abs(n);
        d = Math.abs(d);

        if (reduce) {
            var gcd = KhanUtil.getGCD(n, d);
            n = n / gcd;
            d = d / gcd;
        }

        defraction = defraction && (n === 0 || d === 0 || d === 1);
        parens = parens && (!defraction || neg);
        var begin = parens ? "\\left(" : "";
        var end = parens ? "\\right)" : "";

        var main;
        if (defraction) {
            if (n === 0) {
                main = "0";
            } else if (d === 0) {
                main = "\\text{undefined}";
            } else if (d === 1) {
                main = sign + n;
            }
        } else {
            main = sign + frac(n, d);
        }

        return begin + main + end;
    },

    mixedFractionFromImproper: function(n, d, defraction, reduce, small, parens) {
        return KhanUtil.mixedFraction(Math.floor(n / d), n % d, d, defraction, reduce, small, parens);
    },

    /* Format the latex of the mixed fraction 'num n/d"
     * - For negative numbers, if it is a mixed fraction, make sure the whole
     * number portion is negative.  '-5, 2/3' should be 'mixedFraction(-5,2,3)'
     * do not put negative for both whole number and numerator portion.
     * - Will use latex's `dfrac` unless `small` is specified as truthy.
     * - Will wrap the fraction in parentheses if necessary (ie, unless the
     * fraction reduces to a positive integer) if `parens` is specified as
     * truthy.
     * - Will reduce the fraction `n`/`d` if `reduce` is specified as truthy.
     * - Will defraction (spit out 0 if `n` is 0, spit out `n` if `d` is 1, or
     * spit out `undefined` if `d` is 0) if `defraction` is specified as
     * truthy. */
    mixedFraction: function(number, n, d, defraction, reduce, small, parens) {
        var wholeNum = number ? number : 0;
        var numerator = n ? n : 0;
        var denominator = d ? d : 1;

        if (wholeNum < 0 && numerator < 0) {
            throw "NumberFormatException: Both integer portion and fraction cannot both be negative.";
        }
        if (denominator < 0) {
            throw "NumberFormatException: Denominator cannot be be negative.";
        }
        if (denominator === 0) {
            throw "NumberFormatException: Denominator cannot be be 0.";
        }

        if (reduce) {
            if (wholeNum < 0) {
                wholeNum -= Math.floor(numerator / denominator);
            } else {
                wholeNum += Math.floor(numerator / denominator);
            }

            numerator = numerator % denominator;
        }

        if (wholeNum !== 0 && numerator !== 0) {
            return wholeNum + " " + KhanUtil.fraction(n, d, defraction, reduce, small, parens);
        } else if (wholeNum !== 0 && numerator === 0) {
            return wholeNum;
        } else if (wholeNum === 0 && numerator !== 0) {
            return KhanUtil.fraction(n, d, defraction, reduce, small, parens);
        } else {
            return 0;
        }
    },

    /* Calls fraction with the reduce and defraction flag enabled. Additional
     * parameters correspond to the remaining fraction flags. */
    fractionReduce: function(n, d, small, parens) {
        return KhanUtil.fraction(n, d, true, true, small, parens);
    },

    /* Calls fraction with the small flag enabled. Additional parameters
     * correspond to the remaining fraction flags. */
    fractionSmall: function(n, d, defraction, reduce, parens) {
        return KhanUtil.fraction(n, d, defraction, reduce, true, parens);
    },

    /* Interprets a decimal as a multiple of pi and formats it as would be
     * expected.
     *
     * If niceAngle is truthy, it also delivers more natural values for 0 (0 instead
     * of 0 \pi) and 1 (\pi instead of 1 \pi).
     * */
    piFraction: function(num, niceAngle, tolerance, big) {
        if (num.constructor === Number) {
            if (tolerance == null) {
                tolerance = 0.001;
            }

            var f = KhanUtil.toFraction(num / Math.PI, tolerance),
             n = f[0],
             d = f[1];

            if (niceAngle) {
                if (n === 0) {
                    return "0";
                }
                if (n === 1 && d === 1) {
                    return "\\pi";
                }
            }
            var frac = big ? KhanUtil.fraction(n, d) : KhanUtil.fractionSmall(n, d) ;
            return d === 1 ? n + "\\pi" : frac + "\\pi";
        }
    },

    /* Returns whether the fraction n/d reduces. */
    reduces: function(n, d) {
        // if the GCD is greater than 1, then there is a factor in common and the
        // fraction reduces.
        return KhanUtil.getGCD(n, d) > 1;
    },

    fractionSimplification: function(n, d) {
        var result = "\\frac{" + n + "}{" + d + "}";

        if (d <= 1 || KhanUtil.getGCD(n, d) > 1) {
            result += " = " + KhanUtil.fractionReduce(n, d);
        }

        return result;
    },

    // Randomly return the fraction in its mixed or improper form.
    mixedOrImproper: function(n, d) {
        // mixed
        if (n < d || KhanUtil.rand(2) > 0) {
            return KhanUtil.fraction(n, d);

        // improper
        } else {
            var imp = Math.floor(n / d);
            return imp + KhanUtil.fraction(n - (d * imp), d);
        }
    },

    // splitRadical(24) gives [2, 6] to mean 2 sqrt(6)
    splitRadical: function(n) {
        if (n === 0) {
            return [0, 1];
        }

        var coefficient = 1;
        var radical = n;

        for (var i = 2; i * i <= n; i++) {
            while (radical % (i * i) === 0) {
                radical /= i * i;
                coefficient *= i;
            }
        }

        return [coefficient, radical];
    },

    // formattedSquareRootOf(24) gives 2\sqrt{6}
    formattedSquareRootOf: function(n) {
        if (n === 1 || n === 0) {
            /* so as to not return "" or "\\sqrt{0}" later */
            return n.toString();
        } else {
            var split = KhanUtil.splitRadical(n);
            var coefficient = split[0] === 1 ? "" : split[0].toString();
            var radical = split[1] === 1 ? "" : "\\sqrt{" + split[1] + "}";

            return coefficient + radical;
        }
    },

    squareRootCanSimplify: function(n) {
        return KhanUtil.formattedSquareRootOf(n) !== ("\\sqrt{" + n + "}");
    },

    // For numbers 0-20, return the spelling of the number, otherwise
    // just return the number itself as a string.  This is superior to
    // cardinal() in that it can be translated easily.
    cardinalThrough20: function(n) {
        var cardinalUnits = [$._("zero"), $._("one"), $._("two"), $._("three"),
            $._("four"), $._("five"), $._("six"), $._("seven"), $._("eight"),
            $._("nine"), $._("ten"), $._("eleven"), $._("twelve"),
            $._("thirteen"), $._("fourteen"), $._("fifteen"), $._("sixteen"),
            $._("seventeen"), $._("eighteen"), $._("nineteen"), $._("twenty")];
        if (n >= 0 && n <= 20) {
            return cardinalUnits[n];
        }
        return String(n);
    },

    CardinalThrough20: function(n) {
        // NOTE(csilvers): I *think* this always does the right thing,
        // since scripts that capitalize always do so the same way.
        var card = KhanUtil.cardinalThrough20(n);
        return card.charAt(0).toUpperCase() + card.slice(1);
    },

    ordinalThrough20: function(n) {
        var ordinalUnits = [$._("zeroth"), $._("first"), $._("second"),
            $._("third"), $._("fourth"), $._("fifth"), $._("sixth"),
            $._("seventh"), $._("eighth"), $._("ninth"), $._("tenth"),
            $._("eleventh"), $._("twelfth"), $._("thirteenth"),
            $._("fourteenth"), $._("fifteenth"), $._("sixteenth"),
            $._("seventeenth"), $._("eighteenth"), $._("nineteenth"),
            $._("twentieth")];
        if (n >= 0 && n <= 20) {
            return ordinalUnits[n];
        }
        // This should "never" happen, but better to give weird results
        // than to raise an error.  I think.
        return n + "th";
    },

    // Ported from https://github.com/clojure/clojure/blob/master/src/clj/clojure/pprint/cl_format.clj#L285
    // TODO(csilvers): I18N: this doesn't work at all outside English.
    // cf. https://github.com/kslazarev/numbers_and_words (Ruby, sadly).
    cardinal: function(n) {
        var cardinalScales = ["", $._("thousand"), $._("million"),
            $._("billion"), $._("trillion"), $._("quadrillion"),
            $._("quintillion"), $._("sextillion"), $._("septillion"),
            $._("octillion"), $._("nonillion"), $._("decillion"),
            $._("undecillion"), $._("duodecillion"), $._("tredecillion"),
            $._("quattuordecillion"), $._("quindecillion"),
            $._("sexdecillion"), $._("septendecillion"), $._("octodecillion"),
            $._("novemdecillion"), $._("vigintillion")];
        var cardinalUnits = [$._("zero"), $._("one"), $._("two"), $._("three"),
            $._("four"), $._("five"), $._("six"), $._("seven"), $._("eight"),
            $._("nine"), $._("ten"), $._("eleven"), $._("twelve"),
            $._("thirteen"), $._("fourteen"), $._("fifteen"), $._("sixteen"),
            $._("seventeen"), $._("eighteen"), $._("nineteen")];
        var cardinalTens = ["", "", $._("twenty"), $._("thirty"), $._("forty"),
            $._("fifty"), $._("sixty"), $._("seventy"), $._("eighty"),
            $._("ninety")];
        // For formatting numbers less than 1000
        var smallNumberWords = function(n) {
            var hundredDigit = Math.floor(n / 100);
            var rest = n % 100;
            var str = "";

            if (hundredDigit) {
                str += $._("%(unit)s hundred",
                    {unit: cardinalUnits[hundredDigit]});
            }

            if (hundredDigit && rest) {
                str += " ";
            }

            if (rest) {
                if (rest < 20) {
                    str += cardinalUnits[rest];
                } else {
                    var tenDigit = Math.floor(rest / 10);
                    var unitDigit = rest % 10;

                    if (tenDigit) {
                        str += cardinalTens[tenDigit];
                    }

                    if (tenDigit && unitDigit) {
                        str += "-";
                    }

                    if (unitDigit) {
                        str += cardinalUnits[unitDigit];
                    }
                }
            }

            return str;
        };

        if (n === 0) {
            return $._("zero");
        } else {
            var neg = false;
            if (n < 0) {
                neg = true;
                n = Math.abs(n);
            }

            var words = [];
            var scale = 0;
            while (n > 0) {
                var end = n % 1000;

                if (end > 0) {
                    if (scale > 0) {
                        words.unshift(cardinalScales[scale]);
                    }

                    words.unshift(smallNumberWords(end));
                }

                n = Math.floor(n / 1000);
                scale += 1;
            }

            if (neg) {
                words.unshift($._("negative"));
            }

            return words.join(" ");
        }
    },

    Cardinal: function(n) {
        var card = KhanUtil.cardinal(n);
        return card.charAt(0).toUpperCase() + card.slice(1);
    },

    // Depends on expressions.js for expression formatting
    // Returns a string with the expression for the formatted roots of the quadratic
    // with coefficients a, b, c
    // i.e. "x = \pm 3", "
    quadraticRoots: function(a, b, c) {
        var underRadical = KhanUtil.splitRadical(b * b - 4 * a * c);
        var rootString = "x =";

        if ((b * b - 4 * a * c) === 0) {
            // 0 under the radical
            rootString += KhanUtil.fraction(-b, 2 * a, true, true, true);
        } else if (underRadical[1] === 1) {
            // The absolute value of the number under the radical is a perfect square
            rootString += KhanUtil.fraction(-b + underRadical[0], 2 * a, true, true, true) + "," +
                KhanUtil.fraction(-b - underRadical[0], 2 * a, true, true, true);
        } else if (underRadical[0] === 1) {
            // The number under the radical cannot be simplified
            rootString += KhanUtil.expr(["frac", ["+-", -b, ["sqrt", underRadical[1]]], 2 * a]);
        } else {
            // under the radical can be partially simplified
            var divisor = KhanUtil.getGCD(b, 2 * a, underRadical[0]);

            if (divisor === Math.abs(2 * a)) {
                rootString += KhanUtil.expr(["+-", -b / (2 * a), ["*", underRadical[0] / divisor,
                                                                 ["sqrt", underRadical[1]]]]);
            } else {
                rootString += KhanUtil.expr(["frac", ["+-", -b / divisor, ["*", underRadical[0] / divisor,
                                                                                ["sqrt", underRadical[1]]]],
                                                     2 * a / divisor]);
            }
        }
        return rootString;
    },

    // Thanks to Ghostoy on http://stackoverflow.com/questions/6784894/commafy/6786040#6786040
    commafy: function(num) {
        var str = num.toString().split(".");
        var thousands = icu.getDecimalFormatSymbols().grouping_separator;
        var decimal = icu.getDecimalFormatSymbols().decimal_separator;

        // Note that this is not actually the space character. You can find
        // this character in the icu.XX.js files that use space separators (for
        // example, icu.fr.js)
        if (thousands === " ") {
            thousands = "\\;";
        }

        if (str[0].length >= 5) {
            str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g,
                                    "$1{" + thousands + "}");
        }

        if (str[1] && str[1].length >= 5) {
            str[1] = str[1].replace(/(\d{3})(?=\d)/g, "$1\\;");
        }

        return str.join(decimal);
    },

    // Formats strings like "Axy + By + Cz + D" where A, B, and C are variables
    // initialized to unknown values. Formats things so that TeX takes care of
    // negatives, and also handles cases where the strings beind added are wrapped
    // in TeX color declarations (\color{blue}{Axy} to \color{blue}{xy} if A is 1,
    // and won't be inserted at all if A is 0). Also <code><var>plus(A, B, C)
    // </var></code> is cleaner than <code><var>A</var> + <var>B</var> + <var>C</var></code>.
    // Note: this is somewhat treading on the territory of expressions.js, but has
    // a slightly different use case.
    plus: function() {

        var args = [], s;

        for (var i = 0; i < arguments.length; i++) {
            s = KhanUtil._plusTrim(arguments[i]);
            if (s) {
                args.push(s);
            }
        }

        return args.length > 0 ? args.join(" + ") : "0";
    },

    _plusTrim: function(s) {

        if (typeof s === "string" && isNaN(s)) {

            // extract color, so we can handle stripping the 1 out of \color{blue}{1xy}
            if (s.indexOf("{") !== -1) {

                // we're expecting something like "\color{blue}{-1}..."
                var l = s.indexOf("{", s.indexOf("{") + 1) + 1;
                var r = s.indexOf("}", s.indexOf("}") + 1);

                // if we've encountered \color{blue}{1}\color{xy} somehow
                if (l !== s.lastIndexOf("{") + 1 && +KhanUtil._plusTrim(s.slice(l, r)) === 1) {
                    if (s.indexOf("\\") !== -1) {
                        return s.slice(0, s.indexOf("\\")) + s.slice(r + 1);
                    } else {
                        return s.slice(r + 1);
                    }
                }

                return s.slice(0, l) + KhanUtil._plusTrim(s.slice(l, r)) + s.slice(r);
            }

            if (s.indexOf("1") === 0 && isNaN(s[1])) {
                return s.slice(1);
            } else if (s.indexOf("-1") === 0 && isNaN(s[2])) {
                return "-" + s.slice(2);
            } else if (s.indexOf("0") === 0 || s.indexOf("-0") === 0) {
                return "";
            } else {
                return s;
            }

        } else if (typeof s === "number") {

            // we'll just return the number, but this will actually end up getting
            // rid of 0's since a returned 0 will be falsey.
            return s;

            // if we're dealing with a string that looks like a number
        } else if (!isNaN(s)) {

            return +s;

        }

    },

    randVar: function() {
        // NOTE(jeresig): i18n: I assume it's OK to have roman letters here
        return KhanUtil.randFromArray(["a", "k", "n", "p", "q", "r", "t", "x", "y", "z"]);
    },

    eulerFormExponent: function(angle) {
        var fraction = KhanUtil.toFraction(angle / Math.PI, 0.001);
        var numerator = fraction[0], denominator = fraction[1];
        var eExp = ((numerator > 1) ? numerator : "") + "\\pi i";
        if (denominator !== 1) {
            eExp += " / " + denominator;
        }
        return eExp;
    },

    // Formats a complex number in polar form.
    polarForm: function(radius, angle, useEulerForm) {
        var fraction = KhanUtil.toFraction(angle / Math.PI, 0.001);
        var numerator = fraction[0];

        var equation;
        if (useEulerForm) {
            if (numerator > 0) {
                var ePower = KhanUtil.expr(["^", "e", KhanUtil.eulerFormExponent(angle)]);
                equation = ((radius > 1) ? radius : "") + " " + ePower;
            } else {
                equation = radius;
            }
        } else {
            if (angle === 0) {
                equation = radius;
            } else {
                var angleRep = KhanUtil.piFraction(angle, true);
                var cis = "\\cos \\left(" + angleRep + "\\right) + i \\sin \\left(" + angleRep + "\\right)";

                // Special case to circumvent ugly "*1* (sin(...) + i cos(...))"
                if (radius !== 1) {
                    equation = radius + "\\left(" + cis + "\\right)";
                } else {
                    equation = cis;
                }
            }
        }
        return equation;
    },

    coefficient: function(n) {
        if (n === 1 || n === "1") {
            return "";
        } else if (n === -1 || n === "-1") {
            return "-";
        } else {
            return n;
        }
    },

    fractionVariable: function(numerator, denominator, variable) {
        variable = variable || "";

        if (denominator === 0) {
            return "\\text{undefined}";
        }

        if (numerator === 0) {
            return 0;
        }

        if (typeof denominator === "number") {
            if (denominator < 0) {
                numerator *= -1;
                denominator *= -1;
            }

            var GCD = KhanUtil.getGCD(numerator, denominator);
            numerator /= GCD;
            denominator /= GCD;

            if (denominator === 1) {
                return KhanUtil.coefficient(numerator) + variable;
            }
        }

        if (numerator < 0) {
            return "-\\dfrac{" + KhanUtil.coefficient(-numerator) + variable + "}{" + denominator + "}";
        } else {
            return "\\dfrac{" + KhanUtil.coefficient(numerator) + variable + "}{" + denominator + "}";
        }
    },

    complexNumber: function(real, imaginary) {
        if (real === 0 && imaginary === 0) {
            return "0";
        } else if (real === 0) {
            return (KhanUtil.coefficient(imaginary)) + "i";
        } else if (imaginary === 0) {
            return real;
        } else {
            return KhanUtil.expr(["+", real, ["*", imaginary, "i"]]);
        }
    },

    complexFraction: function(real, realDenominator, imag, imagDenominator) {
        var ret = "";
        if (real === 0 && imag === 0) {
            ret = "0";
        }
        if (real !== 0) {
            ret += KhanUtil.fraction(real, realDenominator, false, true);
        }
        if (imag !== 0) {
            if (imag / imagDenominator > 0) {
                if (real !== 0) {
                    ret += " + ";
                }
                ret += KhanUtil.fraction(imag, imagDenominator, false, true) + " i";
            } else {
                imag = Math.abs(imag);
                imagDenominator = Math.abs(imagDenominator);
                ret += " - ";
                ret += KhanUtil.fraction(imag, imagDenominator, false, true) + " i";
            }
        }
        return ret;
    },

    scientificExponent: function(num) {
        return Math.floor(Math.log(Math.abs(num)) / Math.log(10));
    },

    scientificMantissa: function(precision, num) {
        var exponent = KhanUtil.scientificExponent(num);
        var factor = Math.pow(10, exponent);
        precision -= 1; // To account for the 1s digit
        var mantissa = KhanUtil.roundTo(precision, num / factor);
        return mantissa;
    },

    scientific: function(precision, num) {
        var exponent = KhanUtil.scientificExponent(num);
        var mantissa = KhanUtil.localeToFixed(KhanUtil.scientificMantissa(precision, num), precision - 1);
        return "" + mantissa + "\\times 10^{" + exponent + "}";
    }
});

Kh = KhanUtil;
