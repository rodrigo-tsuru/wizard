angular.module('resources.clients', ['mongolabResource']);
angular.module('resources.clients').factory('Clients', ['mongolabResource', function ($mongolabResource) {

  var Clients = $mongolabResource('clients');

  Clients.forUser = function(userId, successcb, errorcb) {
    //TODO: get clients for this user only (!)
    return Clients.query({}, successcb, errorcb);
  };

  Clients.prototype.isProductOwner = function (userId) {
    return this.productOwner === userId;
  };
  Clients.prototype.canActAsProductOwner = function (userId) {
    return !this.isScrumMaster(userId) && !this.isDevTeamMember(userId);
  };
  Clients.prototype.isScrumMaster = function (userId) {
    return this.scrumMaster === userId;
  };
  Clients.prototype.canActAsScrumMaster = function (userId) {
    return !this.isProductOwner(userId);
  };
  Clients.prototype.isDevTeamMember = function (userId) {
    return this.teamMembers.indexOf(userId) >= 0;
  };
  Clients.prototype.canActAsDevTeamMember = function (userId) {
    return !this.isProductOwner(userId);
  };

  Clients.prototype.getRoles = function (userId) {
    var roles = [];
    if (this.isProductOwner(userId)) {
      roles.push('PO');
    } else {
      if (this.isScrumMaster(userId)){
        roles.push('SM');
      }
      if (this.isDevTeamMember(userId)){
        roles.push('DEV');
      }
    }
    return roles;
  };

  return Clients;
}]);
