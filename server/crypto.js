AWSSecretKey = "TLi7xku2jMRH4OEBobQ2O5GRkI4SOJaGI3MbDraI";

Meteor.methods({
  'encodePolicy':function(jsonPolicy){
    if (Meteor.isServer) {
      var buffer=new Buffer(JSON.stringify(jsonPolicy));
      var policy=buffer.toString("base64");
      return policy;
    }
  },
  'encodeSignature':function(policy){
    if (Meteor.isServer) {
      var crypto = Meteor.require('crypto');
      var hmac=crypto.createHmac("sha1",AWSSecretKey);
      hmac.update(policy);
      return hmac.digest("base64");
    }
  }
});
