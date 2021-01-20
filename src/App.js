import React, {Component} from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
import './App.css'
import play from './images/play.png'
import pause from './images/pause.png'
import skipForward from './images/skipForward.png'
import skipBackward from './images/skipBackward.png'

const spotifyApi = new SpotifyWebApi()
const authEndpoint = 'https://accounts.spotify.com/authorize'
const clientId = "515322ae70264903996d7b12aaed4aff";
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state"
];

class App extends Component {
  intervalID
  state = {
    loggedIn: false, 
    isPlaying: false,
    nowPlaying: { name: 'Not Playing', artists: [], albumArt: '' },
  }

  componentDidMount(){
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      this.setState({loggedIn: true})
      this.getNowPlaying()
      this.intervalID = setInterval(this.getNowPlaying.bind(this), 500)
    }
  }

  componentWillUnmount(){
    clearInterval(this.intervalID)
  }

  getHashParams(){
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
          this.setState({
            isPlaying: response.is_playing,
            nowPlaying: {
              name: response.item ? response.item.name : 'Not Playing',
              artists: response.item ? response.item.artists.map((artist) => artist.name).join(', ') : [],  
              albumArt: response.item ? response.item.album.images[0].url : ''
            }
          })
      })
  }

  handleSkipBackwardClick(){
    spotifyApi.skipToPrevious()
  }

  handlePlayPauseButtonClick(){
    if(this.state.isPlaying){
      spotifyApi.pause()
    }
    else{
      spotifyApi.play()
    }
  }

  handleSkipForwardClick(){
    spotifyApi.skipToNext()
  }

  render(){

    return (
      <div>
        {!this.state.loggedIn && (
          <div className = 'login'>
            <a href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
              Login to Spotify
            </a>
          </div>
        )}
        {this.state.loggedIn && (
          <div className = 'player'>
            <div>
              <img src = {this.state.nowPlaying.albumArt} style = {{'width': '100%'}} />
            </div>
            <div className = "buttons" style = {{'width': '100%', backgroundColor: '#708090'}}>
              <button>
                <img src = {skipBackward} onClick = {this.handleSkipBackwardClick.bind(this)} />
              </button>
              <button>
                {this.state.isPlaying && (
                  <img src = {pause} onClick = {this.handlePlayPauseButtonClick.bind(this)} />
                )}
                {!this.state.isPlaying && (
                  <img src = {play} onClick = {this.handlePlayPauseButtonClick.bind(this)} />
                )}
              </button>
              <button>
                <img src = {skipForward} onClick = {this.handleSkipForwardClick.bind(this)} />
              </button>              
            </div>
            <div>
              <p>{this.state.nowPlaying.name}</p> 
              <p>{this.state.nowPlaying.artists}</p>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default App;
