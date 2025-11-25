import { db } from "../db/database.mjs";
import bcrypt from "bcrypt";

// 회원가입 로직
export async function signupUser({ userid, password, email }) {
  if (!userid || !password || !email) {
    return { success: false, message: "모든 값을 입력하세요!" };
  }

  try {
    // 중복 아이디 확인
    const [rows] = await db.query("select * from users where userid = ?", [
      userid,
    ]);

    if (rows.length > 0) {
      return { success: false, message: "이미 존재하는 아이디입니다!" };
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // DB에 저장
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
