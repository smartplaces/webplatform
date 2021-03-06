Template.scenariosList.helpers({
    messageInfo: function(){
        var m = Messages.findOne(this.message);
        if (m){
            return m.header;
        }else{
            return "";
        }
    },
    scenarios: function(){
        return Scenarios.find();
    },

    period: function (){
        if (this.start){
            if (this.end){
                return 'с '+commonFormatDate.call(this, this.start)+' по '+ commonFormatDate.call(this, this.end);
            }else{
                return 'с '+commonFormatDate.call(this, this.start);
            }
        }else{
            if (this.end){
                return 'по '+ commonFormatDate(this, this.end);
            }else{
                return 'без ограничений по времени';
            }
        }

    },

    isActive: function (){
        if (this.active){
            return 'Да';
        }else{
            return 'Нет';
        }
    },

    label: function(type){
        var col = [];
        var code = ''

        if (type === 'event'){
            col = EVENTS;
            code = this.event;
        }else if (type === 'proximity'){
            col = PROXIMITIES;
            code = this.proximity;
        }else if (type === 'frequency'){
            col = FREQUENCIES;
            code = this.frequency;
        }

        var result = 'NO LABEL';
        _.each(col,function(v){
            if (v.code == code){
                result = v.label;
                return;
            }
        });

        return result;
    },

    hasCoupon: function(){
        return (this.coupon)?true:false;
    },
    
    couponInfo: function(){
        var c = Coupons.findOne(this.coupon);
        if (c){
            return c.pass.logoText+" : "+c.pass.coupon.primaryFields[0].value+" "+c.pass.coupon.primaryFields[0].label;
        }else{
            return "";
        }
    },
    
    confirmData: function(){
        return {
            title: "Удаление сценария",
            body: "Вы уверены, что хотите удалить этот сценарий?",
            actionClass: 'remove-confirm-ok'
        };
    }

});

Template.scenariosList.events({
    'click .scenario-item-remove': function (e){
        e.preventDefault();
        Session.set('unconfirmDeleteScenario',e.target.id);
        $('#confirmModal').modal('show');
    },
    
    'click .remove-confirm-ok': function(e,t){
        e.preventDefault();
        var id = Session.get('unconfirmDeleteScenario');
        Session.set('unconfirmDeleteScenario',undefined);
        $('#confirmModal').modal('hide');
        Scenarios.remove(id, function(error){
            if (error){
                createAlert(error.reason);
            }
        });
    }
});
