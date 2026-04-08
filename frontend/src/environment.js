const fallbackServer = import.meta.env.PROD
	? "https://himxmeet-video-call-app.onrender.com"
	: "http://localhost:8000";

const server = import.meta.env.VITE_API_URL || fallbackServer;


export default server;