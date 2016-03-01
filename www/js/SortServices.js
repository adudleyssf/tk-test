angular.module('SortServices', [])
    .service('sortArrayService', function() {
            var service = this;
            var sort = [];

            service.sortArray = function(array) {
                /*
            for(var i = 0; i < array.length; i++){		
		        if (array[i] > array [i++]){
		            var temp = array[i];
		            array.push(temp);
		        }
            
            
             */
                    var swap = false;
                do {
                    swap = false;
                    for (var i = 0; i < array.length; i++) {

                        if (array[i] > array[i++]) {
                            var temp = array[i];
                            var temp2 = array[i++];
                            array[i] = temp2;
                            array[i++] = temp;
                            swap = true;


                        }
                    }

                }
                while (swap);
                     return array;
                
               



            
        };
    });