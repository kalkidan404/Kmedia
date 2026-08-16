import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import UserCard from "../components/UserCard";
import { apiRequest } from "../api/api";

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await apiRequest("/user/all");
                setUsers(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadUsers();
    }, []);

    return (
        <div>
            <Navbar />

            <main className="page">
                <h1>People</h1>

                <div className="users">
                    {users.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Users;