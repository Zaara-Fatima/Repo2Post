import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser"
import health from "./routes/health.routes.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorhandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import repositoryRoutes from "./routes/repository.routes.js"
import { apiLimiter } from "./middleware/rateLimiter.js";

const app = express();


app.use(cookieParser())
app.use(helmet());
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());

app.use('/api', apiLimiter)

app.use(requestLogger)
app.use("/api", health)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/repositories", repositoryRoutes)

app.get("/", (req, res) => {
  res.status(200).json({
    name: "Repo2Post API",
    version: "1.0.0",
    status: "running",
  });
});

app.get('/api/test-error', (req,res)=>{
  throw new Error("Something went wrong") 
})

app.use(errorhandler)
export default app;
