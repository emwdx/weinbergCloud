UI.registerHelper('isAdmin',function(){

return (Roles.userIsInRole(Meteor.user()._id,'admin'));

});
