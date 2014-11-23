Images = new FS.Collection("images",{
  stores:[
    new FS.Store.GridFS("strips",{
      transformWrite: function(fileObj,readStream,writeStream){
        fileObj.extension('png', {store: "strips"});
        fileObj.type('image/png', {store: "strips"});
        gm(readStream).resize(624,220).stream('PNG').pipe(writeStream);
      }
    }),
    new FS.Store.GridFS("logos",{
      transformWrite: function(fileObj,readStream,writeStream){
        fileObj.extension('png', {store: "logos"});
        fileObj.type('image/png', {store: "logos"});
        gm(readStream).resize(73,71).stream('PNG').pipe(writeStream);
      }
    }),
    new FS.Store.GridFS("icons",{
      transformWrite: function(fileObj,readStream,writeStream){
        fileObj.extension('png', {store: "icons"});
        fileObj.type('image/png', {store: "icons"});
        gm(readStream).resize(58,58).stream('PNG').pipe(writeStream);
      }
    }),
    new FS.Store.GridFS("thumbnail",{
      transformWrite: function(fileObj,readStream,writeStream){
        fileObj.extension('png', {store: "thumbnail"});
        fileObj.type('image/png', {store: "thumbnail"});
        gm(readStream).resize(180,180).stream('PNG').pipe(writeStream);
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
        alert('Ошибка! Можно загружать только графические файлы и размером не более 1.25Mb.');
      }else{
        console.warn(message);
      }
    }
  }
});

Images.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn,
  download: function() {
        return true;
  }
});