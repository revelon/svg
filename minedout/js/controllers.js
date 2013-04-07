'use strict';

/* Controllers */

function IntroCtrl($scope) {
    $scope.title = 'Intro';
}

function OutroCtrl($scope) {
    $scope.title = 'Outro';
}

function HelpCtrl($scope) {
    $scope.title = 'Help';
}

function LevelCtrl($scope, $routeParams, Level) {
    $scope.title = 'Level' + $routeParams.levelId;
    $scope.level = $routeParams.levelId;
    $scope.levelData = Level;
    $scope.x = 1, $scope.y = 1;
    $scope.adjacentMines = 9;

    $scope.moveUp = function (){
        $scope.y--;
        evaluateMovement();
    }
    $scope.moveLeft = function (){
        $scope.x--;
        evaluateMovement();
    }
    $scope.moveRight = function (){
        $scope.x++;
        evaluateMovement();
    }
    $scope.moveDown = function (){
        $scope.y++;
        evaluateMovement();
    }
    function evaluateMovement(){
        $scope.adjacentMines = $scope.levelData.getAdjacentMinesCount($scope.x, $scope.y);
        console.log("dsadsdas");
    }
}



function PhoneListCtrl($scope, Phone) {
  $scope.phones = Phone.query();
  $scope.orderProp = 'age';
}

//PhoneListCtrl.$inject = ['$scope', 'Phone'];



function PhoneDetailCtrl($scope, $routeParams, Phone) {
  $scope.phone = Phone.get({phoneId: $routeParams.phoneId}, function(phone) {
    $scope.mainImageUrl = phone.images[0];
  });

  $scope.setImage = function(imageUrl) {
    $scope.mainImageUrl = imageUrl;
  }
}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', 'Phone'];
