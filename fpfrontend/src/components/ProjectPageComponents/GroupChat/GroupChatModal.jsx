import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { MessageBox } from "react-chat-elements";
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
  const currentUser = useMemo(() => {
    return {
      id: parseInt(localStorage.getItem("userId")),
      username: localStorage.getItem("username"),
    };
  }, []);

  const handleCloseGroupChatModal = () => {
    setGroupChatModalOpen(false);
    setSelectedChatProject(null);
    setInputText("");
  };

  const onMessage = useCallback(
    (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      if (
        currentUser &&
        message.sender.id === currentUser.id &&
        !message.isViewed
      ) {
        const messageData = {
          type: "MARK_AS_READ",
          data: Array.isArray(message.messageId)
            ? message.messageId
            : [message.messageId],
        };
        sendGroupMessageWS(messageData);
      }
    },
    [currentUser]
  );

  const wsUrl = useMemo(() => {
    if (!selectedChatProject) return null;

    const sessionToken = Cookies.get("sessionToken");
    const projectIdUrl = selectedChatProject.projectId;
    const newWsUrl = `ws://${
      useDomainStore.getState().domain
    }/groupChat/${sessionToken}/${projectIdUrl}`;

    return `${newWsUrl}`;
  }, [selectedChatProject]);

  const updateMessages = useCallback((messages) => {
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
  

  const { sendGroupMessageWS } = useGroupMessageWebSocket(
    wsUrl,
    isGroupChatModalOpen && wsUrl,
    onMessage,
    handleCloseGroupChatModal,
    updateMessages
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
          const messagesToMarkAsRead = data
          .filter((msg) => msg.sender.id !== currentUser.id && !msg.viewed)
          .map((msg) => msg.messageId);
        if (messagesToMarkAsRead.length > 0) {
          const messageData = {
            type: "MARK_AS_READ",
            data: messagesToMarkAsRead,
          };
          sendGroupMessageWS(messageData);
        }
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
  }, [isGroupChatModalOpen, selectedChatProject, navigate]);


  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newMessage = {
        senderId: currentUser.id,
        groupId: selectedChatProject.projectId,
        content: inputText,
      };
      sendMessage(newMessage);
      setInputText("");
    }
  };

  const sendMessage = async (message) => {
    const dataToSend = {
      type: "NEW_GROUP_MESSAGE",
      data: message,
    };
    sendGroupMessageWS(dataToSend);
  };

  //Close modal on location change
  useEffect(() => {
    handleCloseGroupChatModal();
  }, []);

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
            const isSentByCurrentUser = msg.sender.id === currentUser.id;
            const displayName = isSentByCurrentUser ? "" : msg.sender.username;
            const displayAvatar = isSentByCurrentUser ? "" : msg.sender.photo;
            return (
              <MessageBox
                key={index}
                avatar={displayAvatar}
                position={isSentByCurrentUser ? "right" : "left"}
                type={"text"}
                text={msg.content}
                date={new Date(msg.sentTime)}
                status={msg.viewed ? "read" : "sent"}
                title={displayName}
                onTitleClick={() =>
                  navigate(`/userProfile/${msg.sender.username}`)
                }
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className={styles.inputArea}>
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
          <button type="submit" className={styles.button}>
          <FormattedMessage id="sendMsgBtn" defaultMessage="Send" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChatModal;
