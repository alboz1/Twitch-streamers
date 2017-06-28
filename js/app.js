const app = {
	streamers: ['freecodecamp','grossie_gore','tsm_bjergsen','Tsm_Dyrus','summit1g','pobelter','asd'],
	online: false,

	init() {
		this.streamers.forEach(streamer => {
			this.onlineInfo(streamer);
		});
		this.eventListeners();
	},

	eventListeners() {
		$('a').on('click', function(e) {
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
	},

	getData(url, cb) {
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: data => {
				cb(data);
			},
			error: function(error) {
				console.log(error);
			}
		});
	},

	onlineInfo(streamer) {
		this.getData(`https://wind-bow.gomix.me/twitch-api/streams/${streamer}`, data => {
			if (data.stream === null) {
				this.offlineInfo(streamer);
			} else {
				this.online = true;
				
				this.render({
					status: 'Online',
					name: data.stream.channel.display_name, 
					game: data.stream.channel.game,
					info: data.stream.channel.status,
					logo: data.stream.channel.logo,
					url: data.stream.channel.url,
				});
			}
		});
	},

	offlineInfo(streamer) {
		this.getData(`https://wind-bow.gomix.me/twitch-api/channels/${streamer}`, data => {
			this.online = false;

			this.render({
				status: 'Offline',
				name: data.display_name,
				logo: data.logo,
				url: data.url,
				error: data.status,
				streamer: streamer
			});
		});
	},

	render(props) {
		$('.wrapper').append(`
			<div class="box" ${props.error === 422 ? 'style="background: white"' : `style="background: url('${props.logo}')"`}>
				<span class="status-${props.status}">
					${props.error === 422 ? 'Account doesn\'t exist' : props.status}
				</span>
				<p class="name">${props.error === 422 ? props.streamer : props.name}</p>
				${(props.error === 422 || !this.online) ? '' : `<p class="game">${props.game}</p>`}
				${(props.error === 422 || !this.online) ? '' : `<p class="info">${props.info}</p>`}
			</div>
		`);
		
		$('.box').on('click', function() {
			window.open(props.url);
		});
	}
}
app.init();