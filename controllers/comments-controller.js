import Comment from 'models/Comment';
import Closure from 'models/Closure';
import Post from 'models/Post';
import User from 'models/User';
import { sendEmail } from '@/utils/sendEmail';

export const AddComment = async (req, res) => {
    const { id } = req.query;
    const { comment, author, isAuthHidden } = req.body;

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json('Post not found.');
        }

        const commentAuthor = await User.findById(author);

        if (!commentAuthor) {
            return res.status(404).json('Comment Author not found.');
        }

        const closureDates = await Closure.findOne();

        if (!closureDates) {
            return res.status(404).json('Submissions are not open.');
        }

        const today = new Date().toISOString();
        const start = new Date(closureDates.startDate).toISOString();
        const initial = new Date(closureDates.initialClosureDate).toISOString();
        const final = new Date(closureDates.finalClosureDate).toISOString();
        if (today < start) {
            return res.status(400).json('Submissions are not open.');
        }

        if (today > initial && today > final) {
            return res.status(400).json('Submissions are closed.');
        }

        const newComment = new Comment(req.body);
        await newComment.save();

        post.comments.push(newComment);
        await post.save();

        if (commentAuthor.isAuthHidden === false) {
        }

        const postAuthor = await User.findById(post.author);

        if (postAuthor) {
            const subject = `${
                commentAuthor.isAuthHidden ? 'A user' : commentAuthor.name
            } commented on your post`;
            const text = `${commentAuthor.name} from ${commentAuthor.department} commented on your post "${post.title}"`;

            const html = `<head>
            <meta charset="UTF-8" />
            <title>New Comment Notification</title>
            <style>
              body {
                background-color: #f1f1f1;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                color: #555;
                margin: 0;
                padding: 0;
              }
    
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 30px;
                background-color: #fff;
              }
    
              h1 {
                font-size: 28px;
                margin-bottom: 30px;
                text-align: center;
              }
    
              .post {
                margin-bottom: 30px;
              }
    
              .post-title {
                font-size: 20px;
                margin-bottom: 10px;
              }
    
              .post-description {
                font-size: 16px;
                margin-bottom: 10px;
                color: #777;
              }
    
              .post-details {
                font-size: 16px;
                margin-bottom: 10px;
                color: #777;
              }
    
              .post-details strong {
                font-weight: bold;
                color: #555;
              }
    
              .footer {
                text-align: center;
                font-size: 14px;
                color: #999;
                margin-top: 30px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>New Comment Notification</h1>
    
              <div class="post">
                <div class="post-title">${post.title}</div>
                <div class="post-description">${newComment.comment}</div>
                <div class="post-details">
                  <div><strong>Author:</strong> ${
                      commentAuthor.isAuthHidden
                          ? 'Anonymous'
                          : commentAuthor.name
                  }</div>
                  <div><strong>Department:</strong> 
                  ${
                      commentAuthor.isAuthHidden
                          ? 'Hidden'
                          : commentAuthor.department
                  }</div>
                  <div><strong>Date:</strong> ${newComment.createdAt}</div>
                </div>
              </div>
    
              <div class="footer">
                This email was sent because ${
                    commentAuthor.isAuthHidden ? 'A user' : commentAuthor.name
                } commented on your post.
              </div>
            </div>
          </body>`;

            sendEmail(postAuthor.email, subject, text, html);
        }

        return res.status(200).json(newComment);
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const UpdateComment = async (req, res) => {
    const { id } = req.query;
    const { userId } = req.body;

    try {
        const findComment = await Comment.findById(id);

        if (!findComment) return res.status(404).json('Comment not found');

        if (findComment.author.toString() !== userId) {
            return res.status(401).json('Unauthorized');
        }

        await findComment.updateOne({ $set: req.body });

        return res.status(200).json('Comment updated');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const DeleteComment = async (req, res) => {
    const { id } = req.query;
    const { userId } = req.body;

    try {
        const findComment = await Comment.findById(id);

        if (!findComment) return res.status(404).json('Comment not found');

        if (findComment.author.toString() !== userId) {
            return res.status(401).json('Unauthorized');
        }

        await Comment.findByIdAndDelete(id);

        return res.status(200).json('Comment updated');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};

export const HideComment = async (req, res) => {
    const { id } = req.query;
    const { userId } = req.body.data;

    try {
        const findComment = await Comment.findById(id);

        if (!findComment) return res.status(404).json('Comment not found');

        if (findComment.author.toString() !== userId) {
            return res.status(401).json('Unauthorized');
        }

        findComment.deleted = true;
        await findComment.save();
        // await Comment.findByIdAndDelete(id);

        return res.status(200).json('Comment updated');
    } catch (error) {
        return res.status(500).json(`Internal Server Error: ${error}`);
    }
};
