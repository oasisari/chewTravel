angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Chats, $state, $ionicScrollDelegate, $timeout) {
  $scope.u = {};
  $scope.u.question = '';
  var res;
  var count = 0;
  Chats.initPlanets();

  $scope.$on('$ionicView.enter',function(){
    $scope.showplanet = false;
    $scope.reply = 'What type of holiday would you like to have? Relaxing, exciting or boring?';
    Chats.setChosenId(-1);
    $timeout(function(){$ionicScrollDelegate.$getByHandle('bottom1').scrollTop(false);},1000);
  });

  $scope.sendQ = function() {
    $scope.reply = '';
    res = Chats.sendQ($scope.u.question, 'Genos');
    if (!angular.isArray(res)) {
      $scope.reply = res;
    } else {
      $scope.planets = res;
      $scope.showplanet = true;
      if (count > 0 && count % 2 == 0) {
        $scope.reply = 'I listed the planets that I think match your criteria. What do you think?';  
      } else {
        $scope.reply = 'How about these planets?';  
      }
      count++;
    }
    $scope.u.question = '';
  };  

  $scope.book = function(p) {
    Chats.makeBooking(p);
    $state.go('tab.itinerary');
  };
})

.controller('ItineraryCtrl', function($scope, Chats, $state, $ionicScrollDelegate, $timeout) {
  $scope.showiti = false;
  $scope.count = 383;

  $scope.$on('$ionicView.enter', function(){
    if(Chats.getChosenId() != -1) {
      $scope.showiti = true;
      $scope.planet = Chats.getChosenPlanet();
      $scope.myq = Chats.getQ();
    } else {
      $scope.showiti = false;
    }
    $timeout(function(){$ionicScrollDelegate.$getByHandle('bottom2').scrollTop(false);},1000);
    $scope.count++;
  });

})

.controller('AccountCtrl', function($scope, Chats) {
  
  Chats.getChew().then(function(res){
    $scope.chew = res;
  }, function(er){
    $scope.error = er.data;
  });
});
