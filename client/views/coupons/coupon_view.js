Template.couponView.helpers({
  logoText: function(){
    return Session.get('coupon.logoText');
  },
  primaryFieldValue: function(){
    return Session.get('coupon.primaryFieldValue');
  },
  primaryFieldLabel: function(){
    return Session.get('coupon.primaryFieldLabel');
  },
  secondaryFieldLabel: function(){
    return Session.get('coupon.secondaryFieldLabel');
  },
  secondaryFieldValue: function(){
    return Session.get('coupon.secondaryFieldValue');
  },
  barcodeMessage: function(){
    return Session.get('coupon.barcodeMessage');
  },
  logo: function(){
    var logo = Images.findOne(Session.get('coupon.logo'));
    if (logo){
      return logo;
    }else{
      return {
        url: function(){return '/logo.png';}
      }
    }
  },
  strip: function(){
    var strip = Images.findOne(Session.get('coupon.strip'));
    if (strip){
      return strip;
    }else{
      return {
        url: function(){return '/background.png';}
      };
    }
  },
  backgroundColor: function(){
    return Session.get('coupon.backgroundColor');
  },
  backgroundColor2: function(){
    return '#dfdfed';
  },
  foregroundColor: function(){
    return Session.get('coupon.foregroundColor');
  },
  labelColor: function(){
    return Session.get('coupon.labelColor');
  }
});
