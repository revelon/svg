'use strict';

/* App Module */

angular.module('minedout', ['levelServices']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/intro', {templateUrl: 'partials/intro.html',  controller: IntroCtrl}).
      when('/outro', {templateUrl: 'partials/outro.html',  controller: OutroCtrl}).
      when('/help', {templateUrl: 'partials/help.html',  controller: HelpCtrl}).
      when('/level/:levelId', {templateUrl: 'partials/level.html', controller: LevelCtrl}).
      otherwise({redirectTo: '/intro'});
}]);

var Def = {
    FREE: 0,
    MINE : 1,
    FENCE : 2
}

function Tile(content) {
    this.mine = content;
    this.visited = false;
}
