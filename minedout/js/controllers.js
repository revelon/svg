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
    $scope.levelData = new Level($routeParams.levelId);
    $scope.player;
    $scope.remainingTime;
    $scope.spreader;
    $scope.bug;
    $scope.replayMode = false;
    var stop, stopSpreader, stopBug, stopDisappear, nextAction;

    $scope.level = function() {
        return $routeParams.levelId;
    };
    $scope.keypress = function(keyEvent) {
        console.log('keypress', keyEvent.keyCode);
        var movement = false;
        if (keyEvent.keyCode == 38 || keyEvent.keyCode == 119) {
            movement = $scope.player.moveUp();
            keyEvent.preventDefault();
        } else if (keyEvent.keyCode == 40 || keyEvent.keyCode == 115) {
            movement = $scope.player.moveDown();
            keyEvent.preventDefault();
        } else if (keyEvent.keyCode == 37 || keyEvent.keyCode == 97) {
            movement = $scope.player.moveLeft();
            keyEvent.preventDefault();
        } else if (keyEvent.keyCode == 39 || keyEvent.keyCode == 100) {
            movement = $scope.player.moveRight();
            keyEvent.preventDefault();
        }
        if (movement) {
            evaluateMovement();
        }
    };
    //document.onkeydown = $scope.keypress;

    $scope.replay = function() {
        for (var i in $scope.player.movementHistory) {
            var item = $scope.player.movementHistory[i];
            if ($scope.levelData.data[item.y][item.x].org) {
                $scope.levelData.data[item.y][item.x].mine = $scope.levelData.data[item.y][item.x].org;
            } else {
                $scope.levelData.data[item.y][item.x].mine = Def.FREE;
            }
        }
        $scope.replayMode = true;
        $scope.player.replayMode(true);
        if (stop) {
            $timeout.cancel(stop);
        }
        replayTime();
    }
    function setTileVisited() {
        $scope.levelData.data[$scope.player.y][$scope.player.x].mine = Def.VISITED;
    };

    $scope.getBackground = function() {
        return "area num" + $scope.player.adjacentMines;
    };
    function evaluateMovement() {
        $scope.player.movementHistory.push({x:$scope.player.x, y:$scope.player.y});
        $scope.bug.addToStack({x:$scope.player.x, y:$scope.player.y});
        $scope.player.adjacentMines = $scope.levelData.getAdjacentMinesCount($scope.player.x, $scope.player.y);
        console.log("Evaluated...");
        if ($scope.levelData.data[$scope.player.y][$scope.player.x].mine === Def.MINE ||
            $scope.levelData.data[$scope.player.y][$scope.player.x].mine === Def.VISIBLEMINE ||
            $scope.levelData.data[$scope.player.y][$scope.player.x].mine === Def.FENCE) {
            $scope.levelData.data[$scope.player.y][$scope.player.x].org = $scope.levelData.data[$scope.player.y][$scope.player.x].mine;
            $scope.player.killed("BOOOOOOOOM");
            nextAction = "/outro";
            if (stopSpreader) {
                $timeout.cancel(stopSpreader);
            }
            $scope.replay();
        } else if ($scope.levelData.data[$scope.player.y][$scope.player.x].mine === Def.WORM) {
            $scope.levelData.data[$scope.player.y][$scope.player.x].org = $scope.levelData.data[$scope.player.y][$scope.player.x].mine;
            Score.add(15);
            setTileVisited();
        } else if ($scope.player.y == 0) {
            $scope.player.adjacentMines = "VICTORYYYY";
            nextAction = "/levelDone/"+(1 * $scope.level() + 1);
            Score.add($scope.remainingTime*10);
            if (stopSpreader) {
                $timeout.cancel(stopSpreader);
            }
            $scope.replay();
        } else {
            setTileVisited();
        }
    };
    $scope.restart = function() {
        $scope.levelData.generateLevel($routeParams.levelId);
        $scope.player = new Player();
        $scope.bug = new Bug();
        $scope.replayMode = false;
        setTime();
        runningTime();
        evaluateMovement();
        if ($scope.level() > 2) {
            stopSpreader = $timeout(function() {
                $scope.spreader = new Spreader();
                spreaderTime();
            }, 8000);
        }
        if ($scope.level() > 3) {
            stopBug = $timeout(function() {
                bugTime();
            }, 6000);
        }
    };
    $scope.getScore = function() {
        return Score.get();
    };
    function runningTime() {
        stop = $timeout(function() {
            if ($scope.remainingTime && $scope.player.alive) {
                $scope.remainingTime--;
                runningTime();
            } else if (!$scope.remainingTime || !$scope.player.alive) {
                $timeout.cancel(stop);
                $scope.player.killed("TIMEEDOUUUT");
                nextAction = "/outro";
                $scope.replay();
            }
        }, 1000);
    };
    function replayTime() {
        stop = $timeout(function() {
            if ($scope.player.movementHistory.length) {
                var xy = $scope.player.movementHistory.shift();
                $scope.player.x = xy.x, $scope.player.y = xy.y;
                setTileVisited();
                replayTime();
            } else {
                $scope.player.replayMode(false);
                $scope.replayMode = false;
                $timeout.cancel(stop);
                doNextAction();
            }
        }, 100);
    };

    function setTime() {
        $scope.remainingTime = 50 * $scope.level();
    };

    function doNextAction() {
        if (nextAction) {
            $location.path(nextAction);
            nextAction = null;
        }
    };

    function spreaderTime() {
        stopSpreader = $timeout(function() {
            var visMine = $scope.spreader.generate($scope.levelData.data);
            if (visMine === false) {
                $timeout.cancel(stopSpreader);
            } else if (visMine !== true) {
                $scope.levelData.data[visMine.y][visMine.x] = new Tile(Def.VISIBLEMINE);
                $scope.player.adjacentMines = $scope.levelData.getAdjacentMinesCount($scope.player.x, $scope.player.y);
                spreaderTime();
            } else {
                spreaderTime();
            }
        }, 100);
    };

    function bugTime() {
        stopBug = $timeout(function() {
            $scope.bug.move();
            if ($scope.player.x === $scope.bug.x && $scope.player.y === $scope.bug.y) {
                $timeout.cancel(stopBug);
                $scope.player.killed("CAAAAAUUUUGHT");
                nextAction = "/outro";
                $scope.replay();
            } else {
                bugTime();
            }
        }, 100);
    };

    $scope.restart();
}
