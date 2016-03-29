Meteor.methods({
  addComment: function(comment) {
    console.log("adding comment", comment);
    if(!this.userId) {
      return;
    }

    comment.createdOn = new Date();
    comment.owner = this.userId;

    return Comments.insert(comment);

  },
  addEditingUser: function(docId) {
    var doc, user;
    doc = Documents.findOne({_id: docId});
    console.log("adding editing user", doc);
    if(!doc) {return;}
    if(!this.userId){return;}
    user = Meteor.user().profile;
    eusers = EditingUsers.findOne({docid:doc._id});
    if(!eusers){
      eusers = {
        docid: doc._id,
        users: {}
      };
    }
    eusers.lastEdit = new Date();
    eusers.users[this.userId] = user;
    EditingUsers.upsert({_id: eusers._id}, eusers);


  },
  addDoc: function() {
    var doc;

    if(!this.userId) {
      return;
    }

    doc = {
      owner: this.userId, createdOn: new Date(), title: "my new doc", isPrivate: false
    };
    var id = Documents.insert(doc);
    return id;
  },
  updateDocPrivacy: function(doc) {
    console.log(Meteor.userId(), Meteor.user()._id)
      var realDoc = Documents.findOne({_id: doc._id, owner: this.userId});
      if(realDoc) {
        realDoc.isPrivate = doc.isPrivate;
        Documents.update({_id: doc._id}, realDoc);
      }
  }
});
