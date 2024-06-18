import { useEffect, useRef } from "react";

export const useGroupMessageWebSocket = (  url,  shouldConnect,  onMessageReceived,  closeGroupChatModal,  updateMessages) => {
  const ws = useRef(null);

  useEffect(() => {
    if (!shouldConnect) return;

    ws.current = new WebSocket(url);
    console.log("Connecting Group Message WebSocket");

    ws.current.onopen = () => {
      console.log("WebSocket Group Message Connected", url);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Group Message Error:", error);
    };

    ws.current.onmessage = (e) => {
      try {
        const message = JSON.parse(e.data);
        console.log("WebSocket Group Message:", message);
        if (message.type === "GROUP_MESSAGE" && onMessageReceived) {
          onMessageReceived(message.data);
        }
        if (message.type === "markedAsReadMessages") {
          console.log("Messages marked as read:", message.data);
          updateMessages(message.data);
        }
      } catch (error) {
        console.error("Error parsing message:", e.data, error);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
        console.log("WebSocket Group Message Disconnected", url);
      }
    };
  }, [url, shouldConnect, onMessageReceived]);

  const sendGroupMessageWS = (data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const message = { type: "GROUP_MESSAGE", data: data };
      ws.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket Group Message is not open.");
      closeGroupChatModal();
    }
  };

  return { sendGroupMessageWS };
};
