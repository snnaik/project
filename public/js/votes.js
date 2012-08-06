(function($) {
	window.WebSocket = window.WebSocket;
	var connection = new WebSocket('ws://127.0.0.1:3003');
	
	connection.onopen = function () {
        // connection is opened and ready to use
    };

    connection.onerror = function (error) {
        // an error occurred when sending/receiving data
    };

    connection.onmessage = function (message) {
        // try to decode json (I assume that each message from server is json)
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        // handle incoming message
		if(json.type === 'message') {
			$('#container').empty();
			$('#container').text('test');
		}
    };


        window.Vote = Backbone.Model.extend({});
        window.App = Backbone.Model.extend({});
        window.av = new App();
        window.Votes = Backbone.Collection.extend({
                model: Vote,
                url: '/votes'
        });
        
        window.votes = new Votes();
        
        window.VoteView = Backbone.View.extend({
                initialize: function() {
                        _.bindAll(this, 'render');
                        this.model.bind('change', this.render);
                        this.template = _.template($('#vote-template').html());
                        
                },
                render: function() {
                        var renderedContent = this.template(this.model.toJSON());
                        $(this.el).html(renderedContent);
                        return this;
                }
        });
        
        window.AppView = Backbone.View.extend({
                initialize: function() {
                        _.bindAll(this, 'render');
                        this.model.bind('change', this.render);
                        this.template = _.template($('#app-template').html());
                },
                render: function() {
                        var renderedContent = this.template(this.model.toJSON());
                        $(this.el).html(renderedContent);
                        return this;
                },
                events: {
                        "click input[type=button]": "createModel"
                },
                createModel: function(){
                        var res = $('input[name=vote]:radio:checked').val();
                        this.model.set({response:res});
                        $('#conversation').empty();
                        $('#conversation').append("Thanks for voting  "+res + "<br />");
                        connection.send(res);
                }
        });
        
        window.AllVoteView = VoteView.extend({});
        
        window.AllView = Backbone.View.extend({
                initialize: function() {
                        _.bindAll(this, 'render');
                        this.template = _.template($('#all-template').html());
                        this.collection.bind('reset', this.render);
                },
                render: function() {
                        var $votes,
                                collection = this.collection;
                        $(this.el).html(this.template({}));
                        $votes = this.$('.votes');
                        collection.each(function(vote) {
                                var view = new AllVoteView({
                                        model: vote,
                                        collection: collection
                                });
                                $votes.append(view.render().el);
                        });
                        return this;
                }
        });
        
        window.VotingApp = Backbone.Router.extend({
                routes: {
                        '': 'home',
                        'result': 'voting_result',
                        'app': 'voting_app'
                },
                initialize: function() {
                        this.appView = new AppView({
                                model: window.av
                        });
                        this.allView = new AllView({
                                collection: window.votes
                        });
                },
                home: function() {
                        $('#container').empty();
                        $('#container').append(this.appView.render().el);
                },
                voting_app: function() {
                        $('#container').empty();
                        $('#container').append(this.appView.render().el);
                },
                voting_result: function() {
                        var $container = $('#container');
                        $container.empty();
                        $container.append(this.allView.render().el);
                }
        });
        
        $(function() {
                window.App = new VotingApp();
                Backbone.history.start();
        });
})(jQuery);
