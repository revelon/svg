'use strict';

/* Controllers */

function IntroCtrl($scope) {
    $scope.title = 'Intro';
};

function OutroCtrl($scope, Score) {
    $scope.title = 'Outro';
    Score.reset();
};

function HelpCtrl($scope) {
    $scope.title = 'Help';
};

function LevelDoneCtrl($scope, $routeParams) {
    $scope.title = 'LevelDone';
    $scope.level = $routeParams.levelId;
};

function LevelCtrl($scope, $routeParams, $timeout, $location, Score) {
    $scope.title = 'Level...';
    $scope.levelData = new Level($routeParams.levelId);
    $scope.x, $scope.y;
    $scope.adjacentMines;
    $scope.playerAlive = true;
    $scope.movementHistory = [];
    $scope.remainingTime;
    $scope.replayMode = false;
    var playerOrgStatus, stop, nextAction;

    $scope.level = function() {
        return $routeParams.levelId;
    };
    $scope.keypress = function(keyEvent) {
        console.log('keypress', keyEvent.keyCode);
        if (keyEvent.keyCode == 38 || keyEvent.keyCode == 119) {
            $scope.moveUp();
            keyEvent.preventDefault();
        }
        else if (keyEvent.keyCode == 40 || keyEvent.keyCode == 115) {
            $scope.moveDown();
            keyEvent.preventDefault();
        }
        else if (keyEvent.keyCode == 37 || keyEvent.keyCode == 97) {
            $scope.moveLeft();
            keyEvent.preventDefault();
        }
        else if (keyEvent.keyCode == 39 || keyEvent.keyCode == 100) {
            $scope.moveRight();
            keyEvent.preventDefault();
        }
    };
    //document.onkeydown = $scope.keypress;

    $scope.replay = function() {
        for (var i in $scope.movementHistory) {
            var item = $scope.movementHistory[i];
            if ($scope.levelData.data[item.y][item.x].org) {
                $scope.levelData.data[item.y][item.x].mine = $scope.levelData.data[item.y][item.x].org;
            } else {
                $scope.levelData.data[item.y][item.x].mine = Def.FREE;
            }
        }
        $scope.replayMode = true;
        if (stop) {
            $timeout.cancel(stop);
        }
        playerOrgStatus = $scope.playerAlive;
        $scope.playerAlive = true;
        replayTime();
    }
    function setTileVisited() {
        //console.log($scope.levelData);
        $scope.levelData.data[$scope.y][$scope.x].mine = Def.VISITED;
    };

    $scope.getBackground = function() {
        return "area num" + $scope.adjacentMines;
    };
    $scope.moveUp = function() {
        if (!$scope.playerAlive) return;
        if ($scope.y) $scope.y--;
        evaluateMovement();
    };
    $scope.moveLeft = function() {
        if (!$scope.playerAlive) return;
        if ($scope.x) $scope.x--;
        evaluateMovement();
    };
    $scope.moveRight = function() {
        if (!$scope.playerAlive) return;
        if ($scope.x < (Def.XSIZE)) $scope.x++;
        evaluateMovement();
    };
    $scope.moveDown = function() {
        if (!$scope.playerAlive) return;
        if ($scope.y < (Def.YSIZE-1)) $scope.y++;
        evaluateMovement();
    };
    function evaluateMovement() {
        $scope.movementHistory.push({x:$scope.x, y:$scope.y});
        $scope.adjacentMines = $scope.levelData.getAdjacentMinesCount($scope.x, $scope.y);
        console.log("Evaluated...");
        if ($scope.levelData.data[$scope.y][$scope.x].mine === Def.MINE ||
            $scope.levelData.data[$scope.y][$scope.x].mine === Def.FENCE) {
            $scope.levelData.data[$scope.y][$scope.x].org = $scope.levelData.data[$scope.y][$scope.x].mine;
            $scope.playerAlive = false;
            $scope.adjacentMines = "BOOOOOOOOM";
            nextAction = "/outro";
            $scope.replay();
        } else if ($scope.levelData.data[$scope.y][$scope.x].mine === Def.WORM) {
            $scope.levelData.data[$scope.y][$scope.x].org = $scope.levelData.data[$scope.y][$scope.x].mine;
            Score.add(15);
            setTileVisited();
        } else if ($scope.y == 0) {
            $scope.adjacentMines = "VICTORYYYY";
            nextAction = "/levelDone/"+(1 * $scope.level() + 1);
            Score.add($scope.remainingTime*10);
            $scope.replay();
        } else {
            setTileVisited();
        }
    };
    $scope.restart = function() {
        $scope.levelData.generateLevel($routeParams.levelId);
        $scope.x = Def.XSIZE/2, $scope.y = Def.YSIZE-1;
        $scope.playerAlive = true;
        setTime();
        runningTime();
        evaluateMovement();
    };
    $scope.getScore = function() {
        return Score.get();
    };
    function runningTime() {
        stop = $timeout(function() {
            if ($scope.remainingTime && $scope.playerAlive) {
                $scope.remainingTime--;
                runningTime();
            } else if (!$scope.remainingTime || !$scope.playerAlive) {
                $timeout.cancel(stop);
                $scope.playerAlive = false;
                $scope.adjacentMines = "TIMEEDOUUUT";
                nextAction = "/outro";
                $scope.replay();
            }
        }, 1000);
    };
    function replayTime() {
        stop = $timeout(function() {
            if ($scope.movementHistory.length) {
                var m = $scope.movementHistory.shift();
                $scope.x = m.x, $scope.y = m.y;
                setTileVisited();
                replayTime();
            } else {
                $scope.playerAlive = playerOrgStatus;
                $timeout.cancel(stop);
                doNextAction();
            }
        }, 100);
    };

    function setTime() {
        $scope.remainingTime = 30 * $scope.level();
    };

    function doNextAction() {
        if (nextAction) {
            $location.path(nextAction);
            nextAction = null;
        }
    }

    $scope.restart();
}
