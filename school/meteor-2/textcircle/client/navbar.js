Template.navbar.helpers({
  documents: function() {
    return Documents.find();
  }
});

Template.navbar.events({
  "click .js-add-doc": function(event) {
    event.preventDefault();
    if(!Meteor.user()) {
      alert("log in first");
      return;
    }

    Meteor.call("addDoc", function(err, data){
      Session.set("docId", data);

    });

  },
  "click .js-load-doc": function(){
    Session.set("docId", this._id);
  }
})
