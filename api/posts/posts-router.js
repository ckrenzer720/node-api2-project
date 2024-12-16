// implement your posts router here
const express = require("express");
const Post = require("./posts-model");

const router = express.Router();

// find()
router.get("/", (req, res) => {
  Post.find(req.query)
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

// findById()
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((error) => {
      console.log(error);
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

// insert()
router.post("/", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.insert({ title, contents })
      .then(({ id }) => {
        return Post.findById(id);
      })
      .then((post) => res.status(201).json(post))
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

// update()
router.put("/:id", (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.findById(req.params.id)
      .then((post) => {
        if (!post) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        } else {
          return Post.update(req.params.id, req.body);
        }
      })
      .then((data) => {
        if (data) {
          return Post.findById(req.params.id);
        }
      })
      .then((post) => {
        if (post) {
          res.status(200).json(post);
        }
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ message: "The post information could not be modified" });
      });
  }
});

// remove()
router.delete("/:id", async (req, res) => {
  try {
    const postId = await Post.findById(req.params.id);
    if (!postId) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      await Post.remove(req.params.id);
      res.json(postId);
    }
  } catch (error) {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

// findPostComments()
router.get("/:id/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      const data = await Post.findPostComments(req.params.id);
      res.json(data);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "The comments information could not be retrieved" });
  }
});

module.exports = router;
