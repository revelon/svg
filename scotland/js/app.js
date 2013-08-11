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

function Tile(num, x, y) {
    this.num = num;
    this.x = x;
    this.y = y;
    this.uncovered = false;
    
    this.getX = function() {
        return x * 55;
    };
    
    this.getY = function() {
        return y * 55;
    };
    
};
