'use strict';

/* App Module */

angular.module('minedout', ['levelServices', 'viewFilters']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/intro', {templateUrl: 'partials/intro.html',  controller: IntroCtrl}).
      when('/outro', {templateUrl: 'partials/outro.html',  controller: OutroCtrl}).
      when('/help', {templateUrl: 'partials/help.html',  controller: HelpCtrl}).
      when('/level/:levelId', {templateUrl: 'partials/level.html', controller: LevelCtrl}).
      when('/levelDone/:levelId', {templateUrl: 'partials/leveldone.html',  controller: LevelDoneCtrl}).
      otherwise({redirectTo: '/intro'});
}]);

var Def = {
    FREE: 0,
    MINE : 2,
    FENCE : 4,
    VISITED : 1,
    XSIZE : 30,
    YSIZE : 19
}

function Tile(content) {
    this.mine = content;
}
