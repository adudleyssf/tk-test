// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'RESTConnection', "TKServicesModule", "chart.js", "SSFAlerts", 'pascalprecht.translate'])

.run(["$ionicPlatform", "$window", "$state", function($ionicPlatform, $window, $state) {
  $ionicPlatform.ready(function() {

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

    if ($window.localStorage["userID"] !== undefined) {
  
      $ionicHistory.nextViewOptions({
        historyRoot: true,
        disableBack: true
      });
      
      $state.go("lobby");
    }
  });
}])

   
.config(function($translateProvider) {
    $translateProvider
    //Load languages files from path
    .useStaticFilesLoader({
      prefix: 'languages/',
      suffix: '.json'
      
    })
    .registerAvailableLanguageKeys(['en', 'it','ja'], {
   'en_*': 'en',
   'it_*': 'it',
   'ja_*': 'ja'
    })
    .preferredLanguage('en')
    .determinePreferredLanguage();
})



.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: 'templates/landing.html',
      })
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
      })
      .state('lobby', {
        url: '/lobby',
        templateUrl: 'templates/lobby.html',
        controller: 'LobbyCtrl'
      })
      .state('test', {
        abstract: true,
        url: '/test',
        template: '<ion-nav-view></ion-nav-view>'
      })
      .state('test.detail', {
        url: '/question:testID',
        templateUrl: 'templates/question.html',
        controller: 'TestCtrl',
        resolve: {
          testInfo: function($stateParams, TKQuestionsService) {
            return TKQuestionsService.getQuestion($stateParams.testID);
          }
        }
      })
      .state('results', {
        url: '/results',
        templateUrl: 'templates/results.html',
        controller: 'ResultsCtrl'
      })
      .state('history', {
        url: '/history',
        templateUrl: 'templates/history.html',
        controller: 'HistoryCtrl'
      });

  }
])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push(function($rootScope) {
    return {
      request: function(config) {
        $rootScope.$broadcast('loading:show');
        return config;
      },
      response: function(response) {
        $rootScope.$broadcast('loading:hide');
        return response;
      },
      requestError: function(reason) {
        $rootScope.$broadcast('loading:hide');
        return reason;
      },
      responseError: function(response) {
        $rootScope.$broadcast('loading:hide');
        return response;
      }
    };
  });
}])

.run(["$rootScope", "$ionicLoading", function($rootScope, $ionicLoading) {
  $rootScope.$on('loading:show', function() {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  });
  $rootScope.$on('loading:hide', function() {
    $ionicLoading.hide();
  });
}]);