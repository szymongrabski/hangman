import React, { useEffect, useState } from "react";
import mqtt from "mqtt";
import axios from "axios";

const Ranking = () => {
    const [ranking, setRanking] = useState([]);
    const MQTT_ADDRESS = "ws://localhost:8000/mqtt";
    const rankingTopic = "ranking";

    const fetchRanking = async () => {
        const response = await axios.get("http://localhost:5000/ranking/top5");
        console.log(response);
        if (response.status === 200) {
            setRanking(response.data);
        }
    };

    useEffect(() => {
        fetchRanking();
        const mqttClient = mqtt.connect(MQTT_ADDRESS);

        mqttClient.on("connect", () => {
            mqttClient.subscribe(rankingTopic);
        });

        const handleMessage = (topic, message) => {
            if (topic === rankingTopic) {
                fetchRanking();
            }
        };

        mqttClient.on("message", handleMessage);
        return () => {
            mqttClient.end();
        };
    }, []);

    return (
        <div className="ranking-container">
            <div className="ranking-content">
                <h2>Ranking</h2>
                <ul className="ranking-list">
                    {ranking.map((user, index) => (
                        <li
                            key={index}
                        >
                            <p style={{
                                fontSize: `${12 + (5-index) * 2}px`,
                            }}>
                                {index + 1}. {user.username} - {user.score}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Ranking;
