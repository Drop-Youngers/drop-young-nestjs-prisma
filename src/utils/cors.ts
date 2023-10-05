const whitelist = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://aic-frontend.vercel.app",
    "https://aic-backend.onrender.com",
    "https://aic.com",
];
const options = {
    origin: (origin: string, callback: Function) => {
        console.log(origin)
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    credentials: true,
    exposedHeaders: ["*", "Authorization"]
};

export default options;