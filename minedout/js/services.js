'use strict';

/* Services */
angular.module('scoreServices', []).service('Score', function() {
    this.score = 0;
    this.get = function() {
        return this.score;
    };
    this.reset = function(score) {
        this.score = 0;
    };
    this.add = function(sum) {
        this.score = this.score + sum;
    };
});
