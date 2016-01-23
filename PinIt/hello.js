/* global Meteor */
/* global Template */
/* global Conversations */
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
            var newThreadInput = document.getElementById("pin_"+this.pinId);
            var val = newThreadInput.value;

            if(val === '')
                return false;

            newThreadInput.value = '';
            if(!this.threads) {
                this.threads = [];
            }
            //this.threads.push();
            //Conversations.update(this._id, this);
            Meteor.call("addThread", this.pinId, val);
        }
    });

    Template.convo.events({
        'click .js-remove-pin': function (e) {
            e.preventDefault();
            var thread = this;
            var id = this.conversation;
            Meteor.call('removeThread', id, thread);
        }
    });
}

if (Meteor.isServer) {
/*  Meteor.startup(function () {
    if (Conversations.find().count() === 0) {
      var names = ["Marcia"];
      _.each(names, function (name) {
        Conversations.insert({
          name: name,
            threads: []
        });
      });
    }
  });*/
    Meteor.methods({
        removeThread: function(id, thread){
            Conversations.update({_id: id}, {$pull : {threads : thread}});
        },
        addThread: function(id, thread) {
            Conversations.update(id, {$push: {threads: { topic: thread, conversation: id }}});
        }
    });
}
