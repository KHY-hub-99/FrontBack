import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import * as AR from "./router/authRouter.mjs";

const app = express();
const port = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기능별 라우트 연결

// 회원가입
app.post("/auth/signup", AR.signup);

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
