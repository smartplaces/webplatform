Template.couponPage.helpers({
  pass: function(){
    return Passes.findOne({couponId:this._id});
  }
});
Template.couponPage.events({

  'click #delete': function(e){
      e.preventDefault();
      if (confirm("Вы точно хотите удалить этот купон?")){
        Logos.remove({_id:this.logo},function(error){if (error) console.log(error);});
        Banners.remove({_id:this.banner},function(error){if (error) console.log(error);});
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
  },
  'click #download':function(e){
    e.preventDefault();
    Meteor.call('createPass',this._id,function (err,pid){
      if (err) console.log(err); else alert('Купон сгенерирован!');
    });
  }

});
