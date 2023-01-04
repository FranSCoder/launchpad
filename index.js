const sounds = [
	{
		id: "Heater-1",
		url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
		keyCode: 81,
		letter: "Q",
	},
	{
		id: "Heater-2",
		url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
		keyCode: 87,
		letter: "W",
	},
	{
		id: "Heater-3",
		url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
		keyCode: 69,
		letter: "E",
	},
	{
		id: "Heater-4",
		url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
		keyCode: 65,
		letter: "A",
	},
	{
		id: "Clap",
		url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
		keyCode: 83,
		letter: "S",
	},
	{
		id: "Open-HH",
		url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
		keyCode: 68,
		letter: "D",
	},
	{
		id: "Kick-n'-Hat",
		url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
		keyCode: 90,
		letter: "Z",
	},
	{
		id: "Kick",
		url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
		keyCode: 88,
		letter: "X",
	},
	{
		id: "Close-HH",
		url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
		keyCode: 67,
		letter: "C",
	}
];

const activePad = {
	marginTop: 13,
	height: 72,
	backgroundImage: "none",
	backgroundColor: "grey",
	boxShadow: "none"
}

const inactivePad = {
  marginTop: 10,
  boxShadow: '3px 3px 5px black'
};

class DrumPad extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			padStyle: inactivePad
		}
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.playSound = this.playSound.bind(this);
		this.pressPad = this.pressPad.bind(this);
	}
	componentDidMount() {
		document.addEventListener("keydown", this.handleKeyPress);
	}
	componentWillUnmount() {
		document.removeEventListener("keydown", this.handleKeyPress);
	}
	handleKeyPress(e) {
    if (e.keyCode === this.props.keyCode) {
      this.playSound();
    }
  }
	playSound() {
		const sound = document.getElementById(this.props.letter);
		sound.currentTime = 0;
		sound.play();
		this.pressPad();
		setTimeout(() => this.pressPad(), 100);
		this.props.updateDisplay(this.props.clipId.replace(/-/g, ' '));
	}
	pressPad() {
		if (this.state.padStyle.marginTop === 10) {
			this.setState({
				padStyle: activePad
			});
		}
		else {
			this.setState({
				padStyle: inactivePad
			})
		}
	}
	render () {
		return (
			<div
				id={this.props.clipId}
				className="drum-pad"
				style={this.state.padStyle}
				onClick={this.playSound}
			>
				<audio
          className="clip"
          id={this.props.letter}
          src={this.props.clipUrl}
        />
				{this.props.letter}
			</div>
		);
	};
};

class PadBank extends React.Component {
	constructor(props) {
		super(props);
	}
	render () {
		let drummers = sounds.map((x, i, sounds) => {
				return (
					<DrumPad
						clipId={sounds[i].id}
						clipUrl={sounds[i].url}
						letter={sounds[i].letter}
						keyCode={sounds[i].keyCode}
						updateDisplay={this.props.updateDisplay}
					/>
				)}
			)
		return <div className="pad-bank">{drummers}</div>
	};
};

class App extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			display: String.fromCharCode(160),
			sliderValue: 0.3
		}
		this.displayClipName = this.displayClipName.bind(this);
		this.setVolume = this.setVolume.bind(this);
		this.clearDisplay = this.clearDisplay.bind(this);
  }
	displayClipName(name) {
		this.setState({
			display: (name)
		})
	}
	setVolume(e) {
		this.setState({
			sliderValue: e.target.value,
			display: 'Volume: ' + Math.round(e.target.value * 100)
		});
		setTimeout(() => this.clearDisplay(), 1000);
  }
  clearDisplay() {
    this.setState({
      display: String.fromCharCode(160)
    });
  }
	render() {
		const clips = [].slice.call(document.getElementsByClassName('clip'));
		clips.forEach(sound => {
			sound.volume = this.state.sliderValue;
		});
		return (
			<div id="drum-machine">
				<PadBank
					updateDisplay={this.displayClipName}	
				/>
				<div className="control-panel">
					<p id="display">{this.state.display}</p>
					<p>Volume</p>
					<div className="volume-slider">
						<input
							onChange={this.setVolume}
							value={this.state.sliderValue}
							className="range-style"
              max='1'
              min='0'
              step='0.01'
              type='range'
            />
					</div>
				</div>
			</div>
		);
	};
};

ReactDOM.render(<App />, document.getElementById('root'));