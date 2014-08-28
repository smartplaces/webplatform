Strips = new FS.Collection("strips",{
  stores:[
    new FS.Store.GridFS("strips",{
      /*
      region: "us-east-1",
      accessKeyId: 'AKIAJRES2MWYG6QNSCDQ',
      secretAccessKey: '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',
      bucket: 'spru',
      ACL: 'public-read',
      */
      transformWrite: function(fileObj,readStream,writeStream){
        fileObj.extension('png', {store: "strips"});
        fileObj.type('image/png', {store: "strips"});
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

Strips.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn,
  download: function() {
        return true;
  }
});

