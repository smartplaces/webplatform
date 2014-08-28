Template.tabs.helpers({
    isActive: function(path){
        return (Router.path(path) == Router.current().path)? 'active' : '';
    }
});
