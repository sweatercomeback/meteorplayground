Meteor.subscribe("documents");
Meteor.subscribe("editingUsers");
Meteor.subscribe("comments");

Template.editor.helpers({
  docid: function() {
    setupCurrentDocument();
    return Session.get("docId");
  },
  config: function() {
    return function(editor) {
      editor.setOption("lineNumbers", true);
      editor.setOption("mode", "html");
      editor.setOption("theme", "cobalt");
      editor.on("change", function(cm_editor) {
        $("#viewer_iframe").contents().find("html").html(
          cm_editor.getValue());
          Meteor.call("addEditingUser", Session.get("docId"));
      });
    }
  }

});

Template.editingUsers.helpers({
  users: function(){
    var doc, eusers, users;
    doc = Documents.findOne({_id: Session.get("docId")});
    if(!doc) {return;}
    eusers = EditingUsers.findOne({docid: doc._id});
    if(!eusers){return;}
    users = _.reduce(eusers.users, function(list, u){
      list.push(fixObjectKeys(u));
      return list;
    }, []);
    return users;
  }
});

Template.docList.helpers({
  documents: function() {
    return Documents.find();
  }
});


Template.docMeta.helpers({
  document: function() {
    return Documents.findOne({_id: Session.get("docId")});
  },
  canEdit: function() {
    var doc = Documents.findOne({_id: Session.get("docId"), owner: Meteor.userId()});
    return !!doc;
  }
});

Template.editableText.helpers({
  userCanEdit : function(doc, Collection) {
    doc = Documents.findOne({_id: Session.get("docId"), owner: Meteor.userId()});
    return !!doc;
  }
});

Template.insertCommentForm.helpers({
  docId: function() {
    return Session.get("docId");
  }
});

Template.comments.helpers({
  comments: function() {
    return Comments.find({docId: Session.get("docId")});
  }
});

Template.docMeta.events({
  "click .js-toggle-private": function(event) {
    console.log(event.target.checked);

    var doc = {
      _id: Session.get("docId"),
      isPrivate: event.target.checked
    };

    Meteor.call("updateDocPrivacy", doc);

  }
});



function fixObjectKeys(obj) {
  var newObj = {  };
  for (key in obj) {
    var key2 = key.replace("-", "");
    newObj[key2] = obj[key];
  }
  return newObj;
}

function setupCurrentDocument() {
    var doc;
    if(!Session.get("docId")) {
      doc = Documents.findOne();
      if(doc){
        Session.set("docId", doc._id);
      }
    }
}
