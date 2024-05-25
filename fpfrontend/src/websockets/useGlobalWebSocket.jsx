import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import userService from '../services/userService';
import useAuthStore from '../stores/useAuthStore';



export const useGlobalWebSocket = (url, shouldConnect) => {
    const ws = useRef(null);
    const { logout } = useAuthStore();
    const forcedLogout = async() => {
        await userService.logout();
        logout();
    }

    useEffect(() => {
        if (!shouldConnect) return;

        const sessionToken = Cookies.get('sessionToken'); 
        const fullUrl = `${url}?sessionToken=${sessionToken}`;
        
        ws.current = new WebSocket(fullUrl);
        console.log('Connecting Global WebSocket');

        ws.current.onopen = () => {
            console.log('WebSocket Global Connected', fullUrl);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Global Error:', error);
        };

        ws.current.onmessage = (e) => {
            try {
                const message = JSON.parse(e.data);
                console.log('WebSocket Global Message:', message);

                if (message.type === 'forcedLogout') {
                    forcedLogout(); 
                }
            } catch (error) {
                console.error('Error parsing message:', e.data, error);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                console.log('WebSocket Global Disconnected', fullUrl);
            }
        };
    }, [url, shouldConnect]);

    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        } else {
            console.error("WebSocket Global is not open.");
        }
    };

    return { sendMessage };
};
