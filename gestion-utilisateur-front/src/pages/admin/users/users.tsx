import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface UserDTO {
    id: number;
    username: string;
    role: string;
}

export default function Users() {
    const { token } = useAuth();
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>({});
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchUsers = async (page = 0) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/users?page=${page}&size=4`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            const pageData = await response.json();

            setUsers(pageData.content);
            setTotalPages(pageData.totalPages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    //met à jour la liste des users, donc la pagination
    useEffect(() => {
        if (token) fetchUsers(currentPage);
    }, [token, currentPage]);

        //Change les rôles
        const changeRole = async (userId: number) => {
        const newRole = selectedRoles[userId];
        if (!newRole) return alert("Veuillez sélectionner un rôle !");
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/users/${userId}/role`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newRole),
                }
            );

            if (!response.ok) throw new Error(`Erreur ${response.status}`);

            setUsers((prev) =>
                prev.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            alert("Rôle mis à jour !");
        } catch (err: any) {
            alert("Erreur: " + err.message);
        }
    };

    if (loading) return <div style={{ color: "white" }}>Chargement...</div>;
    if (error) return <div style={{ color: "red" }}>Erreur: {error}</div>;

    const goToPage = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div style={{ minHeight: "100vh", padding: "2rem" }}>
            {/*tableau pour changer les rôles*/}
            <div style={{ width: "800px", margin: "auto", color: "white" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                    Liste des utilisateurs
                </h2>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Changer</th>
                    </tr>
                    </thead>
                    <tbody style={{ marginLeft: "200px"}}>
                    {users.map((user) => (
                        <tr  key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <select
                                    value={selectedRoles[user.id] || ""}
                                    onChange={(e) =>
                                        setSelectedRoles((prev) => ({
                                            ...prev,
                                            [user.id]: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">--Choisir--</option>
                                    <option value="ROLE_USER">User</option>
                                    <option value="ROLE_ADMIN">Admin</option>
                                </select>

                                <button style={{marginLeft: "100px"}} onClick={() => changeRole(user.id)}>Valider</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/*pagination*/}
                <div style={{ marginTop: "1rem" }}>
                    Page {currentPage + 1} / {totalPages}
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>
                            <ChevronLeft />
                        </button>
                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
