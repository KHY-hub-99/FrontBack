import * as services from "../services/authServices.mjs";

// 회원가입 export
export const signup = async (req, res) => {
  const { userid, password, email } = req.body;

  const result = await services.signupUser({ userid, password, email });

  if (result.success) {
    return res.status(200).json({ message: result.message });
  }
  return res.status(400).json({ message: result.message });
};
