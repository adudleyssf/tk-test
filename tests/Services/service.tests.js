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
 
    beforeEach(module("SortServices"));
    
    //Inject the scope and save it in a variable
   beforeEach(inject(function(sortArrayService) {
         sorty = sortArrayService;
    }));
    // tests start here
    it('Array should be the same', function(){
        var newArray = [9, 1, 4];
       
        var sorted = sorty.sortArray(newArray);
        
        expect(newArray).toEqual(sorted);
    });
});