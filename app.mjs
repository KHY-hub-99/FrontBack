import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import * as AR from "./router/authRouter.mjs";
import * as PR from "./router/postRouter.mjs";
import { authenticateToken } from "./middleware/middleware.mjs";
import cors from "cors";

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/* 기능별 라우트 연결 */
// 회원가입
app.post("/auth/signup", AR.signup);

// 로그인
app.post("/auth/login", AR.login);

// 로그아웃
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "로그아웃 완료" });
});

// 포스트 작성
app.post("/post/write", authenticateToken, PR.write);

// 모든 포스트 보기
app.get("/posts", PR.allPosts);

// 하나의 포스트 보기
app.get("/posts/:id", PR.getPost);

// 수정하기
app.put("/posts/:id", authenticateToken, PR.update);

// 삭제하기
app.delete("/posts/:id", authenticateToken, PR.remove);

// 루트 접속 시 login.html로 리다이렉트
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 404 처리
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.listen(port, () => {
  console.log(`${port} 포트 서버 구동 중...`);
});
