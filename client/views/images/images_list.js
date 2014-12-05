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
        Session.set('unconfirmDeleteImage',e.target.id);
        $('#confirmModal').modal('show');
    },
    'click .remove-confirm-ok': function(e,t){
        e.preventDefault();
        var id = Session.get('unconfirmDeleteImage');
        Session.set('unconfirmDeleteImage',undefined);
        $('#confirmModal').modal('hide');
        Images.remove(id, function(error){
            if (error){
                createAlert(error.reason);
            }
        });
    }
});

Template.imagesList.helpers({
    images: function(){
        return Images.find();
    },
    uploadedImageId: function(){
        return Session.get('uploadedImageId');
    },
    confirmData: function(){
        return {
            title: "Удаление изображения",
            body: "Вы уверены, что хотите удалить это изображение?",
            actionClass: 'remove-confirm-ok'
        };
    }
});