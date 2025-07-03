import { useState, useEffect, useRef } from "react";

const useWebSocket = () => {
  const [notifications, setNotifications] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    const connect = () => {
      // Use development URL for now; update to production URL (wss://farmio-api.com/notifications) later
      wsRef.current = new WebSocket("ws://localhost:8081/notifications");

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const { type, message } = JSON.parse(event.data);
          setNotifications((prev) => [
            ...prev,
            { id: Date.now(), message, type },
          ]);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("WebSocket disconnected, reconnecting...");
        setTimeout(connect, 3000); // Reconnect after 3 seconds
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const clearNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return { notifications, clearNotification };
};

export default useWebSocket;