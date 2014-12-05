Template.couponPage.helpers({
  downloadLink: function(){
    if (this.pass){
      return 'http://sleepy-scrubland-4869.herokuapp.com/passws/download/'+this.pass.passTypeIdentifier+'/'+this.pass.serialNumber+'/smartplaces.pkpass?hash='+Meteor.userId();
    }else{
      return '#';
    }

  }
});
Template.couponPage.events({

  'click #delete': function(e){
      e.preventDefault();
      Coupons.remove({_id:this._id}, function(error){
          if (error){
              createAlert(error.reason);
          }
      });
      Router.go('coupons');
  },

  'click #save': function(e){
    e.preventDefault();

    var coupon = {
      _id:                 this._id,
      logoText:            Session.get('coupon.logoText'),
      primaryFieldValue:   Session.get('coupon.primaryFieldValue'),
      primaryFieldLabel:   Session.get('coupon.primaryFieldLabel'),
      secondaryFieldLabel: Session.get('coupon.secondaryFieldLabel'),
      secondaryFieldValue: Session.get('coupon.secondaryFieldValue'),
      barcodeMessage:      Session.get('coupon.barcodeMessage'),
      icon:                Session.get('coupon.icon'),
      logo:                Session.get('coupon.logo'),
      strip:               Session.get('coupon.strip'),
      backgroundColor:     Session.get('coupon.backgroundColor'),
      foregroundColor:     Session.get('coupon.foregroundColor'),
      labelColor:          Session.get('coupon.labelColor'),
      notify:              Session.get('coupon.notify'),
      locations:           []
    };

    var locations = Session.get('coupon.locations');
    if (locations){
      _.each(locations.toString().split(','),function(location){
        coupon.locations.push(location);
      });
    }
    Meteor.call('saveCoupon',coupon,function(error){
      if (error){
        createAlert(error.reason);
      }else{
        Router.go('coupons');
      }
    });
  }
});
