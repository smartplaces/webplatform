/*
Icons = new FS.Collection("icons",{
  stores:[
    new FS.Store.GridFS("icons",{

      region: "us-east-1",
      accessKeyId: 'AKIAJRES2MWYG6QNSCDQ',
      secretAccessKey: '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',
      bucket: 'spru',
      ACL: 'public-read',

      transformWrite:function(fileObj,readStream,writeStream){
        fileObj.extension('png', {store: "icons"});
        fileObj.type('image/png', {store: "icons"});
        gm(readStream).resize(58,58).stream('PNG').pipe(writeStream);
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

Icons.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn,
    download: function() {
        return true;
    }
});
*/
