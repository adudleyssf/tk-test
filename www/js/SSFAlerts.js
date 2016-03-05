angular.module('SSFAlerts', [])
    .service('SSFAlertsService', ['$ionicPopup', "$q", "$translate", function($ionicPopup, $q, $translate) {
        var service = this;

       service.showAlert = function(title, body) {
            $translate([title, body])
                .then(function(response) {
                    if (navigator.notification === undefined) {
                        var alertPopup = $ionicPopup.alert({
                            title: response[title],
                            template: response[body]
                        });
                        alertPopup.then();
                    }else {
                        navigator.notification.alert(response[body], null, response[title]);
                    }
                });
        };

        service.showConfirm = function(title, body) {
        return   $translate([title, body])
            
                .then(function(response) {
                    if (navigator.notification === undefined) {
                        var confirmPopup = $ionicPopup.confirm({
                            title: response[title],
                            template: response[body]
                        });
                        return confirmPopup;
                    } else {
                        var defer = $q.defer();
                        var confirmCallback = function(buttonIndex) {
                            if (buttonIndex === 1) {
                                defer.resolve(true);
                            } else {
                                defer.resolve(false);
                            }
                        };
                        navigator.notification.confirm(response[body], confirmCallback, response[title]);
                        return defer.promise;
                    }
                });
        };

 }]);