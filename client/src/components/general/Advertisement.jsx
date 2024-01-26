import React, { useEffect, useState } from "react";

const Advertisement = () => {
  const [advertisement, setAdvertisement] = useState("");

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/events/advertisement");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setAdvertisement(data);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="ad-item">
      {advertisement && (
        <>
          <h2>{advertisement.title}</h2>
          <p>{advertisement.description}</p>
          <img  className="ad-img" src={advertisement.imageUrl} alt="reklama" />
        </>
      )}
    </div>
  );
};

export default Advertisement;
