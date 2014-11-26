Template.imagesList.rendered = function () {
  
}

Template.imagesList.events({
  'change .uploader': function(e,t){
      FS.Utility.eachFile(event, function(file) {
        var f = new FS.File(file);
        f.userId = Meteor.userId(); // add custom data
        var i = Images.insert(f, function (err, fileObj) {
          if (err) {
            console.log(err)
          }
        });
        Session.set('uploadedImageId',i._id);
      });
  },
  'click .image-item-remove': function (e){
    e.preventDefault();
    if (confirm("Вы уверены, что хотите удалить это изображение?")){
       Images.remove(e.target.id);
    };
  }
});

Template.imagesList.helpers({
  images: function(){
    return Images.find();
  },
  uploadedImageId: function(){
    return Session.get('uploadedImageId');
  }
});