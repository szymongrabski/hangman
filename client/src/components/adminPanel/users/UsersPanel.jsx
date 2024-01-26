import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPanel = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [users]);

  const handleDelete = async (userId) => {
    try {
        const response = await axios.delete(`http://localhost:5000/users/user/${userId}`)
        
        if (response.data.success) {
            setUsers((prevValue) => prevValue.filter((user) => user.user_id !== userId))
        }
    } catch (error) {
        console.error("Error while deleting user:", error.message)
    }
  }

  return (
    <div className="admin-item">
      <h2>Lista Użytkowników</h2>
      <ul className="admin-list">
        {users.map((user) => (
          <li key={user.user_id}>
            <div>
              <strong>{user.username}</strong>
            </div>
            <div className="admin-btn-container">
                <button className="admin-btn del-btn" onClick={() => handleDelete(user.user_id)}>Usuń</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPanel;
