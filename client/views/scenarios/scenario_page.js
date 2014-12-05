Template.scenarioPage.rendered = function (){

    $('#beacons').select2({
        allowClear: false
    });
    
    $('#proximity').select2({
        allowClear: false
    });

    $('#event').select2({
        allowClear: false
    });
    
    $('#frequency').select2({
        allowClear: false
    });
    
    $('#message').select2({
        allowClear: false
    });
    
    $('#coupon').select2({
        allowClear: true
    });
    
    var data = this.data;

    $(function () {
        $('#start_dp').datetimepicker({
            language: 'ru',
            pickTime: false
        });
        if (data && data.start)
            $('#start_dp').data("DateTimePicker").setDate(data.start);

    });

    $(function () {
        $('#end_dp').datetimepicker({
            language: 'ru',
            pickTime: false
        });
        if (data && data.end)
            $('#end_dp').data("DateTimePicker").setDate(data.end);
    });
    
    if (this.data){
        Session.set('isNewScenario', false);
        Session.get('scenario.active',this.data.active);
        Session.set('scenario.name',this.data.name);
        Session.set('scenario.start',this.data.start);
        Session.set('scenario.end',this.data.end);
        
        $('#beacons').val(this.data.beacons).trigger('change');
        $('#proximity').val(this.data.proximity).trigger('change');
        $('#event').val(this.data.event).trigger('change');
        $('#message').val(this.data.message).trigger('change');
        $('#coupon').val(this.data.coupon).trigger('change');
        $('#frequency').val(this.data.frequency).trigger('change');
    }else{
        Session.set('isNewScenario', true);
        Session.set('scenario.active',true);
        Session.set('scenario.start',undefined);
        Session.set('scenario.end',undefined);
        Session.set('scenario.name', undefined);
        Session.set('scenario.beacons',undefined);
        Session.set('scenario.event',$('#event').val());
        Session.set('scenario.proximity',$('#proximity').val());
        Session.set('scenario.message',$('#message').val());
        Session.set('scenario.coupon',undefined);
        Session.set('scenario.frequency',undefined);
    }
}

Template.scenarioPage.events({
    'change #name': function(e,t) {
        Session.set('scenario.name',e.target.value);
    },
    
    'change #active': function(e,t){
        Session.set('scenario.active',$(e.target).is(':checked'));
    },
    
    'change #event': function(e,t){
        Session.set('scenario.event',e.target.value);
    },
    
    'change #proximity': function(e,t){
        Session.set('scenario.proximity',e.target.value);
    },
    
    'change #message': function(e,t){
        Session.set('scenario.message',e.target.value);
    },
    
    'change #coupon': function(e,t){
        Session.set('scenario.coupon',e.target.value);
    },
    
    'change #frequency': function(e,t){
        Session.set('scenario.frequency',e.target.value);
    },
    
    'change #beacons': function(e,t){
        Session.set('scenario.beacons',$(e.target).val());
    },
    
    'change #start_dp': function(e,t){
        var d  = $(e.target).find('[id=start]').val();
        if (d) d = new Date(d.replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1'));
        Session.set('scenario.start',d);        
    },
    
    'change #end_dp': function(e,t){
        var d  = $(e.target).find('[id=end]').val();
        if (d) d = new Date(d.replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1'));
        Session.set('scenario.end',d);
    },
    
    'click #delete':function(e){
        e.preventDefault();
        Scenarios.remove({_id:this._id}, function(error){
            if (error){
                createAlert('Danger',error.reason);
            }else{
                Router.go('scenarios');
            }
        });

    },

    'submit form':function(e){
        e.preventDefault();

        var scenario = {
            name: $(e.target).find('[id=name]').val(),
            beacons: [],
            proximity: $(e.target).find('[id=proximity]').val(),
            event: $(e.target).find('[id=event]').val(),
            message: $(e.target).find('[id=message]').val(),
            coupon: $(e.target).find('[id=coupon]').val(),
            frequency: $(e.target).find('[id=frequency]').val(),
            start: $(e.target).find('[id=start]').val(),
            end: $(e.target).find('[id=end]').val(),
            active: ($(e.target).find('[id=active]:checked').val()) ? true:false

        }

        var beacons = $(e.target).find('[id=beacons]').val();

        _.each(beacons,function(tag){
            scenario.beacons.push(tag);
        });

        if (scenario.start){
            scenario.start = new Date(scenario.start.replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1'));
        }

        if (scenario.end){
            scenario.end = new Date(scenario.end.replace(/(\d{2})\.(\d{2})\.(\d{4})/,'$3-$2-$1'));
        }

        if (this._id){
          _.extend(scenario,{_id:this._id});
        }

        Meteor.call('saveScenario',scenario,function (error){
            if (error){
              createAlert('Danger',error.reason);
            }else{
              Router.go('scenarios');
            }
        });
    }

});

Template.scenarioPage.helpers({
    messages: function(){
        return Messages.find();
    },
    
    coupons: function(){
        return Coupons.find();
    },
    
    beacons: function(){
        return Session.get('scenario.beacons');
    },
    
    name: function(){
        return Session.get('scenario.name');
    },
       
    tags: function(){
        return Tags.find();
    },
    
    proximities: function(){
        return PROXIMITIES;
    },

    events: function(){
        return EVENTS;
    },
    
    frequencies: function(){
        return FREQUENCIES;
    },
    
    isChecked: function(){
        if (this.active || !this._id){
            return 'checked';
        }else{
            return '';
        }
    },
    
    isNewScenario: function(){
        return Session.get('isNewScenario');
    },
    
    logoText: function(){
        return this.pass.logoText;
    },
    
    primaryFieldValue: function(){
        return this.pass.coupon.primaryFields[0].value;
    },

    primaryFieldLabel: function(){
        return this.pass.coupon.primaryFields[0].label;
    },
    
    label: function(type){
        var col = [];
        var code = ''

        if (type === 'event'){
            col = EVENTS;
            code = Session.get('scenario.event');
        }else if (type === 'proximity'){
            col = PROXIMITIES;
            code = Session.get('scenario.proximity');
        }else if (type === 'frequency'){
            col = FREQUENCIES;
            code = Session.get('scenario.frequency');
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
    
    messageInfo: function(){
        var m = Messages.findOne(Session.get('scenario.message'));
        if (m){
            return m.header;
        }else{
            return "";
        }
    },
    
    hasCoupon: function(){
        return (Session.get('scenario.coupon'))?true:false;
    },
    
    couponInfo: function(){
        var c = Coupons.findOne(Session.get('scenario.coupon'));
        if (c){
            return c.pass.logoText+" : "+c.pass.coupon.primaryFields[0].value+" "+c.pass.coupon.primaryFields[0].label;
        }else{
            return "";
        }
    },
    
    period: function (){
        if (Session.get('scenario.start')){
            if (Session.get('scenario.end')){
                return 'с '+commonFormatDate.call(this, Session.get('scenario.start'))+' по '+ commonFormatDate.call(this, Session.get('scenario.end'));
            }else{
                return 'с '+commonFormatDate.call(this, Session.get('scenario.start'));
            }
        }else{
            if (Session.get('scenario.end')){
                return 'по '+ commonFormatDate(this, Session.get('scenario.end'));
            }else{
                return 'без ограничений по времени';
            }
        }

    },
    
    isActive: function (){
        if (Session.get('scenario.active')){
            return 'Да';
        }else{
            return 'Нет';
        }
    },
    
    frequency: function(){
        return Session.get('scenario.frequency');
    }
});
