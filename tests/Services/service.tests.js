/*
describe('Controllers', function() {
    beforeEach(module("SortServices"));

     beforeEach(inject(function() {
         
     }));

    it('Should be sorted', function() {
        expect(SortServices.SortArray(7, 1, 2).toEqual(7, 1, 2)
    });
});

*/

describe('Services', function() {
    var sorty;
    // load the controller's module
    beforeEach(module('ionic'));
    beforeEach(module('starter.controllers'));
    beforeEach(module('RESTConnection'));
    beforeEach(module("SortServices"));
    
    //Inject the scope and save it in a variable
   beforeEach(inject(function(SortArray) {
        var sorty = SortArray;
    }));
    // tests start here
    it('Array should be the same', function(){
        expect(sorty).toEqual();
    });
});