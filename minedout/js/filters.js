'use strict';

/* Filters */

angular.module('viewFilters', []).filter('tile', function() {
    return function(input, mode) {
        if (input == Def.FENCE) return "#";
        if (input == Def.VISITED) return ".";
        if (input == Def.WORM) return "&";
        if (mode && input == Def.MINE) return "M";
        return " ";
  };
}).filter('playerIco', function() {
        return function(input) {
            return input ? "I" : "X";
        };
});
