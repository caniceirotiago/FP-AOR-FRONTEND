import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { MessageBox, Button } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import styles from "./GroupChatModal.module.css";
import groupMessageService from "../../../services/groupMessageService";
import { FormattedMessage } from "react-intl";
import { useNavigate, useLocation } from "react-router-dom";
import { useGroupMessageWebSocket } from "../../../websockets/useGroupMessageWebSocket";
import useDomainStore from "../../../stores/useDomainStore";
import Cookies from "js-cookie";

const GroupChatModal = ({
  isGroupChatModalOpen,
  setGroupChatModalOpen,
  selectedChatProject,
  setSelectedChatProject,
}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const wsUrl = useMemo(() => {
    if (!selectedChatProject) return null;

    const sessionToken = Cookies.get("sessionToken");
    const sessionTokenUrl = sessionToken;
    const projectIdUrl = selectedChatProject.projectId;
    console.log("projectIdUrl:", projectIdUrl);
    const newWsUrl = `ws://${
      useDomainStore.getState().domain
    }/groupChat/${sessionTokenUrl}/${projectIdUrl}`;

    return `${newWsUrl}`;
  }, [selectedChatProject]);

  const onMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const { sendGroupMessageWS } = useGroupMessageWebSocket(
    wsUrl,
    isGroupChatModalOpen && wsUrl,
    onMessage
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newMessage = {
        senderId: parseInt(localStorage.getItem("userId")),
        groupId: parseInt(selectedChatProject.projectId),
        content: inputText,
      };
      sendMessage(newMessage);
    }
  };

  const sendMessage = async (message) => {
    const dataToSend = {
      type: "NEW_GROUP_MESSAGE",
      data: message,
    };
    sendGroupMessageWS(dataToSend);
  };

  // Function to handle sending message when Enter key is pressed
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const updateMessages = useCallback((messages) => {
    console.log("Messages to mark as read on updateMethod:", messages);
    setMessages((prevMessages) => {
      const newMessages = prevMessages.map((msg) => {
        const found = messages.find((updateMsg) => updateMsg.id === msg.id);
        if (found) {
          return { ...msg, viewed: true };
        }
        return msg;
      });
      return newMessages;
    });
  }, []);

  const handleCloseGroupChatModal = () => {
    setGroupChatModalOpen(false);
    setSelectedChatProject(null);
    setInputText("");
  };

  // Close modal on location change
  useEffect(() => {
    handleCloseGroupChatModal();
  }, [location.pathname]);

  if (!isGroupChatModalOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={handleCloseGroupChatModal}
        >
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
