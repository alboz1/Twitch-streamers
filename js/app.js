const app = {
	streamers: ['freecodecamp','grossie_gore','tsm_bjergsen','Tsm_Dyrus','summit1g','pobelter'],
	online: false,

	init() {
		$.each(this.streamers, index => {
			this.onlineInfo(index);
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

	onlineInfo(index) {
		this.getData(`https://wind-bow.gomix.me/twitch-api/streams/${this.streamers[index]}`, data => {
			//console.log(data);
			if (data.stream === null) {
				this.offlineInfo(index);
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

	offlineInfo(index) {
		this.getData(`https://wind-bow.gomix.me/twitch-api/channels/${this.streamers[index]}`, data => {
			this.online = false;

			this.render({
				status: 'Offline',
				name: data.display_name,
				logo: data.logo,
				url: data.url
			});
		});
	},

	render(props) {
		$('.wrapper').append(`
			<div class="box" style="background: url('${props.logo}')">
				<span class="status-${props.status}">${props.status}</span>
				<p class="name">${props.name}</p>
				<p class="game">${props.game}</p>
				<p class="info">${props.info}</p>
			</div>
		`);
		
		if (this.online) {
			$('.box .game').css('display', 'inline-block');
			$('.box .info').css('display', 'inline-block');
		}
		
		$('.box').on('click', function() {
			window.open(props.url);
		});
	}
};
app.init();