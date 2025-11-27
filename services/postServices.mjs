import { db } from "../db/database.mjs";

// 포스트 작성 로직
export async function writePost({ textTitle, text, userid }) {
  try {
    if (!textTitle || !text) {
      return { success: false, message: "모든 값을 입력하세요!" };
    }
    const [rows] = await db.query("select idx from users where userid = ?", [
      userid,
    ]);
    if (rows.length === 0) {
      return { success: false, message: "존재하지 않는 사용자입니다!" };
    }

    const useridx = rows[0].idx;

    const sql = "insert into posts (useridx, textTitle, text) values (?, ?, ?)";

    await db.query(sql, [useridx, textTitle, text]);

    return { success: true, message: "글 작성 완료!" };
  } catch (err) {
    console.error(err);
    return { success: false, message: "서버 오류 발생!" };
  }
}

// 게시글 보기 로직
export async function getPosts() {
  try {
    const sql =
      "select p.id, p.textTitle, p.text, u.userid, p.createAt from posts as p join users as u on p.useridx = u.idx";
    const [rows] = await db.query(sql);
    return { success: true, posts: rows };
  } catch (err) {
    console.error("게시글 조회 중 오류:", err);
    return { success: false, message: "게시글 조회 중 서버 오류 발생!" };
  }
}

// 하나의 게시글 가져오기 로직
export async function getPostById(userid) {
  try {
    const sql =
      "select p.id, p.textTitle, p.text, u.userid, p.createAt from posts as p join users as u on p.useridx = u.idx where p.id = ?";
    const [rows] = await db.query(sql, [userid]);

    if (rows.length == 0) {
      return { success: false, message: "게시글을 찾을 수 없습니다!" };
    }
    return { success: true, post: rows[0] };
  } catch (err) {
    console.error("게시글 단일 조회 중 오류:", err);
    return { success: false, message: "서버 오류가 발생했습니다!" };
  }
}

// 게시글 수정하기 로직
export const updatePost = async ({ postId, textTitle, text, userid }) => {
  try {
    // 작성자가 맞는지 확인하고 수정
    const [rows] = await db.query(
      "update posts set textTitle = ?, text = ? where id = ? and useridx = (select idx from users where userid = ?)",
      [textTitle, text, postId, userid]
    );

    if (rows.length === 0) {
      return {
        success: false,
        message: "수정 권한이 없거나 게시글이 존재하지 않습니다.",
      };
    }

    return { success: true, message: "게시글이 수정되었습니다." };
  } catch (err) {
    console.error(err);
    return { success: false, message: "서버 오류" };
  }
};
