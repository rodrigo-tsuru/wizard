angular.module('admin-clients', [
  'resources.clients',
  'resources.users',
  'services.crud',
  'security.authorization'
])

.config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

  var getAllUsers = ['Clients', 'Users', '$route', function(Clients, Users, $route){
    return Users.all();
  }];

  crudRouteProvider.routesFor('Clients', 'admin')
    .whenList({
      clients: ['Clients', function(Clients) { return Clients.all(); }],
      adminUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenNew({
      client: ['Clients', function(Clients) { return new Clients(); }],
      users: getAllUsers,
      adminUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenEdit({
      client: ['Clients', 'Users', '$route', function(Clients, Users, $route) { return Clients.getById($route.current.params.itemId); }],
      users: getAllUsers,
      adminUser: securityAuthorizationProvider.requireAdminUser
    });
}])

.controller('ClientsListCtrl', ['$scope', 'crudListMethods', 'clients', function($scope, crudListMethods, clients) {
  $scope.clients = clients;

  angular.extend($scope, crudListMethods('/admin/clients'));
}])

.controller('ClientsEditCtrl', ['$scope', '$location', 'i18nNotifications', 'users', 'client', function($scope, $location, i18nNotifications, users, client) {

  $scope.client = client;
  $scope.users = users;

  $scope.onSave = function(client) {
    i18nNotifications.pushForNextRoute('crud.client.save.success', 'success', {id : client.$id()});
    $location.path('/admin/clients');
  };

  $scope.onError = function() {
    i18nNotifications.pushForCurrentRoute('crud.client.save.error', 'error');
  };

}])

.controller('TeamMembersController', ['$scope', function($scope) {
  $scope.client.teamMembers = $scope.client.teamMembers || [];

  //prepare users lookup, just keep references for easier lookup
  $scope.usersLookup = {};
  angular.forEach($scope.users, function(value, key) {
    $scope.usersLookup[value.$id()] = value;
  });

  $scope.productOwnerCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.client.canActAsProductOwner(user.$id());
    });
  };

  $scope.scrumMasterCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.client.canActAsScrumMaster(user.$id());
    });
  };

  $scope.teamMemberCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.client.canActAsDevTeamMember(user.$id()) && !$scope.client.isDevTeamMember(user.$id());
    });
  };

  $scope.selTeamMember = undefined;

  $scope.addTeamMember = function() {
    if($scope.selTeamMember) {
      $scope.client.teamMembers.push($scope.selTeamMember);
      $scope.selTeamMember = undefined;
    }
  };

  $scope.removeTeamMember = function(teamMember) {
    var idx = $scope.client.teamMembers.indexOf(teamMember);
    if(idx >= 0) {
      $scope.client.teamMembers.splice(idx, 1);
    }
    // If we have removed the team member that is currently selected then clear this object
    if($scope.selTeamMember === teamMember) {
      $scope.selTeamMember = undefined;
    }
  };
}]);
