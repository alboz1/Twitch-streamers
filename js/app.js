const app = {
	streamers: ['freecodecamp', 'tsm_dyrus', 'tsm_bjergsen', 'donthedeveloper'],
	online: false,

	init() {
		if (this.streamers.length === 0) {
			$('.wrapper').text('No streamers added').css('color', 'white');
		} else {
			$('.wrapper').text('');
			$('.wrapper').html('');
			this.streamers.forEach(streamer => {
				this.onlineInfo(streamer);
			});
		}

	},

	eventListeners() {
		$('.main-nav a').on('click', function(e) {
			e.preventDefault();
			const $this = $(this);

			if ($this.text() === 'Online') {
				$('.box').show();
				$('.status-Offline').parent().hide();
			}else if ($this.text() === 'Offline') {
				$('.box').show();
				$('.status-Online').parent().hide();
			}else if ($this.text() === 'All') {
				$('.box').show();
			}
		});

		$('form').on('submit', e => {
			e.preventDefault();
			const streamer = $(':text').val().replace(' ', '');
			if (streamer === '') return;

			this.addStreamer(streamer);
			this.init();
		});

		$('.wrapper').on('click','a button', function(e) {
			e.preventDefault();
			const streamer = $(this).prev().text().toLowerCase();
			const index = app.streamers.indexOf(streamer);
			app.streamers.splice(index, 1);
			app.init();
		});
	},

	addStreamer(streamer) {
		this.streamers.push(streamer);
	},

	onlineInfo(streamer) {
		this.online = true;

		$.ajax({
			url: `https://wind-bow.gomix.me/twitch-api/streams/${streamer}`,
			dataType: 'jsonp',
			success: data => {
				if (data.stream === null) {
					this.offlineInfo(streamer);
				} else {
					this.render({
						status: 'Online',
						name: data.stream.channel.display_name, 
						game: data.stream.channel.game,
						info: data.stream.channel.status,
						logo: data.stream.channel.logo,
						url: data.stream.channel.url,
					});
				}
			}
		});
	},

	offlineInfo(streamer) {
		$.ajax({
			url: `https://wind-bow.gomix.me/twitch-api/channels/${streamer}`,
			dataType: 'jsonp',
			success: data => {
				this.online = false;

				this.render({
					status: 'Offline',
					name: data.display_name,
					logo: data.logo,
					url: data.url,
					error: data.status,
					streamer: streamer
				});
			}
		});
	},

	render(props) {
		//props.error === 422 && props.error === 400 checks if the account exists or not.
		$('.wrapper').append(`
			<a href="${props.url}" target="_blank">
				<div class="box" ${props.error === 422 || props.error === 400 ? 'style="background: white"' : `style="background: url('${props.logo}')"`}>
					<span class="status-${props.status}">
						${props.error === 422 || props.error === 400 ? 'Account doesn\'t exist' : props.status}
					</span>
					<p class="name">${props.error === 422 || props.error === 400 ? props.streamer : props.name}</p>
					${props.error === 422 || !this.online || props.error === 400 ? '' : `<p class="game">${props.game}</p>`}
					${props.error === 422 || !this.online || props.error === 400 ? '' : `<p class="info">${props.info}</p>`}
					<button class="delete-btn">&times;</button>
				</div>
			</a>
		`);
	}
}
app.init();
app.eventListeners();