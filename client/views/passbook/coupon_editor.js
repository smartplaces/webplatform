Template.couponEditor.rendered=function(){
  if (this.data && this.data.pass){
  Session.set('coupon.logoText',(this.data && this.data._id)?this.data.pass.logoText:'!Заголовок');

  Session.set('coupon.primaryFieldValue',(this.data && this.data._id)?this.data.pass.coupon.primaryFields[0].value:'!Купон');
  Session.set('coupon.primaryFieldLabel',(this.data && this.data._id)?this.data.pass.coupon.primaryFields[0].label:'!Описание');

  Session.set('coupon.secondaryFieldLabel',(this.data && this.data._id)?this.data.pass.coupon.secondaryFields[0].label:'!Дополнительная');
  Session.set('coupon.secondaryFieldValue',(this.data && this.data._id)?this.data.pass.coupon.secondaryFields[0].value:'!Информация');

  Session.set('coupon.barcodeMessage',(this.data && this.data._id)?this.data.pass.barcode.message:'!Код - 777 - 555');

  Session.set('coupon.icon',(this.data && this.data._id && this.data.images && this.data.images.icon)?this.data.images.icon._id:'');
  Session.set('coupon.logo',(this.data && this.data._id && this.data.images && this.data.images.logo)?this.data.images.logo._id:'');
  Session.set('coupon.strip',(this.data && this.data._id && this.data.images && this.data.images.strip)?this.data.images.strip._id:'');


  Session.set('coupon.backgroundColor',(this.data && this.data._id)?this.data.pass.backgroundColor:'');
  Session.set('coupon.foregroundColor',(this.data && this.data._id)?this.data.pass.foregroundColor:'');
  Session.set('coupon.labelColor',(this.data && this.data._id)?this.data.pass.labelColor:'');
  
  $('.backgroundColor').colorpicker({format:'rgb'}).on('changeColor', function(ev){
    Session.set('coupon.backgroundColor',ev.color.toHex());
  });

  $('.foregroundColor').colorpicker({format:'rgb'}).on('changeColor', function(ev){
    Session.set('coupon.foregroundColor',ev.color.toHex());
  });

  $('.labelColor').colorpicker({format:'rgb'}).on('changeColor', function(ev){
    Session.set('coupon.labelColor',ev.color.toHex());
  });

  Session.set('coupon.notify',false);

  var locationData = [];
  if (this.data && this.data._id){
    if (this.data.pass.beacons && this.data.pass.beacons.length > 0){
      _.each(this.data.pass.beacons,function(b){
        var loc = Locations.findOne({uuid:b.proximityUUID, major:b.major});
        if (loc){
          locationData.push(loc._id);
        }
      });
    }
  }

  $('#locations').select2({
      allowClear: true,
  });

  $("#locations").on("change", function(e) { Session.set('coupon.locations',e.val);});

  $('#locations').val(locationData).trigger('change');

  Session.set('coupon.locations', $('#locations').val());

  var format = function(state) {
    if (state.id){
      var i = Images.findOne(state.id);
      if (i){
        return '<img src="'+i.url({store:'thumbnail'})+'"/>';  
      }else{
        return state.text;  
      }
    }else{
      return state.text;  
    }
    
  }
  
  $('#logo').select2({
    formatResult: format,
    escapeMarkup: function(m) { return m; }
  });
  
  if (this.data && this.data.images && this.data.images.logo){
    $('#logo').val(this.data.images.logo._id).trigger('change');
  }
  
  $('#strip').select2({
    formatResult: format,
    escapeMarkup: function(m) { return m; }
  });
  
  if (this.data && this.data.images && this.data.images.strip){
    $('#strip').val(this.data.images.strip._id).trigger('change');  
  }
  }

};

Template.couponEditor.helpers({
  imagesList: function(){
    return Images.find();
  },
  locations: function(){
    return Locations.find();
  },
  primaryFieldValue: function(){
    return this.coupon.primaryFields[0].value;
  },
  primaryFieldLabel: function(){
    return this.coupon.primaryFields[0].label;
  },
  secondaryFieldLabel: function(){
    return this.coupon.secondaryFields[0].label;
  },
  secondaryFieldValue: function(){
    return this.coupon.secondaryFields[0].value;
  },
  barcodeMessage: function(){
    return this.barcode.message
  },
  progress: function(){
    var progress = Session.get('progress') || "0";
    console.log(progress);
    return progress;
  }
});

Template.couponEditor.events({
  'change #logoText': function(e){
    Session.set('coupon.logoText',e.target.value);
  },
  'change #primaryFieldValue': function(e){
    Session.set('coupon.primaryFieldValue',e.target.value);
  },
  'change #primaryFieldLabel': function(e){
    Session.set('coupon.primaryFieldLabel',e.target.value);
  },
  'change #secondaryFieldLabel': function(e){
    Session.set('coupon.secondaryFieldLabel',e.target.value);
  },
  'change #secondaryFieldValue': function(e){
    Session.set('coupon.secondaryFieldValue',e.target.value);
  },
  'change #barcodeMessage': function(e){
    Session.set('coupon.barcodeMessage',e.target.value);
  },
  'change #notify' : function (e){
    Session.set('coupon.notify',$(e.target).is(':checked'));
  },
  'change #logo': function(e,t){
    Session.set('coupon.logo',e.target.value);
    Session.set('coupon.icon',e.target.value);
  },
  'change #strip': function(e,t){
    Session.set('coupon.strip',e.target.value);
  }
});
