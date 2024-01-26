import React, { useState, useEffect } from "react";
import axios from "axios";

const RankingPanel = () => {
  const [ranking, setRanking] = useState([]);

  const fetchRanking = async () => {
    try {
      const response = await axios.get("http://localhost:5000/ranking");
      setRanking(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    fetchRanking();
  }, [ranking]);


  const handleDelete = async (userId) => {
    try {
        const response = await axios.delete(`http://localhost:5000/ranking/user/${userId}`)
        
        if (response.data.success) {
            setRanking((prevValue) => prevValue.filter((user) => user.user_id !== userId))
        }
    } catch (error) {
        console.error("Error while deleting user:", error.message)
    }
  }

  return (
    <div className="admin-item">
      <h2>Ranking</h2>
      <ul className="admin-list">
        {ranking.map((ranking) => (
          <li key={ranking._id}>
            <div>
              <p>{ranking.username} - {ranking.score}</p>
            </div>
            <div className="admin-btn-container">
                <button className="admin-btn del-btn" onClick={() => handleDelete(ranking.user_id)}>Usuń</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingPanel;
