this.Documents = new Mongo.Collection("documents");
EditingUsers = new Mongo.Collection("editingUsers");

Comments = new Mongo.Collection("comments");
Comments.attachSchema(new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  body: {
    type: String,
    label: "Comment",
    max: 1000
  },
  docId: {
    type: String
  },
  owner: {
    type: String
  }
}));
