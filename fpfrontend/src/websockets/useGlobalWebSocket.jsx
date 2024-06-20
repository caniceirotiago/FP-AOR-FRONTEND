import { useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import userService from '../services/userService';
import useAuthStore from '../stores/useAuthStore';
import useNotificationStore from '../stores/useNotificationStore';



export const useGlobalWebSocket = (url, shouldConnect) => {
    const audioRef = useRef(new Audio('../assets/notification.wav')); // Substitua pelo caminho correto do arquivo de som

    const {addNotification} = useNotificationStore();
    const ws = useRef(null);
    const { logout } = useAuthStore();
    const forcedLogout = async() => {
        const response = await userService.logout();
        if(!response.status === 204){
            const message = {type: 'FORCED_LOGOUT_FAILED', content: 'Failed to logout user. Please try again.'};
            sendMessage(message);
        }
        logout();
    }

    useEffect(() => {
        if (!shouldConnect) return;

        const sessionToken = Cookies.get('sessionToken'); 
        const fullUrl = `${url}/${sessionToken}`;
        
        ws.current = new WebSocket(fullUrl);
        console.log('Connecting Global WebSocket');

        ws.current.onopen = () => {
            console.log('WebSocket Global Connected', fullUrl);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket Global Error:', error);
        };

        ws.current.onmessage = (e) => {
            console.log('WebSocket Global Message:', e.data);
            try {
                const message = JSON.parse(e.data);
                console.log('WebSocket Global Message:', message);

                if (message.type === 'FORCED_LOGOUT') {
                    forcedLogout(); 
                }
                else if(message.type === "RECEIVED_NOTIFICATION"){
                    console.log("Notification received");
                    
                    addNotification(message.data);

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
