Template.tabs.helpers({
    isActive: function(routeName){
      return (routeName == Router.current().route.getName()) ? 'active' : '';
    }
});
