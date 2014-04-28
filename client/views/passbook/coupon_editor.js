var policy = {
  "expiration": "2015-01-01T00:00:00Z",
  "conditions": [
    {"bucket": "spru"},
    ["starts-with", "$key", "uploads/"+Meteor.userId()+"/"],
    {"acl": "public-read"},
    {"success_action_status": "201"},
    {"success_action_redirect": "/"},
    ["content-length-range", 0, 1048576]
  ]
};

Template.couponEditor.rendered=function(){
  $('.progress').hide();

  Session.set('couponTitle',(this.data && this.data._id)?this.data.title:'!Заголовок');
  Session.set('couponCoupon',(this.data && this.data._id)?this.data.coupon:'!Купон');
  Session.set('couponDescription',(this.data && this.data._id)?this.data.description:'!Описание');
  Session.set('couponAddInfoLabel',(this.data && this.data._id)?this.data.addInfoLabel:'!Дополнительная');
  Session.set('couponAddInfoValue',(this.data && this.data._id)?this.data.addInfoValue:'!Информация');
  Session.set('couponCode',(this.data && this.data._id)?this.data.code:'!Код - 777 - 555');

  Session.set('couponLogo',(this.data && this.data._id)?this.data.logo:'');
  Session.set('couponBanner',(this.data && this.data._id)?this.data.banner:'');
  Session.set('couponBgColor',(this.data && this.data._id)?this.data.bgColor:'');
  Session.set('couponTextColor',(this.data && this.data._id)?this.data.textColor:'');
  Session.set('couponAddInfoTextColor',(this.data && this.data._id)?this.data.addInfoTextColor:'');

  /*
  Meteor.call('encodePolicy',policy,function(err,pdata){
    if (err){
      alert("Can't encode s3 policy!");
    }
    Session.set('policy',pdata);

    Meteor.call('encodeSignature',pdata,function(err,sdata){
      if (err){
        alert("Can't encode s3 signature!");
      }
      Session.set('signature',sdata);
    });
  });
*/

/*
  $('#logoUpload').fileupload({
      //forceIframeTransport: true,
      autoUpload: true,
      dataType: 'xml',
      add: function(e, data){
        console.log('add');
        data.submit();
      },
      send: function(e,data){
        $('#logoUpload > .progress').fadeIn();
      },
      progress: function(e, data){
        var percent = Math.round((data.loaded / data.total) * 100);
        $('#logoUpload > .progress > .progress-bar').css('width', percent + '%')
      },
      success: function (data){
        var url = $(data).find('Location').text();
        Session.set('couponLogo',unescape(url));
        console.log('url: '+unescape(url));
      },
      fail: function(e,data){
        console.log('fail');
      },
      done: function (e, data) {
        $('#logoUpload > .progress').fadeOut(300, function() {
          $('#logoUpload > .progress >.progress-bar').css('width', 0);
        });
      }
  });

  $('#bannerUpload').fileupload({
      //forceIframeTransport: true,
      autoUpload: true,
      dataType: 'xml',
      add: function(e, data){
        console.log('add');
        data.submit();
      },
      send: function(e,data){
        $('#bannerUpload > .progress').fadeIn();
      },
      progress: function(e, data){
        var percent = Math.round((data.loaded / data.total) * 100);
        $('#bannerUpload > .progress > .progress-bar').css('width', percent + '%')
      },
      success: function (data){
        var url = $(data).find('Location').text();
        Session.set('couponBanner',unescape(url));
        console.log('url: '+unescape(url));
      },
      fail: function(e,data){
        console.log('fail');
      },
      done: function (e, data) {
        $('#bannerUpload > .progress').fadeOut(300, function() {
          $('#bannerUpload > .progress > .progress-bar').css('width', 0);
        });
      }
  });
*/
  $('.bgColor').colorpicker({format:'rgb'}).on('changeColor', function(ev){
    Session.set('couponBgColor',ev.color.toHex());
  });
  $('.textColor').colorpicker({format:'rgb'}).on('changeColor', function(ev){
    Session.set('couponTextColor',ev.color.toHex());
  });
  $('.addInfoTextColor').colorpicker({format:'rgb'}).on('changeColor', function(ev){
    Session.set('couponAddInfoTextColor',ev.color.toHex());
  });
};

Template.couponEditor.helpers({
  'key':function(){
    return AWSAccessKeyId;
  },
  'policy':function(){
      return Session.get('policy');
  },
  'signature':function(){
      return Session.get('signature');
  },
  'userId': function(){
    return Meteor.userId();
  },
  'logoFilePrefix': function(){
    return (new Date()).getTime();
  },
  'bannerFilePrefix': function(){
    return (new Date()).getTime();
  }

});

Template.couponEditor.events({
  'change #title': function(e){
    Session.set('couponTitle',$(event.target).val());
  },
  'change #coupon': function(e){
    Session.set('couponCoupon',$(event.target).val());
  },
  'change #description': function(e){
    Session.set('couponDescription',$(event.target).val());
  },
  'change #addInfoLabel': function(e){
    Session.set('couponAddInfoLabel',$(event.target).val());
  },
  'change #addInfoValue': function(e){
    Session.set('couponAddInfoValue',$(event.target).val());
  },
  'change #code': function(e){
    Session.set('couponCode',$(event.target).val());
  },
  'change #logoUpload': function(e){
    var fsFile = new FS.File(e.target.files[0]);
    fsFile.userId = Meteor.userId();
    Logos.insert(fsFile,function(err,fileObj){
      if (err){
        console.log(err);
      }else{
        Session.set('couponLogo',fileObj._id);
      }
    });
  },
  'change #bannerUpload': function(e){
    var fsFile = new FS.File(e.target.files[0]);
    fsFile.userId = Meteor.userId();
    Banners.insert(fsFile,function(err,fileObj){
      if (err){
        console.log(err);
      }else{
        Session.set('couponBanner',fileObj._id);
      }
    });
  }
});
