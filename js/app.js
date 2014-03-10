App = Ember.Application.create(); 
// This boots up Ember app

App.Router.map(function() {
  this.resource('about');
  this.resource('posts', function() {
    this.resource('post', { path: ':post_id' });
  });
});

App.PostsRoute = Ember.Route.extend({
  model: function() {
      // return posts;
      return $.getJSON('http://tomdale.net/api/get_recent_posts/?callback=?').then(function(data) {
        return data.posts.map(function(post) {
          post.body = post.content;
          return post;
        });
      });
  }
});

App.PostRoute = Ember.Route.extend({
  model: function(params) {
      // return posts.findBy('id', params.post_id);
      return $.getJSON('http://tomdale.net/api/get_post/?id='+params.post_id+'&callback=?').then(function(data) {
      data.post.body = data.post.content;
      return data.post;
    });
  }
});

App.PostController = Ember.ObjectController.extend({
    isEditing: false,

    actions: {
      edit: function() {
        this.set('isEditing', true);
      },

      doneEditing: function() {
        this.set('isEditing', false);
      }
    }
});

Ember.Handlebars.helper('format-date', function(date) {
  return moment(date).fromNow();
});

var showdown = new Showdown.converter();

Ember.Handlebars.helper('format-markdown', function(input) {
  return new Handlebars.SafeString(showdown.makeHtml(input));
});

// var posts = [{
//   id: '1',
//   title: "Rails is fun",
//   author: { name: "mel" },
//   date: new Date('12-27-2012'),
//   excerpt: "Fun times",
//   body: "read for fun",
// }, {
//   id: '2',
//   title: "more fun",
//   author: { name: "mel" },
//   date: new Date('12-28-2012'),
//   excerpt: "more fun times",
//   body: "read for fun again",
// }];


