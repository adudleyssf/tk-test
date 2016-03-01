angular.module('SortServices', [])
    .service('sortArrayService', function() {
        var service = this;
        var sort = [];
        
        var obj = new Object(),
        sorted = array,
        count = swapCount;
        
            
        

        service.sortArray = function(array) {
            /*
            for(var i = 0; i < array.length; i++){		
		        if (array[i] > array [i++]){
		            var temp = array[i];
		            array.push(temp);
		        }
             */
             var stuff = [];
            var swap = false;
            var swapCount = 0;
            do {
                swap = false;
                for (var i = 0; i < array.length; i++) {

                    if (array[i] > array[i++]) {
                        var temp = array[i];
                        var temp2 = array[i++];
                        array[i] = temp2;
                        array[i++] = temp;
                        swap = true;
                        swapCount++;
                        
                    }
                }

            }
            while (swap);
            return array;
            
        };
    });