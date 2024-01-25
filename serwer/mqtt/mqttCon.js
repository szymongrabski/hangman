require("dotenv").config({path: "./config.env"});
const mqtt = require('mqtt')

const updateRanking = () => {
    try {
        const topic = "ranking"
        const mqttClient = mqtt.connect(process.env.MQTT_ADDRESS)
    
        mqttClient.publish(
            topic,
            "Update ranking",
            (err) => {
                if (err) {
                    console.error("Error:", err)
                    mqttClient.end();
                }
                mqttClient.end();
            }
        )
    } catch (err) {
        console.error("Error:", err)
    }
}

module.exports = updateRanking;