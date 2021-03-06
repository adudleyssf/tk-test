// Ionic Starter App

/* global Ionic*/

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic',  'ionic.service.core',  "ionic.service.analytics", 'starter.controllers', 'RESTConnection', "TKServicesModule", "chart.js", "SSFAlerts", 'pascalprecht.translate', "tmh.dynamicLocale"])

.run(["$ionicPlatform", "$window", "$state", "$ionicAnalytics", "$ionicHistory", function($ionicPlatform, $window, $state, $ionicAnalytics, $ionicHistory) {
  $ionicPlatform.ready(function() {
    Ionic.io();
    $ionicAnalytics.register();



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
    
    /*
      var deploy = new Ionic.Deploy();
  deploy.check().then(function(hasUpdate) {
    console.log('Ionic Deploy: Update available: ' + hasUpdate);
    if(hasUpdate) {
      var deploy = new Ionic.Deploy();
  deploy.update().then(function(res) {
    //App will automatically reload when updated successfully
     console.log('Ionic Deploy: Update Success! ', res);
  }, function(err) {
    console.log('Ionic Deploy: Update error! ', err);
  }, function(prog) {
     console.log('Ionic Deploy: Progress... ', prog);
  });
    }
  }, function(err) {
    console.error('Ionic Deploy: Unable to check for updates', err);
  });
  */
  });
  
}])





.config(function($translateProvider) {
  $translateProvider
  //Load languages files from path
    .useStaticFilesLoader({
      prefix: 'languages/',
      suffix: '.json'

    })
    .registerAvailableLanguageKeys(['en', 'it', 'ja'], {
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
        controller: "LandingCtrl"
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
      })
      .state('navigation', {
        url: '/navigation',
        template: '<ion-view hide-nav-bar="false">' +
          '<ion-nav-buttons></ion-nav-buttons>' +
          '<ion-content class="padding">' +
          '<button class="button button-block button-calm" ng-repeat="nav in navLinks" ui-sref="{{nav}}">{{nav}}</button>' +
          '</ion-content>' +
          '</ion-view>',
        controller: function($state, $scope) {
          var stateArray = $state.get();
          $scope.navLinks = [];
          for (var i in stateArray) {
            if (stateArray[i].name !== '' && stateArray[i].name !== 'navigation' && stateArray[i].name !== 'update') {
              $scope.navLinks.push(stateArray[i].name);
            }
          }
        }
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
}])

.config(function(tmhDynamicLocaleProvider) {
  tmhDynamicLocaleProvider.localeLocationPattern("lib/angular-locale/angular-locale_{{locale}}.js");
})

.config(['$ionicAutoTrackProvider', function($ionicAutoTrackProvider) {
  // Don't track which elements the user clicks on.
  $ionicAutoTrackProvider.disableTracking('Tap');
}]);
