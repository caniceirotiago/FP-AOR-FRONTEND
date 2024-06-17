import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import groupMessageService from '../services/groupMessageService';
import useAuthStore from '../stores/useAuthStore';

export const useGroupMessageWebSocket = (url, shouldConnect) => {
    const ws = useRef(null);
    const { logout } = useAuthStore();

    useEffect(() => {
        if (!shouldConnect) return;

        const sessionToken = Cookies.get('sessionToken'); 
        const fullUrl = `${url}?sessionToken=${sessionToken}`;
        
        ws.current = new WebSocket(fullUrl);
        console.log('Connecting Group Message WebSocket');

        ws.current.onopen = () => {
            console.log('WebSocket Group Message Connected', fullUrl);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Group Message Error:', error);
        };

        ws.current.onmessage = (e) => {
            try {
                const message = JSON.parse(e.data);
                console.log('WebSocket Group Message:', message);

                if (message.type === 'GROUP_MESSAGE') {
                    // Handle the group message here
                    handleGroupMessage(message);
                }
            } catch (error) {
                console.error('Error parsing message:', e.data, error);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                console.log('WebSocket Group Message Disconnected', fullUrl);
            }
        };
    }, [url, shouldConnect]);

    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error("WebSocket Group Message is not open.");
        }
    };

    const handleGroupMessage = (message) => {
        // Implement your logic to handle the incoming group message
        console.log('Received Group Message:', message);
        // Example: You might want to update the state or notify the user
    };

    return { sendMessage };
};
