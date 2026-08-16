import { useState } from "react";
import { apiRequest } from "../api/api";

function UserCard({ user }) {
    const [pending, setPending] = useState(false);

    const handleFollow = async () => {
        try {
            await apiRequest(`/follows/${user.id}`, {
                method: "POST"
            });

            setPending(true);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="user-card">
            <div className="avatar">
                {user.profileImage ? (
                    <img
                        src={user.profileImage}
                        alt=""
                    />
                ) : (
                    user.name?.[0]
                )}
            </div>

            <div className="user-card-info">
                <strong>{user.name}</strong>

                <span>
                    {user._count?.posts || 0} posts
                </span>
            </div>

            <button
                onClick={handleFollow}
                disabled={pending}
            >
                {pending ? "Pending" : "Follow"}
            </button>
        </div>
    );
}

export default UserCard;