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
  Session.set('couponTitle',(this.data._id)?this.data.title:'Заголовок');
  Session.set('couponCoupon',(this.data._id)?this.data.coupon:'Купон');
  Session.set('couponDescription',(this.data._id)?this.data.description:'Описание');
  Session.set('couponAddInfoLabel',(this.data._id)?this.data.addInfoLabel:'Дополнительная');
  Session.set('couponAddInfoValue',(this.data._id)?this.data.addInfoValue:'Информация');
  Session.set('couponCode',(this.data._id)?this.data.code:'Код');
  Session.set('couponLogo',(this.data._id)?this.data.logo:'/sample-logo.png');
  Session.set('couponBanner',(this.data._id)?this.data.banner:'/sample-background.png');

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

  $('.progress').hide();

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

  'click #delete': function(e){
      e.preventDefault();
      if (confirm("Вы точно хотите удалить этот купон?")){
        Coupons.remove({_id:this._id}, function(error){
          if (error){
              alert(error.reason);
            }else{
              Router.go('coupons');
            }
        });
      }
  },

  'click #save': function(e){
    e.preventDefault();

    var coupon = {
      title: Session.get('couponTitle'),
      coupon: Session.get('couponCoupon'),
      description: Session.get('couponDescription'),
      addInfoLabel: Session.get('couponAddInfoLabel'),
      addInfoValue: Session.get('couponAddInfoValue'),
      code: Session.get('couponCode'),
      logo: Session.get('couponLogo'),
      banner: Session.get('couponBanner')
    };

    if (this._id){
      _.extend(coupon,{_id:this._id});
    }

    Meteor.call('saveCoupon',coupon,function(error){
      if (error){
        alert(error.reason);
      }else{
        Router.go('coupons');
      }
    });
  },
});