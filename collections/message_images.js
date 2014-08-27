MessageImages = new FS.Collection("message_images",{
  stores:[
    new FS.Store.GridFS("message_images",{
      transformWrite: function(fileObj,readStream,writeStream){
        fileObj.extension('png', {store: "strips"});
        fileObj.type('image/png', {store: "strips"});
        gm(readStream).stream('PNG').pipe(writeStream);
      }
    })
  ],
  filter:{
    maxSize: 10485760, //in bytes,
    allow: {
      contentTypes: ['image/*']
    },
    onInvalid: function (message) {
      if(Meteor.isClient){
        alert('Ошибка! Для сообщения можно выбирать только графические файлы и размером не более 1.25Mb.');
      }else{
        console.warn(message);
      }
    }
  }
});

MessageImages.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn,
  download: function() {
        return true;
  }
});
