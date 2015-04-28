Conversations = new Mongo.Collection("conversations");

if (Meteor.isClient) {
  Template.conversations.helpers({
    conversationList: function () {
      return Conversations.find({}, {sort: { name: 1}});
    }
  });

    Template.conversations.events({
        'click .js-add-convo': function () {
            var newThreadInput = document.getElementById("new-thread");
            var val = newThreadInput.value;

            if(val === '')
                return false;

            newThreadInput.value = '';
            Conversations.insert({
                name: val,
                threads: []
            });
        }
    });

    Template.convo.events({
        'click .js-remove-convo': function () {
            Conversations.remove(this._id);
        }
    });

    Template.convo.events({
        'click .js-add-pin': function () {
            var newThreadInput = document.getElementById("new-thread");
            var val = newThreadInput.value;

            if(val === '')
                return false;

            newThreadInput.value = '';
            if(!this.threads) {
                this.threads = [];
            }
            this.threads.push({ topic: val });
            Conversations.update(this._id, this);
        }
    });

    Template.convo.events({
        'click .js-remove-pin': function () {
            console.log(this.threads.indexOf(this));
        }
    });


}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Conversations.find().count() === 0) {
      var names = ["Marcia", "Chris", "New"];
      _.each(names, function (name) {
        Conversations.insert({
          name: name,
            threads: []
        });
      });
    }
  });
}
