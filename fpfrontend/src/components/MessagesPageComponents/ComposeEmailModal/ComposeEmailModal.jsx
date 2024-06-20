import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { MessageBox } from "react-chat-elements";
import Select from "react-select";
import "react-chat-elements/dist/main.css";
import styles from "./ComposeEmailModal.module.css";
import generalService from "../../../services/generalService";
import individualMessageService from "../../../services/individualMessageService";
import { set } from "date-fns";
import useDomainStore from "../../../stores/useDomainStore";
import Cookies from "js-cookie";
import { useIndividualMessageWebSocket } from "../../../websockets/useIndividualMessageWebSocket";

const ComposeEmailModal = ({
  onClose,
  initialSelectedUser,
  isChatModalOpen,
  setInitialSelectedUser,
}) => {
  const [messagesModal, setMessagesModal] = useState([]);
  const [data, setData] = useState({
    inputText: "",
    subject: "",
    currentUser: null,
  });
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const onMessage = useCallback(
    (message) => {
      setMessagesModal((prevMessages) => [...prevMessages, message]);
      if (
        data.currentUser &&
        message.sender.id === data.currentUser.id &&
        !message.viewed
      ) {
        const messageData = {
          type: "MARK_AS_READ",
          data: Array.isArray(message.id) ? message.id : [message.id],
        };
        sendWsMessage(messageData);
      }
    },
    [data.currentUser]
  );

  const updateMessages = useCallback((messages) => {
    console.log("Messages to mark as read on updateMethod:", messages);
    setMessagesModal((prevMessages) => {
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

  const wsUrl = useMemo(() => {
    if (data.currentUser === null) return null;
    const sessionToken = Cookies.get("sessionToken");
    const sessionTokenUrl = sessionToken;
    const receiverIdUrl = data.currentUser.id;
    const newWsUrl = `ws://${
      useDomainStore.getState().domain
    }/emailChat/${sessionTokenUrl}/${receiverIdUrl}`;

    return `${newWsUrl}`;
  }, [data.currentUser]);

  const { sendWsMessage } = useIndividualMessageWebSocket(
    wsUrl,
    isChatModalOpen && wsUrl,
    onMessage,
    onClose,
    updateMessages
  );

  const fetchSuggestedUsers = async (firstLetter) => {
    try {
      const response = await generalService.fetchSuggestions(
        "users",
        firstLetter
      );
      const data = await response.json();
      setSuggestedUsers(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    }
  };

  const fetchMessagesModal = async (otherUserId) => {
    const userId = localStorage.getItem("userId");
    try {
      const response =
        await individualMessageService.fetchMessagesBetweenTwoUsers(
          userId,
          otherUserId
        );
      const data = await response.json();
      const messagesToMarkAsRead = data
        .filter((msg) => msg.sender.id === otherUserId && !msg.viewed)
        .map((msg) => msg.id);
      if (messagesToMarkAsRead.length > 0) {
        const messageData = {
          type: "MARK_AS_READ",
          data: messagesToMarkAsRead,
        };
        sendWsMessage(messageData);
      }
      setMessagesModal(data);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);

    if (newValue.length === 1) {
      fetchSuggestedUsers(newValue);
    } else {
      const filteredUsers = suggestedUsers.filter((user) =>
        user.username.toLowerCase().startsWith(newValue.toLowerCase())
      );
      setSuggestedUsers(filteredUsers);
    }
  };

  useEffect(() => {
    if (data.currentUser) {
      fetchMessagesModal(data.currentUser.id);

      setInitialSelectedUser(null);
    }
    if (initialSelectedUser) {
      setData((prevData) => ({
        ...prevData,
        currentUser: initialSelectedUser,
      }));
    }
  }, [data.currentUser, initialSelectedUser, setInitialSelectedUser]);

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      const selectedUser = suggestedUsers.find(
        (user) => user.id === selectedOption.value
      );
      setData({ ...data, currentUser: selectedUser });
    } else {
      setData({ ...data, currentUser: null });
    }
  };

  const sendMessage = async (message) => {
    
    const dataToSend = {
      type: "NEW_INDIVIDUAL_MESSAGE",
      data: message,
    };

    sendWsMessage(dataToSend);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (data.inputText.trim() && data.subject.trim() && data.currentUser) {
      const newMessage = {
        senderId: localStorage.getItem("userId"),
        recipientId: data.currentUser.id,
        content: data.inputText,
        subject: data.subject,
      };
      sendMessage(newMessage);
      setData({ ...data, inputText: "", subject: "" });
    }
  };
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };
  useEffect(() => {
    scrollToBottom();
  }, [messagesModal]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>
          {data.currentUser
            ? `Message to ${data.currentUser.username}`
            : "Select a user"}
        </h2>
        <Select
          className="react-select-container"
          classNamePrefix="react-select"
          value={
            data.currentUser
              ? { label: data.currentUser.username, value: data.currentUser.id }
              : null
          }
          onInputChange={handleInputChange}
          onChange={handleSelectChange}
          options={suggestedUsers.map((user) => ({
            label: user.username,
            value: user.id,
          }))}
          inputValue={inputValue}
          noOptionsMessage={() => "No suggestions found"}
          placeholder="Type to search users"
          isClearable
        />
        <div className={styles.messagesContainer}>
          {data.currentUser && (
            <>
              {messagesModal.map((msg, index) => {
                const userId = localStorage.getItem("userId");
                const isSentByCurrentUser =
                  msg.sender && String(msg.sender.id) === String(userId);
                const displayName = isSentByCurrentUser
                  ? "You"
                  : msg.sender
                  ? msg.sender.username
                  : "Unknown";
                const avatar = msg?.sender ? msg.sender.photo : null;
                const text = `${msg.subject ? `${msg.subject}: ` : ""}${
                  msg.content
                }`;

                return (
                  <MessageBox
                    key={index}
                    avatar={avatar}
                    position={isSentByCurrentUser ? "right" : "left"}
                    type="text"
                    date={new Date(msg.sentAt)}
                    title={displayName}
                    text={text}
                    status={msg.viewed ? "read" : "sent"}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        {data.currentUser && (
          <form onSubmit={handleSendMessage} className={styles.inputArea}>
            <input
              type="text"
              placeholder="Type a subject..."
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
              className={styles.input}
            />
            <textarea
              placeholder="Type a message..."
              value={data.inputText}
              onChange={(e) => setData({ ...data, inputText: e.target.value })}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ComposeEmailModal;
