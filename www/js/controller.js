/*global Ionic */

angular.module('starter.controllers', [])
    .controller('LoginCtrl', ['$scope', '$state', 'UserService', '$ionicHistory', '$window', "SSFAlertsService",
        function($scope, $state, UserService, $ionicHistory, $window, SSFAlertsService ) {
            $scope.user = {};
            $scope.title = "Login";
            
            

            var rememberMeValue;
            if ($window.localStorage["rememberMe"] === undefined || $window.localStorage["rememberMe"] == "true") {
                rememberMeValue = true;
            }
            else {
                rememberMeValue = false;
            }

            $scope.checkbox = {
                rememberMe: rememberMeValue
            };
            if ($window.localStorage["username"] !== undefined && rememberMeValue === true) {
                $scope.user.email = $window.localStorage["username"];
            }


            $scope.loginSubmitForm = function(form) {
                if (form.$valid) {
                    UserService.login($scope.user)
                        .then(function(response) {
                            if (response.status === 200) {

                                //Should return a token
                                console.log(response);
                                $window.localStorage["userID"] = response.data.userId;
                                $window.localStorage['token'] = response.data.id;
                                $ionicHistory.nextViewOptions({
                                    historyRoot: true,
                                    disableBack: true
                                });
                                $state.go('lobby');
                                $window.localStorage["rememberMe"] = $scope.checkbox.rememberMe;
                                if ($scope.checkbox.rememberMe) {
                                    $window.localStorage["username"] = $scope.user.email;
                                }
                                else {
                                    delete $window.localStorage["username"];
                                    $scope.user.email = "";
                                }
                                $scope.user.password = "";
                                form.$setPristine();
                            }

                            else if (response.status === 401) {
                                SSFAlertsService.showAlert("SSFALERTS.TITLE", "SSFALERTS.401");
                            }
                            else if (response.data === null) {
                                //If the data is null, it means there is no internet connection.
                                SSFAlertsService.showAlert("SSFALERTS.TITLE", "SSFALERTS.NULL");
                            }
                            else {
                                SSFAlertsService.showAlert("SSFALERTS.TITLE", "SSFALERTS.ELSE");
                            }



                        });

                }
            };


        }

    ])

.controller('RegisterCtrl', ['$scope', '$state', 'UserService', '$ionicHistory', '$window', "SSFAlertsService",
    function($scope, $state, UserService, $ionicHistory, $window, SSFAlertsService) {
        $scope.user = {};
        $scope.comparePassword = {};
        $scope.registerSubmitForm = function(form) {
            if (form.$valid) {
                if ($scope.user.password === $scope.comparePassword.password) {


                    UserService.create($scope.user)
                        .then(function(response) {
                            if (response.status === 200) {
                                loginAfterRegister();
                                form.$setPristine();
                            }
                            else if (response.status === 401) {
                                SSFAlertsService.showAlert("SSFALERTS.TITLE", "SSFALERTS.401");
                            }
                            else if (response.data === null) {
                                //If the data is null, it means there is no internet connection.
                                SSFAlertsService.showAlert("SSFALERTS.TITLE", "SSFALERTS.NULL");
                            }
                            else if (response.status === 422) {
                                SSFAlertsService.showAlert("SSFALERTS.TITLE", "SSFALERTS.EMAIL_USED");
                            }
                            else {
                                SSFAlertsService.showAlert("SSFALERTS.TITLE", "SSFALERTS.INVALID_RESPONSE");
                            }
                        });


                }

            }

            function loginAfterRegister() {
                UserService.login($scope.user)
                    .then(function(response) {
                        if (response.status === 200) {
                            //Should return a token
                            $window.localStorage["userID"] = response.data.userId;
                            $window.localStorage['token'] = response.data.id;
                            $ionicHistory.nextViewOptions({
                                historyRoot: true,
                                disableBack: true
                            });
                            $state.go('lobby');
                        }
                        else {
                            // invalid response
                            $state.go('landing');
                        }
                    }, function(response) {
                        // something went wrong
                        console.log(response);
                        $state.go('landing');
                        resetFields();
                    });

                function resetFields() {
                    $scope.user.email = "";
                    $scope.user.firstName = "";
                    $scope.user.lastName = "";
                    $scope.user.organization = "";
                    $scope.user.password = "";
                    $scope.repeatPassword.password = "";
                }
            }
        };
    }
])

.controller('LobbyCtrl', ['$scope', '$state', '$ionicHistory', 'UserService', '$window', 'ServerQuestionService', 'TKQuestionsService', "TKAnswersService", "SSFAlertsService",
    function($scope, $state, $ionicHistory, UserService, $window, ServerQuestionService, TKQuestionsService, TKAnswersService, SSFAlertsService) {
        TKAnswersService.resetAnswers();
        $scope.logout = function() {
            UserService.logout($window.localStorage.token)
                .then(function(response) {
                    //The successful code for logout is 204
                    if (response.status === 204) {
                        $ionicHistory.nextViewOptions({
                            historyRoot: true,
                            disableBack: true
                        });
                        $state.go('landing');
                    }
                    else {
                        SSFAlertsService.showAlert("SSFALERTS.TITLE", "SSFALERTS.NO_LOGOUT");
                    }
                }, function(response) {
                    SSFAlertsService.showAlert("SSFALERTS.TITLE", "SSFALERTS.NO_LOGOUT");
                });
        };


        if (TKQuestionsService.questionsLength() === 0)
            getQuestions();

        function getQuestions() {
            ServerQuestionService.all($window.localStorage['token'])
                .then(function(response) {
                    if (response.status === 200) {
                        var questions = response.data;
                        TKQuestionsService.setQuestions(questions);
                    }
                    else {
                        // invalid response
                        confirmPrompt();
                    }
                }, function(response) {
                    // something went wrong
                    confirmPrompt();
                });
        }

        function confirmPrompt() {
            SSFAlertsService.showConfirm("SSFCONFIRMS.TITLE", "SSFCONFIRMS.NO_QUESTION")
                .then(function(response) {
                    if (response == true) {
                        getQuestions();
                    }
                });

        }
        $scope.takeTestButtonTapped = function() {
            if (TKQuestionsService.questionsLength() === 0)
                getQuestions();
            else {
                $state.go('test.detail', {
                    testID: 1
                });
            }
        };

    }
])

.controller('TestCtrl', ['$scope', 'testInfo', '$stateParams', '$state', '$window', 'TKAnswersService', 'ServerAnswersService', '$ionicHistory', "TKResultsButtonService", "SSFAlertsService",
    function($scope, testInfo, $stateParams, $state, $window, TKAnswersService, ServerAnswersService, $ionicHistory, TKResultsButtonService, SSFAlertsService) {
        var qNumber = $stateParams.testID;
        $scope.title = "Question #" + qNumber;

        testInfo.forEach(function(infoDict) {
            if (infoDict.Answer_ID === "A")
                $scope.questionA = infoDict;
            if (infoDict.Answer_ID === "B")
                $scope.questionB = infoDict;
        });
        $scope.buttonClicked = function(option) {
            var category = $scope["question" + option].Style;
            TKAnswersService.saveAnswer(qNumber, category, option);

            var nextqNumber = Number(qNumber) + 1;
            if (nextqNumber > 30) {
                performRequest();
            }
            else {
                $state.go('test.detail', {
                    testID: nextqNumber
                });


            }

        };

        function performRequest() {
            var answersDict = angular.copy(TKAnswersService.getAnswers())
            answersDict["userID"] = $window.localStorage['userID'];
            var date = new Date();
            answersDict["createDate"] = date.toUTCString();



            ServerAnswersService.create(answersDict, $window.localStorage["token"])
                .then(function(response) {
                    if (response.status === 200) {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('results');
                    }
                    else {
                        // invalid response
                        confirmPrompt();
                    }
                }, function(response) {
                    // something went wrong
                    confirmPrompt();
                });
        }


        function confirmPrompt() {
            SSFAlertsService.showConfirm("SSFCONFIRMS.TITLE", "SSFCONFIRMS.NO_SAVE")
                .then(function(response) {
                    if (response == true) {
                        performRequest();
                    }
                    else {
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go('results');
                        TKResultsButtonService.setShouldShowMenuButton(true);
                    }
                });
        }


        $scope.$on("$ionicView.beforeEnter", function() {
            var lastQuestionNumber = TKAnswersService.getLastQuestionNumber();
            if (parseInt(qNumber) < lastQuestionNumber) {
                TKAnswersService.setLastQuestionNumber(lastQuestionNumber - 1);
                TKAnswersService.eraseLastAnswer();
            }
            TKAnswersService.setLastQuestionNumber(parseInt(qNumber));
        });



    }
])

.controller('ResultsCtrl', ['$scope', 'TKAnswersService', '$ionicHistory', '$state', "TKResultsButtonService", "$translate",
    function($scope, TKAnswersService, $ionicHistory, $state, TKResultsButtonService, $translate) {
        $scope.shouldShowButton = TKResultsButtonService.getShouldShowMenuButton();
        var answersInfo = TKAnswersService.getAnswers();

        $scope.labelsTranslator = function(Competing, Collaborating, Compromising, Avoiding, Accommodating) {
            $translate([Competing, Collaborating, Compromising, Avoiding, Accommodating])
                .then(function(response) {
                    $scope.realLabels = [response[Competing], response[Collaborating], response[Compromising], response[Avoiding], response[Accommodating]];
                });
        };
        $scope.labelsTranslator("ANSWERS.COMPETING", "ANSWERS.COLLABORATING", "ANSWERS.COMPROMISING", "ANSWERS.AVOIDING", "ANSWERS.ACCOMMODATING");



        $scope.labels = ["Competing", "Collaborating", "Compromising", "Avoiding", "Accommodating"];

        $scope.data = [
            [returnPercentage(answersInfo["competing"]), returnPercentage(answersInfo["collaborating"]),
                returnPercentage(answersInfo["compromising"]), returnPercentage(answersInfo["avoiding"]), returnPercentage(answersInfo["accommodating"])
            ]
        ];

        $scope.options = {
            scaleIntegersOnly: true,
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            scaleOverride: true,
            scaleSteps: 4,
            scaleStepWidth: 25,
            scaleStartValue: 0,
            scaleLabel: "<%=value%>" + "%",
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value.toFixed(0) %>" + "%",
        };
        $scope.colours = [{
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(15,187,25,1)",
            pointColor: "rgba(15,187,25,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,0.8)"
        }];

        function returnPercentage(value) {
            return (value / 12) * 100;

        }

        $scope.menuButtonTapped = function() {
            $ionicHistory.nextViewOptions({
                historyRoot: true,
                disableBack: true
            });




            $state.go('lobby');

        };
    }
])

.controller("HistoryCtrl", ["$scope", "ServerAnswersService", "$window", "$state", "TKAnswersService", "TKResultsButtonService", "SSFAlertsService", "tmhDynamicLocale",
    function($scope, ServerAnswersService, $window, $state, TKAnswersService, TKResultsButtonService, SSFAlertsService, tmhDynamicLocale) {
        $scope.tests = [];
        performRequest();
        
      

        if (typeof navigator.globalization !== "undefined") {
            navigator.globalization.getPreferredLanguage(function(language) {

                tmhDynamicLocale.set((language.value).split("-")[0]);

            }, null);
        }

        function performRequest() {
            ServerAnswersService.all($window.localStorage['userID'], $window.localStorage['token'])
                .then(function(response) {
                    if (response.status === 200) {
                        $scope.tests = response.data;
                    }
                    else {
                        // invalid
                        confirmPrompt();
                    }
                }, function(response) {
                    // something went wrong
                    console.log(response);
                    confirmPrompt();
                });
        }



        function confirmPrompt() {
            SSFAlertsService.showConfirm("SSFCONFIRMS.TITLE", "SSFCONFIRMS.NO_RETRIEVE")
                .then(function(response) {
                    if (response == true) {
                        performRequest();
                    }
                });
        }

        $scope.goToResult = function(test) {
            var answers = {
                "competing": test.competing,
                "collaborating": test.collaborating,
                "compromising": test.compromising,
                "avoiding": test.avoiding,
                "accommodating": test.accommodating
            };
            TKAnswersService.setAnswers(answers);
            TKResultsButtonService.setShouldShowMenuButton(false);
            $state.go('results');
        };

    }
])

.controller('LandingCtrl', ["$ionicPlatform", "$window", "SSFAlertsService", "$ionicLoading", function($ionicPlatform, $window, SSFAlertsService, $ionicLoading) {
      $ionicPlatform.ready(function() {

        var deploy = new Ionic.Deploy();
        deploy.setChannel("dev");

        deploy.check().then(function(hasUpdate) {

            if (hasUpdate) {
            SSFAlertsService.showAlert('New update', 'Starting update');
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner>'
                });

                deploy.update().then(function(res) {
                    //App will automatically reload when updated successfully
                    $ionicLoading.hide();
                    SSFAlertsService.showAlert("update worked", 'Update complete');
                    $window.location.reload(true);
                }, function(err) {
                    SSFAlertsService.showAlert('Update Error', 'Update failed');
                }, function(prog) {
                    //$rootScope.$broadcast('loading:show');
                });
            }
        }, function(err) {
            SSFAlertsService.showAlert('Update error', 'Unable to do upadate.');
        });
    });
}]);
