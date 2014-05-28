Template.couponsList.helpers({
  coupons: function(){
    return Coupons.find();
  },

  primaryFieldValue: function(){
    return this.coupon.primaryFields[0].value;
  },

  primaryFieldLabel: function(){
    return this.coupon.primaryFields[0].label;
  }

});

/*
Template.couponsList.events({
  'click #new': function (e){
    e.preventDefault();
    Meteor.call('saveEmpty',function(error,couponId){
      if (error){
        alert(error.reason);
      }else{
         Router.go('coupon',{_id:couponId});
      }
    });
  }

});
*/
