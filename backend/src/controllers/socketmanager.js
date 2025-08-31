import { Server } from "socket.io";
const  connectToSocket=(server)=>{
    const io = new Server(server); //io stand for socket
    return io;
}
export default connectToSocket;