'use strict';

/* App Module */

angular.module('scotland', ['localStorage']).
    config(['$compileProvider' , function ($compileProvider) {
        $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|mailto|app|file):/);
    }]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/intro', {templateUrl: 'intro.html',  controller: IntroCtrl}).
        when('/help', {templateUrl: 'help.html',  controller: HelpCtrl}).
        when('/level/:levelId', {templateUrl: 'level.html', controller: LevelCtrl}).
        when('/levelDone/:levelId/:how', {templateUrl: 'leveldone.html',  controller: LevelDoneCtrl}).
        otherwise({redirectTo: '/intro'});
}]);

var game = {
  "picsCount": 21,
  "showLimit": 2,
  "getEmpty" : function (size) {
      var arr = new Array();
      for (var i = 0; i <= size; i++) {
          arr[i] = {"state": 0};
      }
      return arr;
  }
};

function Tile(num) {
    this.num = num;
    this.uncovered = false;
};

var sndEnabled = true;
try {
    new Audio();
} catch (e) {
    sndEnabled = false;
}
  
function playAudio(what) {
    if (sndEnabled) {
        document.getElementById(what).cloneNode(true).play();
    }
}
