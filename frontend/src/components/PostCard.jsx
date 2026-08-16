import { useState } from "react";
import { apiRequest } from "../api/api";
import Comment from "./Comment";

function PostCard({ post, currentUser }) {
    const [liked, setLiked] = useState(
        post.likes?.some((like) => like.userId === currentUser?.id)
    );

    const [likes, setLikes] = useState(post.likes?.length || 0);
    const [comments, setComments] = useState(post.comments || []);
    const [comment, setComment] = useState("");

    const handleLike = async () => {
        try {
            if (liked) {
                await apiRequest(`/likes/post/${post.id}`, {
                    method: "DELETE"
                });

                setLikes((value) => value - 1);
                setLiked(false);
            } else {
                await apiRequest(`/likes/post/${post.id}`, {
                    method: "POST"
                });

                setLikes((value) => value + 1);
                setLiked(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();

        if (!comment.trim()) return;

        try {
            const newComment = await apiRequest(
                `/comments/post/${post.id}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        content: comment
                    })
                }
            );

            setComments((oldComments) => [
                ...oldComments,
                newComment
            ]);

            setComment("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <article className="post-card">
            <div className="post-author">
                <div className="avatar">
                    {post.author?.profileImage ? (
                        <img
                            src={post.author.profileImage}
                            alt=""
                        />
                    ) : (
                        post.author?.name?.[0]
                    )}
                </div>

                <strong>{post.author?.name}</strong>
            </div>

            <p className="post-content">
                {post.content}
            </p>

            {post.image && (
                <img
                    className="post-image"
                    src={post.image}
                    alt="Post"
                />
            )}

            <div className="post-actions">
                <button onClick={handleLike}>
                    {liked ? "♥" : "♡"} {likes}
                </button>

                <span>
                    💬 {comments.length}
                </span>
            </div>

            <div className="comments">
                {comments.map((comment) => (
                    <Comment
                        key={comment.id}
                        comment={comment}
                    />
                ))}
            </div>

            <form
                className="comment-form"
                onSubmit={handleComment}
            >
                <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a comment..."
                />

                <button type="submit">
                    Comment
                </button>
            </form>
        </article>
    );
}

export default PostCard;