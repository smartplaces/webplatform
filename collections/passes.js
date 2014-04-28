Passes = new FS.Collection("passes",{
  stores:[
    new FS.Store.FileSystem("passes",{
      path:"~/passes"
    })
  ]
});

Passes.allow({
    insert: loggedIn,
    update: loggedIn,
    remove: loggedIn,
    download: function() {
        return true;
    }
});


Meteor.methods({
  createPass: function(id){
    if (Meteor.isServer){
      var coupon = Coupons.findOne(id);
      var createTemplate = Meteor.require("passbook");
      var template = createTemplate("coupon", {
          formatVersion: 1,
          passTypeIdentifier: "pass.ru.smartplaces.coupon",
          teamIdentifier:     "Y77QB88576",
          webServiceURL: "https://ec2-54-84-241-29.compute-1.amazonaws.com/passws/",
          authenticationToken: "10AA10AA10AA10AA10AA10AA10AA10AA10AA10AA",
          organizationName: "SmartPlaces",
          description:   "Купон от SmartPlaces",
      });
      template.keys("/home/vagrant/Keys", "123456");
      var pass = template.createPass({
        backgroundColor:   coupon.bgColor,
        foregroundColor: coupon.textColor,
        labelColor: coupon.addInfoTextColor,

        serialNumber:  ""+(new Date()).getTime(),

        logoText: coupon.title,

        barcode : {
          message : coupon.code,
          format : "PKBarcodeFormatPDF417",
          messageEncoding : "utf-8"
        },

        coupon: {
            primaryFields : [
              {
                key : "offer",
                label : coupon.description,
                value : coupon.coupon
              }
            ],
           secondaryFields : [
             {
                key : "addInfo",
                label : coupon.addInfoLabel,
                value : coupon.addInfoValue
             }
           ],
           backFields : [
            {
              "key" : "terms",
              "label" : "УСЛОВИЯ ИСПОЛЬЗОВАНИЯ",
              "value" : "Это купон создан компанией SmartPlaces и является ее собственностью."
            }
          ]
        }
      });

      var logo = Logos.findOne(coupon.logo);
      var banner = Banners.findOne(coupon.banner);

      pass.images.icon = '/home/vagrant/logos/'+logo.copies.logos.key;
      pass.images.logo = '/home/vagrant/logos/'+logo.copies.logos.key;
      pass.images.strip = '/home/vagrant/banners/'+banner.copies.banners.key;

      var fs = Npm.require('fs');
      var fileName = "/home/vagrant/"+(new Date()).getTime()+".smartplaces.pkpass";
      var file = fs.createWriteStream(fileName);

      pass.on("error", function(error) {
        console.error(error);
      });

      Future = Npm.require('fibers/future');
      var future = new Future;
      pass.on('end',future.resolver());
      pass.pipe(file);

      /*
      var w = function(callback){
        pass.on('end',callback);
        pass.pipe(file);
        console.log('Pass generation started.');
      }

      ws = Meteor._wrapAsync(w);

      ws();*/

      future.wait();
      console.log('Pass created!');

      var fsFile = new FS.File(fileName);
      fsFile.userId = Meteor.userId();
      fsFile.couponId = coupon._id;
      Passes.remove({couponId:coupon._id});
      var pid = Passes.insert(fsFile)._id;
      console.log(pid);
      return pid;
    }
  }
})
