import { useEffect, useRef } from "react";
import Cookies from "js-cookie";

export const useGroupMessageWebSocket = (
  url,
  shouldConnect,
  onMessageReceived
) => {
  const ws = useRef(null);

  useEffect(() => {
    if (!shouldConnect) return;

    const sessionToken = Cookies.get("sessionToken");
    const fullUrl = `${url}?sessionToken=${sessionToken}`;

    ws.current = new WebSocket(fullUrl);
    console.log("Connecting Group Message WebSocket");

    ws.current.onopen = () => {
      console.log("WebSocket Group Message Connected", fullUrl);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Group Message Error:", error);
    };

    ws.current.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        console.log("WebSocket Group Message:", message);

        if (message.type === "GROUP_MESSAGE" && onMessageReceived) {
          onMessageReceived(message);
        }
      } catch (error) {
        console.error("Error parsing message:", e.data, error);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
        console.log("WebSocket Group Message Disconnected", fullUrl);
      }
    };
  }, [url, shouldConnect, onMessageReceived]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket Group Message is not open.");
    }
  };

  return { sendMessage };
};
