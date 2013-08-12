'use strict';

/* App Module */

angular.module('scotland', ['localStorage', 'viewFilters']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/intro', {templateUrl: 'partials/intro.html',  controller: IntroCtrl}).
      when('/help', {templateUrl: 'partials/help.html',  controller: HelpCtrl}).
      when('/level/:levelId', {templateUrl: 'partials/level.html', controller: LevelCtrl}).
      when('/levelDone/:levelId', {templateUrl: 'partials/leveldone.html',  controller: LevelDoneCtrl}).
      otherwise({redirectTo: '/intro'});
}]);

var game = {
  "picsCount": 24,
  "showLimit": 1,
  "getEmpty" : function (size) {
      var arr = new Array();
      for (var i = 0; i < size; i++) {
          arr[i] = {"state": 0};
      }
      return arr;
  }
};

function Tile(num) {
    this.num = num;
    this.uncovered = false;
};

function playAudio(what) {
  var x = new Audio('sounds/' + what + '.ogg');
  //docement.body.push(x);
  x.play();
}