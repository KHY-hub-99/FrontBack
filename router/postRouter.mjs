import * as services from "../services/postServices.mjs";

// 포스트 작성 export
export const write = async (req, res) => {
  const verifyUserid = req.user.userid;
  const { textTitle, text } = req.body;
  const result = await services.writePost({
    textTitle,
    text,
    userid: verifyUserid,
  });

  if (result.success) {
    return res.status(201).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};

// 모든 포스트 보기 export
export const allPosts = async (req, res) => {
  const result = await services.getPosts();

  if (result.success) {
    return res.status(200).json({ posts: result.posts });
  } else {
    return res.status(500).json({ message: result.message });
  }
};

// 하나의 포스트 가져오기 export
export const getPost = async (req, res) => {
  const { id } = req.params;

  const result = await services.getPostById(id);

  if (!result.success) {
    return res.status(404).json({ message: result.message });
  }

  return res.status(200).json(result.post);
};

// 게시글 수정하기 export
export const update = async (req, res) => {
  const postId = req.params.id;
  const verifyUserid = req.user.userid;
  const { textTitle, text } = req.body;
  const result = await services.updatePost({
    postId,
    textTitle,
    text,
    userid: verifyUserid,
  });

  if (result.success) {
    return res.status(201).json({ message: result.message });
  } else {
    return res.status(400).json({ message: result.message });
  }
};
