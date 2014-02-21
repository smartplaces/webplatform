Template.scenariosList.helpers({
  scenarios: function(){
        return Scenarios.find();
  },

  messageInfo : function (){
    var message = Messages.findOne(this.message);
    if (message){
        return message.text;
    }else{
        return '';
    }
  },

  formatDate : function (date){
    if (this[date])
      return moment(this[date]).format('DD.MM.YYYY');
    else
      return ''
  },

  isActive: function (){
    if (this.active){
      return 'Yes';
    }else{
      return 'No';
    }
  },

  label: function(type){
    var col = [];
    var code = ''

    if (type === 'event'){
      col = EVENTS;
      code = this;
    }else if (type === 'proximity'){
      col = PROXIMITIES;
      code = this;
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
  }

});
