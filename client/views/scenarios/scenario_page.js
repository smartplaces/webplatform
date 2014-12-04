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
        
        Session.set('scenario.name',this.data.name);
        Session.set('scenario.beacons',this.data.beacons.length);
        
        $('#beacons').val(this.data.beacons).trigger('change');
        $('#proximity').val(this.data.proximity).trigger('change');
        $('#event').val(this.data.event).trigger('change');
        $('#message').val(this.data.message).trigger('change');
        $('#coupon').val(this.data.coupon).trigger('change');
        $('#frequency').val(this.data.frequency).trigger('change');
    }else{
        Session.set('isNewScenario', true);
        Session.set('scenario.name',undefined);
        Session.set('scenario.beacons',undefined);
    }
}

Template.scenarioPage.events({
    'change #name': function(e,t) {
        Session.set('scenario.name',e.target.value);
    },
    
    'change #beacons': function(e,t){
        Session.set('scenario.beacons',e.target.value);
    },
    
    'click #delete':function(e){
      e.preventDefault();
      if (confirm("Вы действительно хотите удалить этот сценарий?")){
        Scenarios.remove({_id:this._id}, function(error){
          if (error){
              createAlert('Danger',error.reason);
            }else{
              Router.go('scenarios');
            }
        });
      }
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
    }
});
