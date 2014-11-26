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


Template.couponsList.events({
  'click .coupon-item-remove': function (e){
    e.preventDefault();
    if (confirm("Вы уверены, что хотите удалить этот купон?")){
      console.log('Delete coupon with id '+e.target.id);
      Coupons.remove(e.target.id);
    };
  },
  'click #new': function(e,t){
    Meteor.call('saveEmpty',function(err,id){
      if (err){
        console.log(err);
      }else{
        Router.go('/coupons/'+id);
      }
    });
  }
});
