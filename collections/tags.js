Tags = new Meteor.Collection('tags');

Tags.allow({
  insert: loggedIn,
  update: owner,
  remove: owner

});

Meteor.methods({
  'saveTags': function(tags){
    var user = Meteor.user();
    _.each(tags,function (tag){
        if (tag!=undefined && tag.trim()!=""){
          if (!Tags.findOne({name:tag.trim(), userId:user._id})){
            Tags.insert({name:tag.trim(),userId:user._id});
          }
        }
    });
  }
});
