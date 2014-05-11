Coupons = new Meteor.Collection('coupons');

Coupons.allow({
  insert: loggedIn,
  update: owner,
  remove: owner
});

Meteor.methods({
  saveCoupon: function(coupon,isNew){
    var user = Meteor.user();
    var data = _.extend(_.pick(coupon,'title','coupon','description','addInfoLabel','addInfoValue','code','logo','banner','bgColor','textColor','addInfoTextColor'), {
      userId: user._id,
      updated: new Date().getTime()
    });

    if (coupon._id){
      var old = Coupons.findOne(coupon._id);
      if (data.logo && old.logo!==data.logo){
        Logos.remove({_id:old.logo});
      }
      if (data.banner && old.banner!==data.banner){
        Banners.remove({_id:old.banner});
      }

      Coupons.update(coupon._id,{$set:data},function (error){
        if (error){
          throw new Meteor.Error(500, 'Ошибка: невозможно сохранить купон :(!');
        }
      });
      return coupon._id;
    }else{
      if (isNew && Meteor.isServer){
        /*
        console.log('Upload default images');
        var fsFile = new FS.File("/home/vagrant/defaults/sample-logo.png");
        fsFile.userId = Meteor.userId();
        data.logo = Logos.insert(fsFile)._id;
        console.log('Logo: '+data.logo);
        fsFile = new FS.File("/home/vagrant/defaults/sample-background.png");
        fsFile.userId = Meteor.userId();
        data.banner = Banners.insert(fsFile)._id;
        console.log('Banners: '+data.banner);
        */
      }
      return Coupons.insert(data);
    }
  }
});
