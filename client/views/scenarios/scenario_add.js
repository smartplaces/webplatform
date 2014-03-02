Template.scenarioNewPage.rendered = function (){
    $('#message').select2({
        allowClear: false
    });

    $('#beacons').select2({
        allowClear: false
    });

    if (this.data.beacons)
        $('#beacons').val(this.data.beacons).trigger('change');

    $('#proximity').select2({
        allowClear: false
    });

    if (this.data.proximity)
        $('#proximity').val(this.data.proximity).trigger('change');

    $('#event').select2({
        allowClear: false
    });

    if (this.data.event)
        $('#event').val(this.data.event).trigger('change');

    $('#frequency').select2({
        allowClear: false
    });

    if (this.data.frequency)
        $('#frequency').val(this.data.frequency).trigger('change');

    var data = this.data;


    $(function () {
        $('#start_dp').datetimepicker({
             language: 'ru',
             pickTime: false
        });
        if (data.start)
            $('#start_dp').data("DateTimePicker").setDate(data.start);

    });

    $(function () {
         $('#end_dp').datetimepicker({
             language: 'ru',
             pickTime: false
         });
        if (data.end)
            $('#end_dp').data("DateTimePicker").setDate(data.end);
    });
}

Template.scenarioNewPage.helpers({
    messages: function(){
        return Messages.find();
    },
    messageInfo: function(){
        var message = Messages.findOne(this.message);
        if (message){
            return message.text;
        }else{
            return '';
        }
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
    }
});

Template.scenarioNewPage.events({
    'click #delete':function(e){
      e.preventDefault();
      if (confirm("Вы действительно хотите удалить этот сценарий?")){
        Scenarios.remove({_id:this._id}, function(error){
          if (error){
              alert(error.reason);
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
            proximity: [],
            event: [],
            frequency: $(e.target).find('[id=frequency]').val(),
            start: $(e.target).find('[id=start]').val(),
            end: $(e.target).find('[id=end]').val(),
            active: ($(e.target).find('[id=active]:checked').val()) ? true:false

        }

        var beacons = $(e.target).find('[id=beacons]').val();

        _.each(beacons,function(tag){
            scenario.beacons.push(tag);

        });

        var proximity = $(e.target).find('[id=proximity]').val();
        _.each(proximity,function (p){
            scenario.proximity.push(p);
        });

        var event = $(e.target).find('[id=event]').val();
        _.each(event,function (e){
            scenario.event.push(e);
        });

        var message = $(e.target).find('[id=message]').val();

        if (Messages.findOne(message)){
            scenario.message = message;
        }

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
              alert(error.reason);
            }else{
              Router.go('scenarios');
            }
        });
    }

});
