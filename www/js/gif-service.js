'use strict';

angular.module('stashGif')
  .service('gifService', function ($http) {
    var selectedGif = '';

    this.getSelectedGif = function () {
      return selectedGif;
    };

    this.setSelectedGif = function (gif) {
      selectedGif = gif;
    };

    this.queryGiphy = function (keyword) {
      var termToUrl = function (term) {
        return 'http://api.giphy.com/v1/gifs/search?q=' + term +
          '&api_key=dc6zaTOxFJmzC';
      };
      return $http.get(termToUrl(keyword));
    };

    return this;

  });