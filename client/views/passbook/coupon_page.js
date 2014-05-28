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
      if (confirm("Вы точно хотите удалить этот купон?")){
        if (this.images){
          /*
          if (this.images && this.images.icon)
            Icons.remove({_id:this.images.icon._id},function(error){if (error) console.log(error);});
            */
          if (this.images && this.images.logo)
            Logos.remove({_id:this.images.logo._id},function(error){if (error) console.log(error);});
          if (this.images && this.images.strip)
          Strips.remove({_id:this.images.strip._id},function(error){if (error) console.log(error);});
        }
        Coupons.remove({_id:this._id}, function(error){
          if (error){
              alert(error.reason);
            }
        });
        Router.go('coupons');
      }
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
      labelColor:          Session.get('coupon.labelColor')
    };

    Meteor.call('saveCoupon',coupon,function(error){
      if (error){
        alert(error.reason);
      }else{
        Router.go('coupons');
      }
    });
  }
});
