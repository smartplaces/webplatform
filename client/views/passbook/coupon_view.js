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
  addInfoLabel: function(){
    return Session.get('couponAddInfoLabel');
  },
  addInfoValue: function(){
    return Session.get('couponAddInfoValue');
  },
  code: function(){
    return Session.get('couponCode');
  },
  logo: function(){
    return Session.get('couponLogo');
  },
  banner: function(){
    return Session.get('couponBanner');
  },
  bgColor: function(){
    return Session.get('couponBgColor');
  },
  bgColor2: function(){
    return '#dfdfed';
  },
  textColor: function(){
    return Session.get('couponTextColor');
  },
  addInfoTextColor: function(){
    return Session.get('couponAddInfoTextColor');
  }
});
