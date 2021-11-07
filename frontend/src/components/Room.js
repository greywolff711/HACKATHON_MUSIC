import React, { Component ,useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {Grid,Button,Typography} from '@material-ui/core';
import { createBrowserHistory } from "history";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function LeaveButtonPressed(){
    const history = createBrowserHistory();
    const requestOptions ={
        method:"POST",
        headers:{'Content-Type':'application/json'},
    }
    fetch('/api/leave-room',requestOptions).then((_response)=>{
        history.push('/');
        window.location.reload();
        
    });
}
// function updateShowSettings(value){
//     useEffect(() => {
//         setshowSettings(value)
//       },[]);
// }
// function renderSettings(){
//     return(
//     <Grid container spacing={1}>
//         <Grid item xs={12} align="center">
//             <CreateRoomPage 
//             update={true} 
//             votesToSkip={votesToSkip}
//             guestCanPause={guestCanPause}
//             roomCode={roomCode}
//             updateCallBack={()=>{}}
//             />
//         </Grid>
//         <Grid item xs={12} align="center">
//             <Button variant="contained" color="secondary" onClick={()=>updateShowSettings(false)}>
//                 Close
//             </Button>
//         </Grid>
//     </Grid>
//     );
// }
// function renderSettingsButton(){
//     return(
//         <Grid item xs={12} align="center">
//             <Button variant="contained" color="primary" onClick={()=>updateShowSettings(true)}>
//                 Settings
//             </Button>

//         </Grid>
//     );
// }
function authenticateSpotify(){
    fetch('/spotify/is-authenticated').then((response)=>response.json()).then((data)=>{
        setSpotifyAuthenticated(data.status);
        if(!data.status){
            fetch('/spotify/get-auth-url').then((response)=>response.json()).then((data)=>{
                window.location.replace(data.url);
            });
        }
    });
}


function Room() {
    const [votesToSkip,setVotesToSkip] = useState(2);
    const [guestCanPause,setGuestCanPause] = useState(false);
    const [isHost,setIsHost] = useState(false);
    const [showSettings,setshowSettings] = useState(false);
    const [spotifyAuthenticated,setSpotifyAuthenticated] = useState(false);
    const [song,setSong] = useState({});
    const {roomCode}=useParams();
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data);
        console.log(data);
      });    
    useEffect(() => {
        fetch("/api/get-room" + "?code=" + roomCode)
      .then((response) => response.json())
      .then((data) => {
        setVotesToSkip(data.votes_to_skip)
        setGuestCanPause(data.guest_can_pause)
        setIsHost(data.is_host)
      });
      console.log(isHost)
      //authenticateSpotifyHere
      if(!isHost){
        fetch('/spotify/is-authenticated').then((response)=>response.json()).then((data)=>{
            setSpotifyAuthenticated(data.status);
            console.log(data.status);
            if(!data.status){
                fetch('/spotify/get-auth-url').then((response)=>response.json()).then((data)=>{
                    window.location.replace(data.url);
                });
            }
        });
      }
      
      },[]);
    if(showSettings){
        return(
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage 
                update={true} 
                votesToSkip={votesToSkip}
                guestCanPause={guestCanPause}
                roomCode={roomCode}
                updateCallBack={()=>{}}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={()=>{
                    setshowSettings(false);
                    window.location.reload();
                    }}>
                    Close
                </Button>
            </Grid>
        </Grid>
        );
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code:{roomCode}
                </Typography>
            </Grid>
            {/* getcurrentsong here */}
            <MusicPlayer {...song}/>
            {/* <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {guestCanPause.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {isHost.toString()}
                </Typography>
            </Grid> */}
            {isHost?
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={()=>{
                    setshowSettings(true)
                }}>
                    Settings
                </Button>
            </Grid>
            :null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={LeaveButtonPressed}>Leave Room</Button>
            </Grid>
        </Grid>  
    );
}
export default Room