import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";

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
  const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>(
    {},
  );

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) throw new Error(`Erreur ${response.status}`);

        const data: UserDTO[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

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
          body: JSON.stringify(selectedRoles[userId]),
        },
      );

      if (!response.ok) throw new Error(`Erreur ${response.status}`);

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user,
        ),
      );
      alert("Rôle mis à jour avec succès !");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
  };

  if (loading) return <div style={{ color: "white" }}>Chargement...</div>;
  if (error) return <div style={{ color: "red" }}>Erreur: {error}</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "2rem",
        background: "rgba(0,0,0,0.2)",
      }}
    >
      <div
        style={{
          width: "800px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          borderRadius: "xl",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "1.5rem",
          color: "white",
        }}
      >
        <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Liste des utilisateurs
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Username</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Role</th>
              <th style={{ textAlign: "left", padding: "0.5rem" }}>Changer</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  marginBottom: "0.5rem",
                  borderRadius: "6px",
                }}
              >
                <td style={{ padding: "0.5rem" }}>{user.username}</td>
                <td style={{ padding: "0.5rem" }}>{user.role}</td>
                <td
                  style={{ padding: "0.5rem", display: "flex", gap: "0.5rem" }}
                >
                  <select
                    value={selectedRoles[user.id] || ""}
                    onChange={(e) =>
                      setSelectedRoles((prev) => ({
                        ...prev,
                        [user.id]: e.target.value,
                      }))
                    }
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid #CBD5E0",
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                    }}
                  >
                    <option value="">--Choisir un rôle--</option>
                    <option value="ROLE_USER">User</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                  <button
                    onClick={() => changeRole(user.id)}
                    style={{
                      padding: "4px 12px",
                      borderRadius: "4px",
                      border: "none",
                      background: "#3B82F6",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Valider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
