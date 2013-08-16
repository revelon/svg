'use strict';

/* App Module */

angular.module('scotland', ['localStorage']).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/intro', {templateUrl: 'intro.html',  controller: IntroCtrl}).
      when('/help', {templateUrl: 'help.html',  controller: HelpCtrl}).
      when('/level/:levelId', {templateUrl: 'level.html', controller: LevelCtrl}).
      when('/levelDone/:levelId', {templateUrl: 'leveldone.html',  controller: LevelDoneCtrl}).
      otherwise({redirectTo: '/intro'});
}]);

var game = {
  "picsCount": 21,
  "showLimit": 1,
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

function playAudio(what) {
  document.getElementById(what).play();
}

function setMozWallpaper(which) {
    alert("MozActivity");
    var activity = new MozActivity({
      // Ask for the "pick" activity
      name: "share",
    
      // Provide the data required by the filters of the activity
      data: {
        type: "image/jpeg",
        url: "/scotland/img/3.jpg"
      }
    });
    
    activity.onsuccess = function() {
      //var picture = this.result;
      alert("OK " + this.result);
    };
    
    activity.onerror = function() {
      alert("KO " + this.error);
    };
};