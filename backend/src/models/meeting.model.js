import mongoose, { Schema } from "mongoose"; 

const meetingSchema = new Schema({
    user_id:{type:String},
    meetingCode:{type:String, required:true},
    date:{type:Date, default:Date.now},
    startedAt:{type:Date, default:Date.now},
    endedAt:{type:Date},
    durationSeconds:{type:Number, default:0}
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };