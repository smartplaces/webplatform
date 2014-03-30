Template.couponPage.events({

  'click #delete': function(e){
      e.preventDefault();
      if (confirm("Вы точно хотите удалить этот купон?")){
        Coupons.remove({_id:this._id}, function(error){
          if (error){
              alert(error.reason);
            }else{
              Router.go('coupons');
            }
        });
      }
  },

  'click #save': function(e){
    e.preventDefault();

    var coupon = {
      title: Session.get('couponTitle'),
      coupon: Session.get('couponCoupon'),
      description: Session.get('couponDescription'),
      addInfoLabel: Session.get('couponAddInfoLabel'),
      addInfoValue: Session.get('couponAddInfoValue'),
      code: Session.get('couponCode'),
      logo: Session.get('couponLogo'),
      banner: Session.get('couponBanner'),
      bgColor:Session.get('couponBgColor'),
      textColor:Session.get('couponTextColor'),
      addInfoTextColor:Session.get('couponAddInfoTextColor')
    };

    if (this._id){
      _.extend(coupon,{_id:this._id});
    }

    Meteor.call('saveCoupon',coupon,function(error){
      if (error){
        alert(error.reason);
      }else{
        Router.go('coupons');
      }
    });
  }

});
