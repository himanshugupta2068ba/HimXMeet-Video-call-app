import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "crypto";

const TOKEN_TTL_HOURS = Number(process.env.TOKEN_TTL_HOURS || 168);
const TOKEN_TTL_MS = Math.max(1, TOKEN_TTL_HOURS) * 60 * 60 * 1000;

const findActiveUserByToken = async (token) => {
    if (!token || token.startsWith("guest_")) {
        return { user: null, guest: true, expired: false };
    }

    const user = await User.findOne({ token });
    if (!user) {
        return { user: null, guest: false, expired: false };
    }

    if (!user.tokenCreatedAt) {
        return { user, guest: false, expired: false };
    }

    const ageMs = Date.now() - new Date(user.tokenCreatedAt).getTime();
    if (ageMs > TOKEN_TTL_MS) {
        user.token = undefined;
        user.tokenCreatedAt = undefined;
        await user.save();
        return { user: null, guest: false, expired: true };
    }

    return { user, guest: false, expired: false };
};

const login=async(req,res)=>{
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");

    if(!username || !password){
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Username and password are required" });
    }
   try{
     const user=await User.findOne({ username });
    if(!user){
        return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }
       let passwordMatch=await bcrypt.compare(password,user.password);
    if(passwordMatch){
        let token=crypto.randomBytes(20).toString("hex");

        user.token=token;
        user.tokenCreatedAt = new Date();
        await user.save();
        return res.status(httpStatus.OK).json({
            message: "Login successful",
            token,
            user: {
                name: user.name,
                username: user.username
            }
        });
    }else{
        return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }
   }
   catch(err){
       return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
   }
}
const register=async(req,res)=>{
    const name = String(req.body?.name || "").trim();
    const username = String(req.body?.username || "").trim();
    const password = String(req.body?.password || "");

    if (!name || !username || !password) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Name, username and password are required" });
    }

    if (username.length < 3) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Username must be at least 3 characters" });
    }

    if (password.length < 6) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Password must be at least 6 characters" });
    }

    try{
        const existingUser=await User.findOne({ username });
        if(existingUser){
            return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
        }
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new User({
            name:name,
            username:username,
            password:hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User registered successfully" });
    }
    catch(e){
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: e.message });
    }
}

const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const { user, guest, expired } = await findActiveUserByToken(token);
        if (guest) {
            return res.status(httpStatus.OK).json([]);
        }

        if (expired) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Session expired" });
        }

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        if (!meeting_code) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Meeting code is required" });
        }

        const { user, guest, expired } = await findActiveUserByToken(token);
        if (guest) {
            return res.status(httpStatus.CREATED).json({ message: "Guest session - history not persisted" });
        }

        if (expired) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Session expired" });
        }

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code,
            startedAt: new Date(),
            durationSeconds: 0
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({
            message: "Added code to history",
            activityId: newMeeting._id
        })
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` })
    }
}

const completeHistory = async (req, res) => {
    const { token, activity_id, duration_seconds } = req.body;

    try {
        const { user, guest, expired } = await findActiveUserByToken(token);
        if (guest) {
            return res.status(httpStatus.OK).json({ message: "Guest session - no history update" });
        }

        if (expired) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Session expired" });
        }

        if (!activity_id) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Activity id is required" });
        }

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        const meeting = await Meeting.findById(activity_id);
        if (!meeting) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "Meeting activity not found" });
        }

        if (meeting.user_id !== user.username) {
            return res.status(httpStatus.FORBIDDEN).json({ message: "Unauthorized to update this activity" });
        }

        const computedDuration = Number.isFinite(Number(duration_seconds))
            ? Math.max(0, Math.floor(Number(duration_seconds)))
            : Math.max(0, Math.floor((Date.now() - new Date(meeting.startedAt).getTime()) / 1000));

        meeting.durationSeconds = computedDuration;
        meeting.endedAt = new Date();
        await meeting.save();

        return res.status(httpStatus.OK).json({ message: "Meeting activity updated" });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` });
    }
};

const getProfile = async (req, res) => {
    const { token } = req.query;

    try {
        const { user, guest, expired } = await findActiveUserByToken(token);

        if (guest) {
            return res.status(httpStatus.OK).json({
                name: "Guest",
                username: "guest",
                totalCalls: 0,
                totalDurationSeconds: 0,
                averageDurationSeconds: 0
            });
        }

        if (expired) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Session expired" });
        }

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        const meetings = await Meeting.find({ user_id: user.username });
        const totalCalls = meetings.length;
        const totalDurationSeconds = meetings.reduce((sum, meeting) => sum + (meeting.durationSeconds || 0), 0);
        const averageDurationSeconds = totalCalls > 0 ? Math.floor(totalDurationSeconds / totalCalls) : 0;

        return res.status(httpStatus.OK).json({
            name: user.name,
            username: user.username,
            joinedAt: user.createdAt,
            totalCalls,
            totalDurationSeconds,
            averageDurationSeconds
        });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` });
    }
};

export {login,register,getUserHistory, addToHistory, completeHistory, getProfile};