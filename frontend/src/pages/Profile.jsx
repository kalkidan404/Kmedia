import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import { apiRequest } from "../api/api";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await apiRequest("/user");
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadProfile();
    }, []);

    if (!user) {
        return (
            <div>
                <Navbar />
                <main className="page">
                    <p>Loading...</p>
                </main>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <main className="profile-page">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt=""
                            />
                        ) : (
                            user.name?.[0]
                        )}
                    </div>

                    <h1>{user.name}</h1>

                    <p>{user.email}</p>

                    <span>
                        {user.posts?.length || 0} posts
                    </span>
                </div>

                <div className="posts">
                    {user.posts?.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUser={user}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Profile;