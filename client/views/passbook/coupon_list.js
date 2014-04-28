Template.couponsList.helpers({
    coupons: function(){
        return Coupons.find();
    }

});

Template.couponsList.events({
  'click #new': function (e){
    e.preventDefault();

    var coupon = {
      title: 'Новый купон',
      coupon: 'Купон',
      description: 'Описание',
      addInfoLabel: 'Дополнительная',
      addInfoValue: 'Информация',
      code: 'Код',
      logo: '',
      banner: '',
      bgColor:'',
      textColor:'',
      addInfoTextColor:''
    };

    if (this._id){
      _.extend(coupon,{_id:this._id});
    }

    Meteor.call('saveCoupon',coupon,true,function(error,couponId){
      if (error){
        alert(error.reason);
      }else{
        Router.go('coupon',{_id:couponId});
      }
    });
  }
});
