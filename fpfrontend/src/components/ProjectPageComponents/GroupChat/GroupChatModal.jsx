import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageBox, Input, Button } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css'; 
import styles from './GroupChatModal.module.css';
import useGroupChatStore from '../../../stores/useGroupChatStore';
import groupMessageService from '../../../services/groupMessageService';
import { IntlProvider , FormattedMessage} from 'react-intl';
import { useNavigate } from 'react-router-dom';


const GroupChatModal = () => {
    const { isGroupChatModalOpen, selectedChatProject, closeGroupChatModal } = useGroupChatStore();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleMessage = useCallback((message) => {
        const formattedMessage  = {
            ...message,
            position: message.senderId === sessionStorage.getItem('senderId') ? 'left' : 'right',
            type: 'text',
            text: message.content,
            date: message.sentTime,
            title: message.groupId,
            status: message.isViewed ? 'read' : 'sent',
            onTitleClick: () => {navigate(`//projectpage/${message.groupId}`)}
        };
        
        setMessages(prevMessages => [...prevMessages, formattedMessage]);
        
       if(message.status === "sent" && message.senderId === sessionStorage.getItem('senderId')) handleMarkAsRead([formattedMessage ]);
    }, [navigate]);

    const updateMessages = useCallback((updatedMessages) => {
        setMessages(prevMessages => prevMessages.map(msg => {
            const found = updatedMessages.find(updateMsg => updateMsg.id === msg.id);
            return found ? { ...msg, status: 'read' } : msg;
        }));
    }, [navigate]);

    useEffect(() => {
        if (isGroupChatModalOpen && selectedChatProject) {
            setLoading(true);
            groupMessageService.getAllGroupMessages(selectedChatProject.projectId)
                .then(fetchedMessages => {
                    const messagesToUpdate = fetchedMessages.filter(msg => !msg.isViewed && msg.receiverUsername === sessionStorage.getItem('username'));

                    setMessages(fetchedMessages.map(msg => ({
                        ...msg,
                        position: msg.senderId === sessionStorage.getItem('senderId') ? 'left' : 'right',
                        type: 'text',
                        text: msg.content,
                        date: msg.sentTime,
                        title: msg.groupId,
                        status: msg.isViewed ? 'read' : 'sent',
                        onTitleClick: () => { navigate(`/projectpage/${msg.groupId}`); }
                    })));

                    if (messagesToUpdate.length > 0) {
                        handleMarkAsRead(messagesToUpdate);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch group messages:', err);
                    setError('Failed to load group messages');
                    setLoading(false);
                });
        }
    }, [isGroupChatModalOpen, selectedChatProject, navigate]);

    
    const messagesEndRef = useRef(null); 

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView();
    };

    useEffect(() => {
        scrollToBottom();  
    }, [messages]); 

    const handleSendMessage = () => {
        if (inputText.trim()) {
            const newMessage = {
                content: inputText,
                groupId: selectedChatProject.projectId
            };
            groupMessageService.sendGroupMessage(newMessage)
                .then(() => {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        {
                            ...newMessage,
                            position: 'right',
                            type: 'text',
                            text: newMessage.content,
                            date: new Date(),
                            title: selectedChatProject.projectId,
                            status: 'sent'
                        }
                    ]);
                    setInputText("");
                    scrollToBottom();
                })
                .catch(err => {
                    console.error('Failed to send message:', err);
                });
        }
    };
    

    const handleMarkAsRead = (messagesToUpdate) => {
        const messageIds = messagesToUpdate.map(msg => msg.id);
        groupMessageService.markMessagesAsRead(selectedChatProject.projectId, messageIds)
            .then(() => {
                updateMessages(messagesToUpdate);
            })
            .catch(err => {
                console.error('Failed to mark messages as read:', err);
            });
    };

    if (!isGroupChatModalOpen) return null;


    return (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <button className={styles.closeButton} onClick={closeGroupChatModal}>&times;</button>
                    <h2><FormattedMessage id="chatGroup">Project Chat Group</FormattedMessage> {selectedChatProject.projectId}</h2>
                    <div className={styles.messagesContainer}>
                        {messages.map((msg, index) => (
                            <MessageBox key={index} {...msg} />
                        ))}
                        <div ref={messagesEndRef} />  
                    </div>
                    <div className={styles.inputArea}>
                    <FormattedMessage id="typeMessagePlaceholder">{(placeholder) => (<input
                        type="text"
                        placeholder={placeholder}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className={styles.input}
                        maxLength={1000}
                    />)}</FormattedMessage>
                    <FormattedMessage id="sendMsgBtn">{(text) => (<Button
                        className={styles.button}
                        text={text}
                        onClick={handleSendMessage}
                    />)}</FormattedMessage>
                    </div>
                </div>
            </div>
    );
};

export default GroupChatModal;
