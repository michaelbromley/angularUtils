/**
 * Created by Michael on 13/03/14.
 */

describe('Perlin noise service', function() {
    var generator;
    var generateLotsOfNoise;

    beforeEach(module('angularUtils.services.noise'));

    beforeEach(inject(function(_noise_) {
        generator = _noise_.newGenerator();

        // generate 10,000 values as a large enough sample to check they fall within the expected bounds.
        generateLotsOfNoise = function(generator) {
            var noiseValues = [];
            for (var i = 0; i < 10000; i ++ ) {
                noiseValues.push(generator.getVal(i));
            }
            return noiseValues;
        };

        jasmine.addMatchers({
            /**
             * Matcher to check that all values in the array fall within the specified range (inclusive of the bounds)
             * @returns {{compare: compare}}
             */
            toAllBeWithinRange: function() {
                return {
                    compare: function(valuesArray, lowerBound, upperBound) {
                        var pass = true;
                        var failingValue = 0;
                        for (var i = 0; i < valuesArray.length; i ++) {
                            if (valuesArray[i] < lowerBound || upperBound < valuesArray[i]) {
                                pass = false;
                                failingValue = valuesArray[i];
                                break;
                            }
                        }

                        var result = {
                            pass: pass
                        };
                        if (!result.pass) {
                            result.message = failingValue + ' is not between ' + lowerBound + ' and ' + upperBound;
                        }
                        return result;
                    }
                };
            },
            /**
             * Matcher to check if at least one of the values in the array lies in the specified range
             * @returns {{compare: compare}}
             */
            toIncludeRange: function() {
                return {
                    compare: function(valuesArray, lowerBound, upperBound) {
                        var pass = false;

                        for (var i = 0; i < valuesArray.length; i ++) {
                            if (valuesArray[i] > lowerBound && upperBound > valuesArray[i]) {
                                pass = true;
                                break;
                            }
                        }

                        var result = {
                            pass: pass
                        };
                        if (!result.pass) {
                            result.message = 'Array has no values between ' + lowerBound + ' and ' + upperBound;
                        }
                        return result;
                    }
                };
            }
        });
    }));

    it('should generate values between 0 and 1 on default settings', function() {
        var noiseValues = generateLotsOfNoise(generator);
        expect(noiseValues).toAllBeWithinRange(0, 1);
    });

    it('should amplify correctly', function() {
        generator.setAmplitude(2);
        var noiseValues = generateLotsOfNoise(generator);

        expect(noiseValues).toAllBeWithinRange(0, 2);
        expect(noiseValues).toIncludeRange(1, 2);
    });
});