import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import PostCard from "../components/PostCard";
import { apiRequest } from "../api/api";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const loadPosts = async () => {
        try {
            const data = await apiRequest("/posts");
            setPosts(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const createPost = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            const post = await apiRequest("/posts", {
                method: "POST",
                body: JSON.stringify({
                    content
                })
            });

            setPosts((oldPosts) => [
                post,
                ...oldPosts
            ]);

            setContent("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Navbar />

            <main className="feed">
                <h1>Home</h1>

                <form
                    className="create-post"
                    onSubmit={createPost}
                >
                    <textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                    />

                    <button type="submit">
                        Post
                    </button>
                </form>

                <div className="posts">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Feed;