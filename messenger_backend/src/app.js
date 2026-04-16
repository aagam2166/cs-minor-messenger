import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import followRouter from "./routes/follow.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import feedRouter from "./routes/feed.routes.js";
import conversationRouter from "./routes/conversation.routes.js";
import messageRouter from "./routes/message.routes.js";

const app = express();

/* -------------------- middlewares -------------------- */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

/* -------------------- routes -------------------- */
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.use("/api/v1", followRouter);
app.use("/api/v1", likeRouter);
app.use("/api/v1", commentRouter);

app.use("/api/v1/feed", feedRouter);
app.use("/api/v1/conversations", conversationRouter);
app.use("/api/v1/messages", messageRouter);

export { app };
