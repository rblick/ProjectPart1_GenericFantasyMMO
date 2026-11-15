import express from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import characterCreateRoutes from "./routes/character-create.routes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());

app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", characterCreateRoutes);

// Handle errors after all routes.
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "Authentication required or token invalid.",
    });
  }

  console.error(err.message);

  return res.status(400).json({
    error: "The request could not be completed",
  });
});

export default app;