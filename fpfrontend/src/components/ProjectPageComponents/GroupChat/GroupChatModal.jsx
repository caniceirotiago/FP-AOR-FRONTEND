import React, { useState, useEffect, useRef } from "react";
import { MessageBox, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import styles from "./GroupChatModal.module.css";
import useGroupChatStore from "../../../stores/useGroupChatStore";
import groupMessageService from "../../../services/groupMessageService";
import { FormattedMessage } from "react-intl";
import { useNavigate, useLocation } from "react-router-dom";
import { useGroupMessageWebSocket } from "../../../websockets/useGroupMessageWebSocket";

const GroupChatModal = () => {
  const {
    isGroupChatModalOpen,
    selectedChatProject,
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

  const handleIncomingMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: message.id,
        position:
          message.senderId === parseInt(localStorage.getItem("userId"))
            ? "right"
            : "left",
        type: "text",
        text: message.content,
        date: new Date(message.sentTime),
        status: message.isViewed ? "read" : "sent",
        sender: {
          id: message.senderId,
          username: message.senderUsername,
          photo: message.senderPhoto,
        },
        title: message.senderUsername,
      },
    ]);
  };

  const { sendMessage } = useGroupMessageWebSocket(
    "ws://localhost:8080/FPBackend/ws/group/messages",
    isGroupChatModalOpen,
    handleIncomingMessage
  );

  // Fetch messages when the modal is open and a project is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (isGroupChatModalOpen && selectedChatProject) {
        setLoading(true);
        try {
          const response = await groupMessageService.getAllGroupMessages(
            selectedChatProject.projectId
          );
          const fetchedMessages = await response.json();
          const formattedMessages = fetchedMessages.map((msg) => ({
            id: msg.messageId,
            position:
              msg.sender.id === parseInt(localStorage.getItem("userId"))
                ? "right"
                : "left",
            type: "text",
            text: msg.content,
            date: new Date(msg.sentTime),
            status: msg.isViewed ? "read" : "sent",
            sender: {
              id: msg.sender.id,
              username: msg.sender.username,
              photo: msg.sender.photo,
            },
            title: msg.sender.username,
          }));
          setMessages(formattedMessages);
        } catch (err) {
          console.error("Failed to fetch group messages:", err);
          setError("Failed to load group messages");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMessages();
  }, [isGroupChatModalOpen, selectedChatProject, navigate]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = {
        content: inputText,
        groupId: selectedChatProject.projectId,
      };
      try {
        // Send message via WebSocket
        sendMessage({
          type: "GROUP_MESSAGE",
          content: newMessage.content,
          groupId: newMessage.groupId,
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

  // Close modal on location change
  useEffect(() => {
    reset();
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
        <button className={styles.closeButton} onClick={closeGroupChatModal}>
          &times;
        </button>
        <h2>
          {selectedChatProject.projectName}{" "}
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
