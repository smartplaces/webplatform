Banners = new FS.Collection("banners",{
  stores:[
    new FS.Store.GridFS("banners",{
      transformWrite: function(fileObj,readStream,writeStream){
        fileObj.copies.banners.name = FS.Utility.setFileExtension(fileObj.copies.banners.name, 'png');
        fileObj.copies.banners.type = 'image/png';
        gm(readStream).resize(624,220).stream('PNG').pipe(writeStream);
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
        alert('Ошибка! Для банера можно выбирать только графические файлы и размером не более 1.25Mb.');
      }else{
        console.warn(message);
      }
    }
  }
});

Banners.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn,
  download: function() {
        return true;
  }
});

