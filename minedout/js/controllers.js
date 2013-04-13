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

function LevelCtrl($scope, $routeParams, $timeout, Level) {
    $scope.title = 'Level' + $routeParams.levelId;
    $scope.level = $routeParams.levelId;
    $scope.levelData = Level;
    $scope.x = Def.XSIZE/2, $scope.y = Def.YSIZE-1;
    $scope.adjacentMines = 9;
    $scope.playerIcon = "P";
    $scope.elapsedTime = "0";

    $scope.keypress = function(keyEvent) {
        console.log('keypress', keyEvent);
        if (keyEvent.keyCode == 38) $scope.moveUp();
        else if (keyEvent.keyCode == 40) $scope.moveDown();
        else if (keyEvent.keyCode == 37) $scope.moveLeft();
        else if (keyEvent.keyCode == 39) $scope.moveRight();
    }

    function setTileVisited() {
        //console.log($scope.levelData);
        $scope.levelData.data[$scope.y][$scope.x].mine = Def.VISITED;
    }

    $scope.getBack = function (){
        return "area num" + $scope.adjacentMines;
    }

    $scope.moveUp = function (){
        if ($scope.y) $scope.y--;
        evaluateMovement();
    }
    $scope.moveLeft = function (){
        if ($scope.x) $scope.x--;
        evaluateMovement();
    }
    $scope.moveRight = function (){
        if ($scope.x < (Def.XSIZE)) $scope.x++;
        evaluateMovement();
    }
    $scope.moveDown = function (){
        if ($scope.y < (Def.YSIZE-1)) $scope.y++;
        evaluateMovement();
    }
    function evaluateMovement(){
        $scope.adjacentMines = $scope.levelData.getAdjacentMinesCount($scope.x, $scope.y);
        console.log("Evaluated...");
        if ($scope.levelData.data[$scope.y][$scope.x].mine === Def.MINE ||
            $scope.levelData.data[$scope.y][$scope.x].mine === Def.FENCE) {
            $scope.playerIcon = "X";
            $scope.adjacentMines = "BOOOOOOOOM";
        } else if ($scope.y == 0) {
            $scope.adjacentMines = "VICTORYYYY";
        } else {
            setTileVisited();
        }
    }

    evaluateMovement();
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
