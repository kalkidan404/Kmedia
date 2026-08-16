function Comment({ comment }) {
    return (
        <div className="comment">
            <strong>{comment.author?.name}</strong>

            <span>
                {comment.content}
            </span>
        </div>
    );
}

export default Comment;