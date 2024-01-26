import React, { useContext, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import EditAdminForm from "./EditAdminForm";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../contexts/AuthContext";

const SelfPanel = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['user'])
  const [editAdmin, setEditAdmin] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  

  const handleEditCancel = () => {
    setEditAdmin(false)
  }

  const handleDeleteSelf = async () => {
    try {
      const response = await axios.delete(`http://localhost:5000/admins/admin/${cookies.UserId}`);

      if (response.data.success) {
        removeCookie('AuthToken', { path: '/', expires: new Date(0) });
        removeCookie('Username', { path: '/', expires: new Date(0) });
        removeCookie('UserId', { path: '/', expires: new Date(0) });
        logout();
        navigate('/');
      }
    } catch (error) {
      console.error("Błąd podczas usuwania konta:", error.message)
    }
  }

  return (
    <div>
      <div className="admin-buttons">
        <button  className="btn" onClick={() => setEditAdmin(prevValue => !prevValue)}>Edytuj</button>
        <button className="log-out-btn" onClick={handleDeleteSelf}>Usuń konto</button>
      </div>
      {editAdmin && (
        <EditAdminForm userId={cookies.UserId} username={cookies.Username} onCancel={handleEditCancel} />
      )}
    </div>
  );
};

export default SelfPanel;
