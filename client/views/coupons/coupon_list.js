Template.couponsList.helpers({
    coupons: function(){
        return Coupons.find();
    },

    primaryFieldValue: function(){
        return this.coupon.primaryFields[0].value;
    },

    primaryFieldLabel: function(){
        return this.coupon.primaryFields[0].label;
    },

    confirmData: function(){
        return {
            title: "Удаление купона",
            body: "Вы уверены, что хотите удалить этот купон?",
            actionClass: 'remove-confirm-ok'
        };
    }

});


Template.couponsList.events({
    'click .coupon-item-remove': function (e){
        e.preventDefault();
        Session.set('unconfirmDeleteCoupon',e.target.id);
        $('#confirmModal').modal('show');
    },
    
    'click .remove-confirm-ok': function(e,t){
        e.preventDefault();
        var id = Session.get('unconfirmDeleteCoupon');
        Session.set('unconfirmDeleteCoupon',undefined);
        $('#confirmModal').modal('hide');
        Coupons.remove(id, function(error){
            if (error){
                createAlert(error.reason);
            }
        });
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
