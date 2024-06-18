import React, { useState, useEffect, useRef, useMemo } from "react";
import { MessageBox, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import styles from "./GroupChatModal.module.css";
import useGroupChatStore from "../../../stores/useGroupChatStore";
import groupMessageService from "../../../services/groupMessageService";
import { FormattedMessage } from "react-intl";
import { useNavigate, useLocation } from "react-router-dom";
import { useGroupMessageWebSocket } from "../../../websockets/useGroupMessageWebSocket";
import useDomainStore from '../../../stores/useDomainStore';
import Cookies from 'js-cookie';

const GroupChatModal = (selectedProject, isGroupChatModalOpen) => {
  const {
    closeGroupChatModal,
    reset,
  } = useGroupChatStore();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);


  const wsUrl = useMemo(() => {

    const sessionToken = Cookies.get("sessionToken");
    const sessionTokenUrl = sessionToken;
    const projectIdUrl = selectedProject.projectId;
    console.log("projectIdUrl:", projectIdUrl);
    const newWsUrl = `ws://${
      useDomainStore.getState().domain
    }/groupChat/${sessionTokenUrl}/${projectIdUrl}`;

    return `${newWsUrl}`;
  }, [selectedProject.projectId]);

  const handleIncomingMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages, message,
    ]);
  };

  const { sendGroupMessageWS } = useGroupMessageWebSocket(
    wsUrl,
    isGroupChatModalOpen && wsUrl,
    handleIncomingMessage
  );

  // Fetch messages when the modal is open and a project is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (isGroupChatModalOpen && selectedProject) {
        setLoading(true);
        try {
          const response = await groupMessageService.getAllGroupMessages(
            selectedProject.projectId
          );
          const data = await response.json();
          console.log("data:", data);
          setMessages(data);
        } catch (err) {
          console.error("Failed to fetch group messages:", err);
          setError("Failed to load group messages");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMessages();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = {
        content: inputText,
        senderId: parseInt(localStorage.getItem("userId")),
        groupId: selectedProject.projectId,
      };
      try {
        // Send message via WebSocket
        sendGroupMessageWS({
          type: "GROUP_MESSAGE",
          data: {
            content: newMessage.content,
            senderId: newMessage.senderId,
            groupId: newMessage.groupId,
          },
        });

        // Update local messages state
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...newMessage,
            position: "right",
            type: "text",
            text: newMessage.content,
            date: new Date(),
            status: "sent",
            sender: {
              id: parseInt(localStorage.getItem("userId")),
              username: localStorage.getItem("username"),
              photo: localStorage.getItem("photo"),
            },
            title: localStorage.getItem("username"),
          },
        ]);
        setInputText(""); // Clear input text
        messagesEndRef.current?.scrollIntoView(); // Scroll to bottom
      } catch (err) {
        console.error("Failed to send message:", err);
        setError("Failed to send message. Please try again.");
      }
    }
  };

  const handleCloseGroupChatModal = () => {
    setGroupChatModalOpen: false,
    setSelectedProject: null;
  };

  // Close modal on location change
  useEffect(() => {
    handleCloseGroupChatModal();
  }, [location.pathname, reset]);

  // Function to handle sending message when Enter key is pressed
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!isGroupChatModalOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={handleCloseGroupChatModal}>
          &times;
        </button>
        <h2>
          {selectedProject.projectName}{" "}
          <FormattedMessage id="chatGroup"></FormattedMessage>
        </h2>
        <div className={styles.messagesContainer}>
          {loading && <p>Loading messages...</p>}
          {error && <p>{error}</p>}
          {messages.map((msg, index) => {
            const isSentByCurrentUser =
              msg.sender.id === parseInt(localStorage.getItem("userId"));
            const displayName = isSentByCurrentUser ? "" : msg.sender.username;
            const displayAvatar = isSentByCurrentUser ? "" : msg.sender.photo;
            return (
              <MessageBox
                key={index}
                avatar={displayAvatar}
                position={msg.position}
                type={msg.type}
                text={msg.text}
                date={msg.date}
                status={msg.status}
                title={displayName}
                onTitleClick={() =>
                  navigate(`/userProfile/${msg.sender.username}`)
                }
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className={styles.inputArea}>
          <FormattedMessage id="typeMessagePlaceholder">
            {(placeholder) => (
              <input
                type="text"
                placeholder={placeholder}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className={styles.input}
                maxLength={1000}
                onKeyDown={handleKeyPress}
              />
            )}
          </FormattedMessage>
          <FormattedMessage id="sendMsgBtn">
            {(text) => (
              <Button
                className={styles.button}
                text={text}
                onClick={handleSendMessage}
              />
            )}
          </FormattedMessage>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
