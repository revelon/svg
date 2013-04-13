'use strict';

/* Filters */

angular.module('viewFilters', []).filter('tile', function() {
    return function(input) {
        if (input == Def.FENCE) return "#";
        if (input == Def.VISITED) return "-";
        return " ";
  };
});
