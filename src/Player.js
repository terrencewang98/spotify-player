import React, {Component} from 'react'
import play from './images/play.png'
import pause from './images/pause.png'
import shuffleOff from './images/shuffleOff.png'
import shuffleOn from './images/shuffleOn.png'
import skipForward from './images/skipForward.png'
import skipBackward from './images/skipBackward.png'
import repeatOff from './images/repeatOff.png'
import repeatOn from './images/repeatOn.png'
import background1 from './images/background1.jpg'

class Player extends Component{
  intervalID
  state = {
    isPlaying: false,
    nowPlaying: { name: 'Play Something From Your Spotify App', artists: [], albumArt: '' },
    shuffle: false,
    repeat: false
  }
  
  componentDidMount(){
    this.getNowPlaying()
    this.intervalID = setInterval(this.getNowPlaying.bind(this), 500)
  }

  componentWillUnmount(){
    clearInterval(this.intervalID)
  }

  getNowPlaying(){
    this.props.spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
          this.setState({
            isPlaying: response.is_playing,
            nowPlaying: {
              name: response.item ? response.item.name : 'Play Something From Your Spotify App',
              artists: response.item ? response.item.artists.map((artist) => artist.name).join(", ") : [],
              albumArt: response.item ? response.item.album.images[0].url : ''
            },
            shuffle: response.shuffle_state,
          })
      })
  }

  handleShuffleClick(){
    this.props.spotifyApi.setShuffle(!this.state.shuffle)
  }

  handleSkipBackwardClick(){
    this.props.spotifyApi.skipToPrevious()
  }

  handlePlayPauseButtonClick(){
    if(this.state.isPlaying){
      this.props.spotifyApi.pause()
    }
    else{
      this.props.spotifyApi.play()
    }
  }

  handleSkipForwardClick(){
    this.props.spotifyApi.skipToNext()
  }

  handleRepeatClick(){
    this.props.spotifyApi.setRepeat(this.state.repeat ? "off" : "track")
    this.setState({repeat: !this.state.repeat})
  }

  render() {
    return (
      <div>
        <img src = {this.state.nowPlaying.albumArt} style = {{position: "fixed", left: 0, bottom: "75px", width: "200px"}} />
        <div className = "player">
          <div className = "songInfo">
            <p style = {{fontSize: "22px", fontWeight: "bold"}}>{this.state.nowPlaying.name}</p> 
            <p style = {{fontSize: "14px", fontWeight: "normal"}}>{this.state.nowPlaying.artists}</p>
          </div>
          <div className = "buttons">
            <button>
              {this.state.shuffle && (
                <img src = {shuffleOn} onClick = {this.handleShuffleClick.bind(this)} style = {{width: "35px", marginRight: "10px"}}/>
              )}
              {!this.state.shuffle && (
                <img src = {shuffleOff} onClick = {this.handleShuffleClick.bind(this)} style = {{width: "35px", marginRight: "10px"}}/>
              )}
            </button>
            <button>
              <img src = {skipBackward} onClick = {this.handleSkipBackwardClick.bind(this)}/>
            </button>
            <button>
              {this.state.isPlaying && (
                <img src = {pause} onClick = {this.handlePlayPauseButtonClick.bind(this)}/>
              )}
              {!this.state.isPlaying && (
                <img src = {play} onClick = {this.handlePlayPauseButtonClick.bind(this)}/>
              )}
            </button>
            <button>
              <img src = {skipForward} onClick = {this.handleSkipForwardClick.bind(this)}/>
            </button>
            <button>
              {this.state.repeat && (
                <img src = {repeatOn} onClick = {this.handleRepeatClick.bind(this)} style = {{width: "35px", marginLeft: "10px"}}/>
              )}
              {!this.state.repeat && (
                <img src = {repeatOff} onClick = {this.handleRepeatClick.bind(this)} style = {{width: "35px", marginLeft: "10px"}}/>
              )}
            </button>             
          </div>
        </div>
      </div>
    )
  }
}

export default Player
