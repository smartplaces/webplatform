Template.couponEditor.events({
  'change #title': function(e){
    Session.set('couponTitle',$(event.target).val());
  },
  'change #coupon': function(e){
    Session.set('couponCoupon',$(event.target).val());
  },
  'change #description': function(e){
    Session.set('couponDescription',$(event.target).val());
  },
  'change #additionalInfo': function(e){
    Session.set('couponAdditionalInfo',$(event.target).val());
  },
  'change #code': function(e){
    Session.set('couponCode',$(event.target).val());
  }
});
