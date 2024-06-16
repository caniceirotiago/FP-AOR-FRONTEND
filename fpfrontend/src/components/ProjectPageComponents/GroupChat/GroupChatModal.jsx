import React, { useState, useEffect, useRef } from "react";
import { MessageBox, Input, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import styles from "./GroupChatModal.module.css";
import useGroupChatStore from "../../../stores/useGroupChatStore";
import groupMessageService from "../../../services/groupMessageService";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";

const GroupChatModal = () => {
  const { isGroupChatModalOpen, selectedChatProject, closeGroupChatModal } =
    useGroupChatStore();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

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
          console.log("Fetched Messages:", fetchedMessages); // Log fetched data

          const formattedMessages = fetchedMessages.map((msg) => ({
            id: msg.messageId,
            position: msg.senderId === 1 ? "right" : "left",
            type: "text",
            text: msg.content,
            date: new Date(msg.sentTime),
            title: msg.groupId,
            status: msg.isViewed ? "read" : "sent",
            onTitleClick: () => {
              navigate(`/projectpage/${msg.groupId}`);
            },
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
        // Send message with content and groupId
        await groupMessageService.sendGroupMessage(newMessage);

        // Update local messages state
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...newMessage,
          position: "right",
          type: "text",
          text: newMessage.content,
          date: new Date(),
          title: selectedChatProject.projectId,
          status: "sent",
        },
      ]);

      setInputText(""); // Clear input text
      messagesEndRef.current?.scrollIntoView(); // Scroll to bottom
    } catch (err) {
      console.error("Failed to send message:", err);
    }
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
          <FormattedMessage id="chatGroup">Project Chat Group</FormattedMessage>{" "}
          {selectedChatProject.projectId}
        </h2>
        <div className={styles.messagesContainer}>
          {loading && <p>Loading messages...</p>}
          {error && <p>{error}</p>}
          {messages.map((msg) => (
            <div key={msg.id}>
              <MessageBox
                position={msg.position}
                type={msg.type}
                text={msg.text}
                date={msg.date}
                status={msg.status}
              />
            </div>
          ))}
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
