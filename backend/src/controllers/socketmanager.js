// import { connection } from "mongoose";
import pkg from "mongoose";
const { connection } = pkg;

import { Server } from "socket.io";

let connections={};
let messages={};
let timeOnline={};



const  connectToSocket=(server)=>{
    const io = new Server(server,{
        cors:{
            origin:"*",              //not to do in production as it opens up to all origins
            methods:["GET","POST"],
            allowedHeaders:["*"],
            credentials:true
        }
    }); //io stand for socket

    
    io.on("connection",(socket)=>{

        console.log("something connected");
        socket.on("join-call",(path)=>{
            if(connections[path]===undefined){
                connections[path]=[];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id]=Date.now();
            for(let a=0;a<connections[path].length;a++){
                const id=connections[path][a];
                if(id!==socket.id){
                    io.to(id).emit("chat-message",messages[path][a]['data'],
                        messages[path][a]['sender'],messages[path][a]['socket-id-sender']
                    );
                }
            }
        })


        socket.on("signal",(toId,message)=>{
            io.to(toId).emit("signal",socket.id,message);
        })
       
        socket.on(("chat-message"),(data,sender)=>{
            
        const [matchingRoom,found]=Object.entries(connections)
        .reduce(([room,isFound],[roomKey,roomValue])=>{
    
       if(!isFound && roomValue.includes(socket.id)){
        return [roomKey,true];
       }
       return [room,isFound];
    },['',false]);

    if(found===true){
        if(messages[matchingRoom]===undefined){
            messages[matchingRoom]=[]
        }
        messages[matchingRoom].push({
            'data': data,
            'sender': sender,
            'socket-id-sender': socket.id
        });
        // console.log("message",key,":",sender,data)

        connections[matchingRoom].forEach((elem)=>{
            io.to(elem).emit("chat-message",data,sender,socket.id);
        })
    }


        })   
         socket.on(("disconnect"),()=>{
            var diffTime=Math.abs(timeOnline[socket.id]-new Date())

            var key

            for(const [k,v] of JSON.parse(JSON.stringify(Object.entries(connections)))){

                for(let a=0;a<v.length;a++){
                    if(v[a]===socket.id){
                        key=k

                        for(let a=0;a<connections[key].length;a++){
                            io.to(connections[key][a]).emit("user-disconnected",socket.id);
                        }
                        var index=connections[key].indexOf(socket.id)
                          connections[key].splice(index,1)

                          if(connections[key].length===0){
                              delete connections[key]
                          }
                    }
                }
            }
        })


    })
    return io;
}
export default connectToSocket;