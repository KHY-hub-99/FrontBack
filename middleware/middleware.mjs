import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // 1. Authorization 헤더에서 값(토큰)을 가져옵니다.
  const authHeader = req.headers["authorization"];
  // 토큰이 없거나 Bearer 형식이 아니면 401 Unauthorized 반환
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "인증 토큰이 누락되었습니다." });
  }

  const token = authHeader.split(" ")[1]; // 'Bearer ' 제거

  // 2. 토큰을 Secret Key로 검증하고 페이로드를 추출합니다.
  jwt.verify(token, "asdasdw!@#", (err, decodedUser) => {
    if (err) {
      // 토큰이 만료되었거나 유효하지 않음
      return res
        .status(403)
        .json({ message: "유효하지 않거나 만료된 토큰입니다." });
    }

    // 3. 검증된 사용자 정보를 req 객체에 저장합니다.
    // 이제 이 정보는 컨트롤러에서 안전하게 사용될 수 있습니다.
    req.user = decodedUser;

    next(); // 다음 미들웨어(글 작성 컨트롤러)로 이동
  });
};
