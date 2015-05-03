'use strict';

angular.module('stashGif')
  .controller('AppCtrl', function (
    $scope,
    $cordovaClipboard,
    $ionicModal,
    $state,
    $ionicHistory,
    $ionicScrollDelegate,
    $ionicSideMenuDelegate,
    ngProgress,
    $timeout,
    gifService,
    firebaseService) {

    // start loading bar
    ngProgress.start();

    // Firebase setup and init
    var Firebase = firebaseService;

    var list = Firebase.init();
    Firebase.sync()
      .then(function (list) {
        $scope.favData = list;
        ngProgress.complete();
      });

    // Form data for the login modal
    $scope.searchData = {};
    $scope.favData = [];

    // Create the login modal that favwe will use later
    $ionicModal.fromTemplateUrl('templates/search.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    $scope.closeSearch = function () {
      $scope.modal.hide();
    };

    $scope.search = function () {
      $scope.modal.show();
    };

    $scope.$on('$destroy', function () {
      $scope.modal.remove();
    });

    $scope.doSearch = function () {
      $scope.closeSearch();
      ngProgress.start();
      $scope.searchData.giphy = '';

      gifService.queryGiphy($scope.searchData.keyword)
        .then(function (res) {
          $scope.searchData.giphy = res.data.data;
          angular.forEach($scope.searchData.giphy, function (value) {
            value.active = false;
          });
          $scope.searchData.keyword = '';
          ngProgress.complete();
        });
    };

    $scope.favourite = function (gif) {
      gif.active = true;

      var alreadySaved = R.filter(R.propEq('id', gif.id), $scope.favData);
      if (alreadySaved.length === 0) {
        list.$add(gif);
      }
    };

    $scope.clear = function () {
      $scope.searchData = {};
      $ionicScrollDelegate.scrollTop();
    };

    $scope.gotoGif = function (gif) {
      gifService.setSelectedGif(gif);
      $scope.selectedGif = gifService.getSelectedGif();
      $ionicSideMenuDelegate.toggleLeft();
      $state.go('app.gif');
    };

    $scope.remove = function (id) {
      $scope.waiting = true;
      $scope.selectedGif = null;
      $scope.gifData = null;

      list.$remove(id).then(function () {
        $scope.waiting = false;
        $state.go('app.browse');
      });
    };

    $scope.electedGif = gifService.getSelectedGif();

    $scope.copyId = function (selectedGif) {
      $scope.copiedID = true;
      try {
        $cordovaClipboard.copy(String(selectedGif.id))
          .then(function () {
            $scope.opiedID = false;
          });
      } catch (e) {
        $timeout(function () {
          $scope.copiedID = false;
          window.prompt('', selectedGif.id);
        }, 150);
      }
    };

    $scope.copyUrl = function (selectedGif) {
      $scope.copiedURL = true;
      try {
        $cordovaClipboard.copy(String(selectedGif.images.original.url))
          .then(function () {
            $scope.copiedURL = false;
          });
      } catch (e) {
        $timeout(function () {
          $scope.copiedURL = false;
          window.prompt('', selectedGif.images.original.url);
        }, 150);
      }
    };
  });