Coupons = new Meteor.Collection('passes');

Coupons.allow({
  insert: loggedIn,
  update: owner,
  remove: owner
});

Meteor.methods({
  saveCoupon: function(coupon){
    var c = Coupons.findOne({_id:coupon._id,userId:Meteor.user()._id});

    if (c && Meteor.isServer) {
      var pass = c.pass;
      pass = _.extend(pass,_.pick(coupon,'logoText','backgroundColor','foregroundColor','labelColor'));
      pass.barcode.message = coupon.barcodeMessage;

      pass.coupon.primaryFields[0].value = coupon.primaryFieldValue;
      pass.coupon.primaryFields[0].label = coupon.primaryFieldLabel;

      pass.coupon.secondaryFields[0].value = coupon.secondaryFieldValue;
      pass.coupon.secondaryFields[0].label = coupon.secondaryFieldLabel;


      var images = c.images || {};

      var old_images = c.images;


      /*
      var icon = Icons.findOne(coupon.icon);
      if (icon){
        images.icon = {
          _id: icon._id,
          key: icon.getFileRecord().copies.icons.key
      }

        if (old_images && old_images.icon && old_images.icon._id != images.icon._id){
          Icons.remove(old_images.icon._id);
        }
      }
      */

      var logo = Logos.findOne(coupon.logo);
      if (logo){
        images.logo = {
          _id: logo._id,
          key: logo.getFileRecord().copies.logos.key
        };

        images.icon = {
          _id: logo._id,
          key: logo.getFileRecord().copies.icons.key
        };


        if (old_images && old_images.logo && old_images.logo._id != images.logo._id){
          Logos.remove(old_images.logo._id);
        }

      }

      var strip = Strips.findOne(coupon.strip);
      if (strip){
        images.strip = {
          _id: strip._id,
          key: strip.getFileRecord().copies.strips.key
        }

        if (old_images && old_images.strip && old_images.strip._id != images.strip._id){
          Strips.remove(old_images.strip._id);
        }
      }

      c.pass = pass;

      if (images != {})
        c.images = images;

      c.updatedAt = new Date().getTime();

      Coupons.update(c._id,c,function (error){
        if (error){
          throw new Meteor.Error(500, 'Ошибка: невозможно сохранить купон :(!');
        }
      });

      if (logo){
        Logos.update(logo._id,{$set:{passId:c._id}},function (error){
          if (error){
            throw new Meteor.Error(500, 'Ошибка: невозможно обновить метаданные для logo :(!');
          }
        });
      }

      if (strip){
        Strips.update(strip._id,{$set:{passId:c._id}}, function (error){
          if (error){
            throw new Meteor.Error(500, 'Ошибка: невозможно обновить метаданные для strip :(!');
          }
        });
      }

      if (Meteor.isServer){
        console.log('Send notification to registered devices for pass '+c._id);
        var url = 'http://sleepy-scrubland-4869.herokuapp.com/passws/notify/'+c.pass.passTypeIdentifier+'/'+c.pass.serialNumber+'?id='+c._id;
        try{
          HTTP.get(url);
        }catch(ex){
          throw ex;
        }
      }

      return c._id;

    }

  },

  saveEmpty: function(){
    var data = {
      userId: Meteor.user()._id,
      updatedAt: new Date().getTime(),
      type : 'coupon',
    };

    var id = Coupons.insert(data);

    if (Meteor.isServer){
      var crypto = Npm.require('crypto');
      var shasum = crypto.createHash('sha1');
      shasum.update(id+"/"+data.userId);
      var url = 'http://sleepy-scrubland-4869.herokuapp.com/passws/create/pass.ru.smartplaces.coupon/SN'+new Date().getTime()+'?id='+id+'&hash='+shasum.digest('hex');
      try{
        HTTP.get(url);
      }catch(ex){
        Coupons.remove(id);
        throw ex;
      }
    }

    return id;
  }
});
