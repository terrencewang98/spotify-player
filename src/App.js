import React, {Component} from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
import Player from './Player.js'
import './App.css'
import personalWebsiteLink from './images/personalWebsiteLink.png'
import githubLink from './images/githubLink.png'
import background1 from './images/background1.jpg'

const spotifyApi = new SpotifyWebApi()
const authEndpoint = 'https://accounts.spotify.com/authorize'
const clientId = "515322ae70264903996d7b12aaed4aff";
const redirectUri = "https://terrencewang98.github.io/spotify-player/"; //"http://localhost:3000";
const scopes = [  
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-modify-playback-state"
];

class App extends Component {
  intervalID
  state = {
    loggedIn: false, 
  }

  componentDidMount(){
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
      this.setState({loggedIn: true})
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

  render(){

    return (
      <div className = "colorLayer">
        <img className = "background-image" src = {background1}/>
        {!this.state.loggedIn && (
          <div className = 'login'>
            <h1 style = {{marginBottom: "0px"}}>Spotify Player</h1>
            <div className = "buttonRow">
              <h2>created by @terrencewang98</h2>
              <a href="https://github.com/terrencewang98/spotify-player" target="_blank" rel="noreferrer">
                <img className = "imgButton" src = {githubLink} />
              </a>
              <a href="https://terrencewang98.github.io/" target="_blank" rel="noreferrer">
                <img className = "imgButton" src = {personalWebsiteLink} style = {{width: "55px"}} />
              </a>
            </div>
            <a className = "loginButton" href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}>
              Login to Spotify
            </a>
          </div>
        )}
        {this.state.loggedIn && (
          <Player spotifyApi = {spotifyApi} />
        )}
      </div>
    )
  }
}

export default App;
