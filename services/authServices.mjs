import jwt from "jsonwebtoken";
import { db } from "../db/database.mjs";
import bcrypt from "bcrypt";

// 회원가입 로직
export async function signupUser({ userid, password, email }) {
  if (!userid || !password || !email) {
    return { success: false, message: "모든 값을 입력하세요!" };
  }
  try {
    const [rows] = await db.query("select * from users where userid = ?", [
      userid,
    ]);
    if (rows.length > 0) {
      return { success: false, message: "이미 존재하는 아이디입니다!" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "insert into users (userid, password, email) values (?, ?, ?)",
      [userid, hashedPassword, email]
    );
    return { success: true, message: "회원가입 되었습니다!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "서버 오류가 발생했습니다!" };
  }
}

// 로그인 로직
export async function loginUser({ userid, password }) {
  if (!userid || !password) {
    return { success: false, message: "모든 값을 입력하세요!" };
  }
  try {
    const [rows] = await db.query(
      "select idx, userid, password from users where userid = ?",
      [userid]
    );
    const user = rows[0];
    if (rows.length === 0) {
      return { success: false, message: "존재하지 않는 아이디입니다!" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: "비밀번호가 일치하지 않습니다!" };
    }
    const token = jwt.sign(
      { userid: user.userid, idx: user.idx },
      "asdasdw!@#",
      {
        expiresIn: "1d",
      }
    );
    return { success: true, message: "로그인 되었습니다!", token };
  } catch (err) {
    console.error(err);
    return { success: false, message: "서버 오류가 발생했습니다!" };
  }
}

// 로그아웃 로직
