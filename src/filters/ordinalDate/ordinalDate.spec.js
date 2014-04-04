describe('ordinalDate', function() {
    var ordinalDateFilter;
    var timestamp1 = 1384474920000; // 15th November 2013, 00:22:00

    beforeEach(module('angularUtils.filters.ordinalDate'));
    beforeEach (function(){
        inject(function ($injector) {
            ordinalDateFilter = $injector.get('ordinalDateFilter');
        });
    });

    it('should add an ordinal suffix to days of month', function() {
        expect(ordinalDateFilter(timestamp1, 'd')).toEqual('15th');
        expect(ordinalDateFilter(timestamp1, "EEEE 'the' d of MMMM")).toEqual('Friday the 15th of November');
        expect(ordinalDateFilter(timestamp1, "d d")).toEqual('15th 15th');
    });
    it('should add the correct suffix for all possible variations', function() {
        expect(ordinalDateFilter(1383265320000, 'd')).toEqual('1st');
        expect(ordinalDateFilter(1383351720000, 'd')).toEqual('2nd');
        expect(ordinalDateFilter(1383438120000, 'd')).toEqual('3rd');
        expect(ordinalDateFilter(1383524520000, 'd')).toEqual('4th');
        expect(ordinalDateFilter(1384042920000, 'd')).toEqual('10th');
        expect(ordinalDateFilter(1384129320000, 'd')).toEqual('11th');
        expect(ordinalDateFilter(1384215720000, 'd')).toEqual('12th');
        expect(ordinalDateFilter(1384302120000, 'd')).toEqual('13th');
        expect(ordinalDateFilter(1384906920000, 'd')).toEqual('20th');
        expect(ordinalDateFilter(1384993320000, 'd')).toEqual('21st');
        expect(ordinalDateFilter(1385079720000, 'd')).toEqual('22nd');
        expect(ordinalDateFilter(1385079720000, 'd')).toEqual('22nd');
        expect(ordinalDateFilter(1385166120000, 'd')).toEqual('23rd');
        expect(ordinalDateFilter(1385252520000, 'd')).toEqual('24th');
        expect(ordinalDateFilter(1385770920000, 'd')).toEqual('30th');
        expect(ordinalDateFilter(1383178920000, 'd')).toEqual('31st');

    });
    it('should leave the \'dd\' format day alone', function() {
        expect(ordinalDateFilter(timestamp1, "dd/MM/yyyy")).toEqual('15/11/2013');
        expect(ordinalDateFilter(timestamp1, "yyyy-MM-dd")).toEqual('2013-11-15');
        expect(ordinalDateFilter(timestamp1, "'the' d 'day' of MMMM")).toEqual('the 15th day of November');
    });
});