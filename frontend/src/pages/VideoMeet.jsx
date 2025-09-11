import React, { use } from "react";
import { useRef,useState,useEffect } from "react";
import "@mui/material/TextField";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "../styles/video.css";
import { io } from "socket.io-client";
// import { connect } from "mongoose";
// import { set } from "mongoose";
const server_url = "http://localhost:8000";
 var connections={};
  const peerConfigConnections = {
    'iceServers': [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
  }

export default function VideoMeetComponent() {
   var socketRef=useRef();
   let socketIdRef=useRef();

   let localVideoRef=useRef();

   let [videoAvailable,setVideoAvailable]=useState(true);
   let [audioAvailable,setAudioAvailable]=useState(true);

   let [video,setVideo]=useState();
   let [audio,setAudio]=useState();

   let [screen,setScreen]=useState();
   let [showModel,setShowModel]=useState(false);

   let [screenAvailable,setScreenAvailable]=useState(false);

   let [messages,setMessages]=useState([]);
   let [message,setMessage]=useState("");

   let [newMessage,setNewMessage]=useState(false);
   let [askForUsername,setAskForUsername]=useState(true);
   let [username,setUsername]=useState("");

   const videoRef = useRef();

   let [videos,setVideos]=useState([]);
//    if(isChrome()===false){
const getPermissions=async()=>{
  try{
    const videoPermission=await navigator.mediaDevices.getUserMedia({video:true});
    if(videoPermission){
      setVideoAvailable(true);
    }else{
      setVideoAvailable(false);
    }
    const audioPermission=await navigator.mediaDevices.getUserMedia({audio:true});
    if(audioPermission){
      setAudioAvailable(true);
    }else{
      setAudioAvailable(false);
    }
    if(navigator.mediaDevices.getDisplayMedia){
      setScreenAvailable(true);
    }else{
      setScreenAvailable(false);
    }
    if(videoAvailable || audioAvailable){
      const userMediaStream=await navigator.mediaDevices.getUserMedia({video:videoAvailable,audio:audioAvailable});
      if(userMediaStream){
        window.localStream=userMediaStream;
        if(localVideoRef.current){
          localVideoRef.current.srcObject=userMediaStream;
        }
    }
  }
  }catch(err){
    console.error("Error accessing media devices.", err);
  }
}
useEffect(()=>{
  getPermissions();
},[]);
let getUserMediaSuccess=(stream)=>{
  // if(localVideoRef.current){
  //   localVideoRef.current.srcObject=stream;
  // }
}
let getUserMedia=async()=>{
  if((video && videoAvailable) || (audio && audioAvailable)){
     navigator.mediaDevices.getUserMedia({video:video,audio:audio})
     .then(getUserMediaSuccess)
     .then((stream)=>{})
   .catch((e)=>console.log(e));
  }
else{
  try{
    let tracks=localVideoRef.current.srcObject.getTracks();
    tracks.forEach(track=>track.stop());
  }catch(err){
    console.error("Error stopping tracks.", err);
  }
}
useEffect(()=>{
  if(video!==undefined || audio!==undefined){
    getUserMedia();
  }
},[video,audio]);

let gotMessageFromServer=(fromId,message)=>{

}
let connectToSocketServer=()=>{
  socketRef.current=io.connect(server_url,{secure:false});
  socketRef.current.on('signal',gotMessageFromServer);
  socketRef.current.on('connect',()=>{
    socketRef.current.emit("join-call",window.location.href)
  })
}
let getMedia=()=>{
  setVideo(videoAvailable);
  setAudio(audioAvailable);
  connectToSocketServer();
}

let connect=()=>{
  setAskForUsername(false);
  getMedia();
}
    return (
        <div>
           {askForUsername === true?
           <div>

            <h2>Enter into Lobby</h2>
            <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Button variant="contained" onClick={connect} >Connect</Button>
              <div>
                <video ref={localVideoRef} autoPlay muted className="local-video"></video>
              </div>
            </div> :
            <></>
        }




     </div>
    )
}
}