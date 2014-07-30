Template.couponEditor.rendered=function(){

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
        locationData.push(loc._id);
      });
    }
  }

  $('#locations').select2({
      allowClear: true,
  });

  $("#locations").on("change", function(e) { Session.set('coupon.locations',e.val);});

  $('#locations').val(locationData).trigger('change');

  Session.set('coupon.locations', $('#locations').val());


};

Template.couponEditor.helpers({
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
    Session.set('coupon.logoText',$(event.target).val());
  },
  'change #primaryFieldValue': function(e){
    Session.set('coupon.primaryFieldValue',$(event.target).val());
  },
  'change #primaryFieldLabel': function(e){
    Session.set('coupon.primaryFieldLabel',$(event.target).val());
  },
  'change #secondaryFieldLabel': function(e){
    Session.set('coupon.secondaryFieldLabel',$(event.target).val());
  },
  'change #secondaryFieldValue': function(e){
    Session.set('coupon.secondaryFieldValue',$(event.target).val());
  },
  'change #barcodeMessage': function(e){
    Session.set('coupon.barcodeMessage',$(event.target).val());
  },
  'change #notify' : function (e){
    Session.set('coupon.notify',$(event.target).is(':checked'));
  },
  'change #logo': function(e,t){
    var fsFileL = new FS.File(e.target.files[0]);
    var fsFileI = new FS.File(e.target.files[0]);

    fsFileL.userId = Meteor.userId();

    fsFileI.userId = Meteor.userId();

    var logo = Logos.insert(fsFileL,function(err,fileObj){
      if (err){
        console.log(err);
      }else{
        Session.set('coupon.logo',fileObj._id);
        Session.set('coupon.icon',fileObj._id);
      }
    });

    /*
    var icon = Icons.insert(fsFileI,function(err,fileObj){
      if (err){
        console.log(err);
      }else{
        Session.set('coupon.icon',fileObj._id);
      }
    });
    */

    var sid='default';
    try{
      sid = t.data.images.strip._id;
    }catch(e){}

    Router.go('/coupons/'+t.data._id+'/icon/'+logo._id+'/logo/'+logo._id+'/strip/'+sid);

    /*
    Deps.autorun(function(comp){
      var l = Logos.findOne(logo._id);
      var p = l.uploadProgress();
      Session.set('progress',  (p==0)?5:p);
      if (l.isUploaded()){
        $('div.progress').hide();
        comp.stop();
        Router.go('/coupons/'+t.data._id+'/logo/'+logo._id);
      }
    });
    */
  },
  'change #strip': function(e,t){
    var fsFile = new FS.File(e.target.files[0]);
    fsFile.userId = Meteor.userId();

    var strip = Strips.insert(fsFile,function(err,fileObj){
      if (err){
        console.log(err);
      }else{
        Session.set('coupon.strip',fileObj._id);
      }
    });

    var lid='default';
    try{
      lid = t.data.images.logo._id;
    }catch(e){}

    var iid='default';
    try{
      iid = t.data.images.icon._id;
    }catch(e){}


    Router.go('/coupons/'+t.data._id+'/icon/'+iid+'/logo/'+lid+'/strip/'+strip._id);
    /*
    Deps.autorun(function(comp){
      var s = Strips.findOne(strip._id);
      var p = s.uploadProgress();
      Session.set('progress',  (p==0)?5:p);
      if (s.isUploaded()){
        $('div.progress').hide();
        comp.stop();
      }
    });
    */
  }
});
