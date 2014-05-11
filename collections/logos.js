Logos = new FS.Collection("logos",{
  stores:[
    new FS.Store.GridFS("logos",{
      transformWrite:function(fileObj,readStream,writeStream){
        fileObj.copies.logos.name = FS.Utility.setFileExtension(fileObj.copies.logos.name, 'png');
        fileObj.copies.logos.type = 'image/png';
        gm(readStream).resize(320,100).stream('PNG').pipe(writeStream);
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
        alert('Ошибка! Для логотипа можно выбирать только графические файлы и размером не более 1.25Mb.');
      }else{
        console.warn(message);
      }
    }
  }
});

Logos.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn,
    download: function() {
        return true;
    }
});


