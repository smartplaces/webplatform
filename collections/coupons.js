Coupons = new Meteor.Collection('coupons');

Coupons.allow({
  insert: loggedIn,
  update: owner,
  remove: owner
});

Meteor.methods({
  saveCoupon: function(coupon){
    var user = Meteor.user();
    var data = _.extend(_.pick(coupon,'title','coupon','description','addInfoLabel','addInfoValue','code','logo','banner'), {
      userId: user._id,
      updated: new Date().getTime()
    });

    if (coupon._id){
      Coupons.update(coupon._id,{$set:data},function (error){
        if (error){
          throw new Meteor.Error(500, 'Ошибка: невозможно сохранить купон :(!');
        }
      });
    }else{
      Coupons.insert(data);
    }
  }
});
