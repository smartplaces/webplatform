Template.couponView.helpers({
  title: function(){
    return Session.get('couponTitle');
  },
  coupon: function(){
    return Session.get('couponCoupon');
  },
  description: function(){
    return Session.get('couponDescription');
  },
  additionalInfo: function(){
    return Session.get('couponAdditionalInfo');
  },
  code: function(){
    return Session.get('couponCode');
  }
});
