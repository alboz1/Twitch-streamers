'use strict';

var app = {
	streamers: ['freecodecamp', 'tsm_dyrus', 'tsm_bjergsen', 'donthedeveloper', 'summit1g'],
	online: false,

	init: function init() {
		$('.wrapper').html('');
		this.getData();
	},
	eventListeners: function eventListeners() {
		var _this = this;

		$('.main-nav a').on('click', function (e) {
			e.preventDefault();
			var $this = $(this);

			if ($this.text() === 'Online') {
				$('.box').show();
				$('.status-Offline').parent().hide();
			} else if ($this.text() === 'Offline') {
				$('.box').show();
				$('.status-Online').parent().hide();
			} else if ($this.text() === 'All') {
				$('.box').show();
			}
		});

		$('form').on('submit', function (e) {
			e.preventDefault();
			var streamer = $(':text').val().replace(' ', '');
			if (streamer === '') return;

			_this.addStreamer(streamer);
			_this.init();
		});

		$('.wrapper').on('click', 'a button', function (e) {
			e.preventDefault();

			var streamer = $(this).siblings('.name').text().toLowerCase();
			var index = app.streamers.indexOf(streamer);

			app.streamers.splice(index, 1);
			app.init();
		});
	},
	addStreamer: function addStreamer(streamer) {
		this.streamers.push(streamer);
	},
	ajax: function ajax(options) {
		return new Promise(function (resolve, reject) {
			$.ajax({
				url: options.url,
				dataType: options.dataType
			}).done(resolve).fail(reject);
		});
	},
	getData: function getData() {
		var _this2 = this;

		var streamersData = this.streamers.map(function (streamer) {
			return _this2.ajax({
				url: 'https://wind-bow.gomix.me/twitch-api/streams/' + streamer,
				dataType: 'jsonp'
			}).then(function (data) {
				//check if streamer is online. If its not online make a call to take offline data
				if (data.stream === null) {
					return _this2.ajax({
						url: 'https://wind-bow.gomix.me/twitch-api/channels/' + streamer,
						dataType: 'jsonp'
					});
				} else {
					return _this2.ajax({
						url: 'https://wind-bow.gomix.me/twitch-api/streams/' + streamer,
						dataType: 'jsonp'
					});
				}
			});
		});

		Promise.all(streamersData).then(function (responses) {
			responses.forEach(function (data, index) {
				if (data.stream) {
					_this2.online = true;
					//render function renders the data from the request creates and renders data into the page
					_this2.render({
						status: 'Online',
						name: data.stream.channel.display_name,
						game: data.stream.channel.game,
						info: data.stream.channel.status,
						logo: data.stream.channel.logo,
						url: data.stream.channel.url
					});
				} else {
					_this2.online = false;

					_this2.render({
						status: 'Offline',
						name: data.display_name,
						logo: data.logo,
						url: data.url,
						error: data.status,
						streamer: _this2.streamers[index]
					});
				}
			});
		});
	},
	catchError: function catchError(error) {
		if (error === 422 || error === 400 || error === 404 || error === null) {
			return true;
		} else {
			return false;
		}
	},
	render: function render(props) {
		$('.wrapper').append('\n\t\t\t<a href="' + props.url + '" target="_blank">\n\t\t\t\t<div class="box" ' + (this.catchError(props.error) ? 'style="background: white"' : 'style="background: url(\'' + props.logo + '\')"') + '>\n\t\t\t\t\t<span class="status-' + props.status + '">\n\t\t\t\t\t\t' + (this.catchError(props.error) ? 'Account doesn\'t exist' : props.status) + '\n\t\t\t\t\t</span>\n\t\t\t\t\t<p class="name">' + (this.catchError(props.error) ? props.streamer : props.name) + '</p>\n\t\t\t\t\t' + (this.catchError(props.error) || !this.online ? '' : '<p class="game">' + props.game + '</p>') + '\n\t\t\t\t\t' + (this.catchError(props.error) || !this.online ? '' : '<p class="info">' + props.info + '</p>') + '\n\t\t\t\t\t<button class="delete-btn">&times;</button>\n\t\t\t\t</div>\n\t\t\t</a>\n\t\t');
	}
};
app.init();
app.eventListeners();