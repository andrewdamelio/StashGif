'use strict';

angular.module('stashGif')
  .value('FIREBASE_URL', 'https://nero.firebaseio.com/0StashGif')
  .service('firebaseService', function ($firebase, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL);
    var sync = $firebase(ref);
    var list = sync.$asArray();

    this.sync = function () {
      return list.$loaded().then(function () {
        return list;
      });
    };

    this.init = function () {
      return list;
    };

    return this;
  });