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
    var replayHistory = [];

    $scope.level = function() {
        return $routeParams.levelId;
    };
    $scope.keypress = function(keyEvent) {
        //console.log('keypress', keyEvent.keyCode);
        if ($scope.replayMode || !$scope.player.alive) return;
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
        if (stop) {
            $timeout.cancel(stop);
        }
        $scope.levelData.prepareReplay();
        $scope.replayMode = true;
        $scope.player.replayMode(true);
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
        //console.log("Evaluated...");
        if ($scope.levelData.data[$scope.player.y][$scope.player.x].mine === Def.MINE ||
            $scope.levelData.data[$scope.player.y][$scope.player.x].mine === Def.VISIBLEMINE ||
            $scope.levelData.data[$scope.player.y][$scope.player.x].mine === Def.FENCE) {
            $scope.levelData.data[$scope.player.y][$scope.player.x].org = $scope.levelData.data[$scope.player.y][$scope.player.x].mine;
            addToReplayHistory();
            $scope.player.killed("BOOOOOOOOM");
            nextAction = "/outro";
            if (stopSpreader) {
                stopSpreader = false;
            }
            if (stopBug) {
                stopBug = false;
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
                stopSpreader = false;
            }
            if (stopBug) {
                stopBug = false;
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
        $scope.spreader = new Spreader();
        $scope.replayMode = false;
        setTime();
        runningTime();
        evaluateMovement();
    };
    $scope.getScore = function() {
        return Score.get();
    };
    function addToReplayHistory() {
        replayHistory.push({px:$scope.player.x, py:$scope.player.y, 
                                           sx:$scope.spreader.x, sy:$scope.spreader.y, smy:$scope.spreader.currentMineY,
                                           bx:$scope.bug.x, by:$scope.bug.y});
    };
    function runningTime() {
        stop = $timeout(function() {
            if ($scope.remainingTime && $scope.player.alive) {
                $scope.remainingTime--;

                if ($scope.level() > 2 && replayHistory.length === 300) {
                    stopSpreader = true;
                    $scope.spreader.init();
                }
                if (stopSpreader) {
                    spreaderTime();
                }

                if ($scope.level() > 3 && replayHistory.length === 30) {
                    stopBug = true;
                }
                if (stopBug) {
                    bugTime();
                }

                addToReplayHistory();
                runningTime();
            } else if (!$scope.remainingTime || !$scope.player.alive) {
                $timeout.cancel(stop);
                stopSpreader = false, stopBug = false;
                $scope.player.killed("TIMEEDOUUUT");
                nextAction = "/outro";
                $scope.replay();
            }
        }, 100);
    };
    function replayTime() {
        stop = $timeout(function() {
            if (replayHistory.length) {
                var coords = replayHistory.shift();
                $scope.player.x = coords.px, $scope.player.y = coords.py;
                $scope.spreader.x = coords.sx, $scope.spreader.y = coords.sy;
                if (coords.smy && coords.sx >= 0) $scope.levelData.data[coords.smy][coords.sx].mine = Def.VISIBLEMINE;
                $scope.bug.x = coords.bx, $scope.bug.y = coords.by;
                setTileVisited();
                replayTime();
            } else {
                $scope.player.replayMode(false);
                $scope.replayMode = false;
                $timeout.cancel(stop);
                doNextAction();
            }
        }, 150);
    };

    function setTime() {
        $scope.remainingTime = 10 * 50 * $scope.level();
    };

    function doNextAction() {
        if (nextAction) {
            //$location.path(nextAction);
            alert('end');
            nextAction = null;
        }
    };

    function spreaderTime() {
        var visMine = $scope.spreader.generate($scope.levelData.data);
        if (visMine === false) {
            stopSpreader = false;
        } else if (visMine) {
            $scope.levelData.data[visMine.y][visMine.x] = new Tile(Def.VISIBLEMINE);
            $scope.player.adjacentMines = $scope.levelData.getAdjacentMinesCount($scope.player.x, $scope.player.y);
        }
    };

    function bugTime() {
        $scope.bug.move();
        if ($scope.player.x === $scope.bug.x && $scope.player.y === $scope.bug.y) {
            stopBug = false, stopSpreader = false;
            if (stop) {
                $timeout.cancel(stop);
            }
            addToReplayHistory();
            $scope.player.killed("CAAAAAUUUUGHT");
            nextAction = "/outro";
            $scope.replay();
        }
    };

    $scope.restart();
}
