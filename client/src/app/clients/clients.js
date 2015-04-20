angular.module('clients', ['resources.clients', 'productbacklog', 'sprints', 'security.authorization'])

.config(['$routeProvider', 'securityAuthorizationProvider', function ($routeProvider, securityAuthorizationProvider) {
  $routeProvider.when('/clients', {
    templateUrl:'clients/clients-list.tpl.html',
    controller:'ClientsViewCtrl',
    resolve:{
      clients:['Clients', function (Clients) {
        //TODO: fetch only for the current user
        return Clients.all();
      }],
      authenticatedUser: securityAuthorizationProvider.requireAuthenticatedUser
    }
  });
}])

.controller('ClientsViewCtrl', ['$scope', '$location', 'clients', 'security', function ($scope, $location, clients, security) {
  $scope.clients = clients;

  $scope.viewProject = function (client) {
    $location.path('/clients/'+client.$id());
  };

  $scope.manageBacklog = function (client) {
    $location.path('/clients/'+client.$id()+'/productbacklog');
  };

  $scope.manageSprints = function (client) {
    $location.path('/clients/'+client.$id()+'/sprints');
  };

  $scope.getMyRoles = function(client) {
    if ( security.currentUser ) {
      return client.getRoles(security.currentUser.id);
    }
  };
}]);
