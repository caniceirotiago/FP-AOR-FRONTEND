import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { MessageBox } from "react-chat-elements";
import Select from "react-select";
import Cookies from "js-cookie";
import { FormattedMessage, useIntl } from "react-intl";
import "react-chat-elements/dist/main.css";
import styles from "./ComposeEmailModal.module.css";
import generalService from "../../../services/generalService";
import individualMessageService from "../../../services/individualMessageService";
import useDomainStore from "../../../stores/useDomainStore";
import useDialogModalStore from "../../../stores/useDialogModalStore.jsx";
import { useIndividualMessageWebSocket } from "../../../websockets/useIndividualMessageWebSocket";
import { useNavigate } from "react-router-dom";

const ComposeEmailModal = ({ onClose, initialSelectedUser, initialSelectedMessage,setInitialSelectedMessage, isChatModalOpen, setInitialSelectedUser }) => {
  const  navigate  = useNavigate();
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } = useDialogModalStore();
  const [messagesModal, setMessagesModal] = useState([]);
  const [data, setData] = useState({
    inputText: "",
    subject: "",
    currentUser: null,
  });
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const selectedMessageRef = useRef(null);
  const intl = useIntl();

  const onMessage = useCallback(
    (message) => {
      setInitialSelectedMessage(message);
      setMessagesModal((prevMessages) => [...prevMessages, message]);
      if (data.currentUser && message.sender.id === data.currentUser.id && !message.viewed) {
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
    const newWsUrl = `${
      useDomainStore.getState().wssDomain
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
      const response = await generalService.fetchComposeEmailSuggestions(
        "users",
        firstLetter
      );
      const data = await response.json();
      setSuggestedUsers(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    }
  };

  const handleInputChange = (newValue) => {
    setInputValue(newValue);

    if (newValue.length === 1) {
      fetchSuggestedUsers(newValue);
    } else if (newValue.length > 1) {
      const filteredUsers = suggestedUsers.filter(
        (user) =>
          user.username.toLowerCase().startsWith(newValue.toLowerCase()) ||
          user.firstName?.toLowerCase().startsWith(newValue.toLowerCase())
      );
      setSuggestedUsers(filteredUsers);
    } else {
      setSuggestedUsers([]);
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

  useEffect(() => {
    if (initialSelectedMessage && messagesModal.length > 0) {
      const messageElement = document.getElementById(`message-${initialSelectedMessage.id}`);
      if (messageElement) {
        console.log(`Scrolling to message: ${initialSelectedMessage.id}`);
        messageElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.log(`Message element not found for id: message-${initialSelectedMessage.id}`);
      }
    } else if (messagesModal.length > 0) {
      console.log('Scrolling to bottom without animation');
      messagesEndRef.current?.scrollIntoView();
    }
  }, [messagesModal, initialSelectedMessage]);

  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setInitialSelectedMessage(null);
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
    if (!(data.inputText.trim() && data.subject.trim() && data.currentUser)) {
      setDialogMessage(
        <FormattedMessage
          id="emptyFieldsError"
          defaultMessage="Please fill in all fields (subject and message) before sending."
        />
      );
      setAlertType(true);
      setIsDialogOpen(true);
      setOnConfirm(() => {
        setIsDialogOpen(false);
      });
      return;
    }
    const newMessage = {
      senderId: localStorage.getItem("userId"),
      recipientId: data.currentUser.id,
      content: data.inputText,
      subject: data.subject,
    };
    sendMessage(newMessage);
    setData({ ...data, inputText: "", subject: "" });
  };

  const handleRedirectToUserProfile = (username) => {
    onClose();
    setInitialSelectedMessage(null);
    setInitialSelectedUser(data.currentUser);
    navigate(`/userProfile/${username}`);
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>
          {data.currentUser ? (
            <FormattedMessage
              id="messageTo"
              defaultMessage={`Message to ${data.currentUser.username}`}
              values={{ username: data.currentUser.username }}
            />
          ) : (
            <FormattedMessage id="selectUser" defaultMessage="Select a user" />
          )}
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
            label: intl.formatMessage(
              { id: "userLabel" },
              { username: user.username, firstName: user.firstName }
            ),
            value: user.id,
          }))}
          inputValue={inputValue}
          noOptionsMessage={() =>
            intl.formatMessage({
              id: "noSuggestionsFound",
              defaultMessage: "No suggestions found",
            })
          }
          placeholder={intl.formatMessage({
            id: "typeToSearch",
            defaultMessage: "Type to search users",
          })}
          isClearable={true}
        />
        <div className={styles.messagesContainer}>
          {data.currentUser && (
            <>
              {messagesModal.map((msg, index) => {
                const userId = localStorage.getItem("userId");
                const isSentByCurrentUser =
                  msg.sender && String(msg.sender.id) === String(userId);
                const displayName = isSentByCurrentUser
                  ? " "
                  : msg.sender
                  ? msg.sender.username
                  : "Unknown";
                const avatar = msg?.sender ? msg.sender.photo : null;
                const text = `${msg.subject ? `${msg.subject}: ` : ""}${msg.content}`;

                const messageRef = msg.id === initialSelectedMessage?.id ? selectedMessageRef : null;

                return (
                  <div key={index} id={`message-${msg.id}`} ref={messageRef}>
                    <MessageBox
                      avatar={avatar}
                      position={isSentByCurrentUser ? "right" : "left"}
                      type="text"
                      date={new Date(msg.sentAt)}
                      title={displayName}
                      text={text}
                      status={msg.viewed ? "read" : "sent"}
                      onAvatarClick={() => handleRedirectToUserProfile(msg.sender.username)}
                      onTitleClick={() => handleRedirectToUserProfile(msg.sender.username)}
                    />
                  </div>
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
              placeholder={intl.formatMessage({
                id: "typeSubject",
                defaultMessage: "Type a subject",
              })}
              value={data.subject}
              onChange={(e) => setData({ ...data, subject: e.target.value })}
              className={styles.input}
            />
            <textarea
              placeholder={intl.formatMessage({
                id: "typeMessage",
                defaultMessage: "Type a message",
              })}
              value={data.inputText}
              onChange={(e) => setData({ ...data, inputText: e.target.value })}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              <FormattedMessage id="sendMsgBtn" defaultMessage="Send" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ComposeEmailModal;
