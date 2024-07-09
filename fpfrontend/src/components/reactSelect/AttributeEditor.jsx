import React, { useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import styles from "./AttributeEditor.module.css";
import generalService from "../../services/generalService";
import ListItem from "./listItems/ListItem";
import useSelectTypeModal from "../../stores/useSelectTypeModal";
import SelectTypeModal from "../modals/SelectTypeModal.jsx";
import useSelectQuantityModalStore from "../../stores/useSelectQuantityModalStore.jsx";
import SelectQuantityModal from "../modals/SelectQuantityModal.jsx";
import userService from "../../services/userService";
import projectService from "../../services/projectService.jsx";
import useConfigurationStore from "../../stores/useConfigurationStore";
import useDialogModalStore from "../../stores/useDialogModalStore.jsx";
import membershipService from "../../services/membershipService";
import { FaPlus } from "react-icons/fa";
import useDeviceStore from "../../stores/useDeviceStore";
import Spinner from "../spinner/Spinner.jsx";

const AttributeEditor = ({
  title,
  editMode,
  creationMode,
  mainEntity,
  onAttributesChange,
  username,
  projectId,
  createdBy,
  taskResponsibleId,
  registeredExecutors,
  setTaskData,
  taskData,
}) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const { configurations } = useConfigurationStore();
  const selectTypeModal = useSelectTypeModal();
  const usedQuantity = useSelectQuantityModalStore();
  const { setDialogMessage, setIsDialogOpen, setAlertType, setOnConfirm } =
    useDialogModalStore();
  const navigate = useNavigate();
  const { dimensions } = useDeviceStore();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize attributes based on creation mode and initial values
  useEffect(() => {
    if (!creationMode) {
      if (taskResponsibleId) {
        console.log("taskResponsibleId");
        setAttributes([taskResponsibleId]);
      } else if (registeredExecutors) {
        setAttributes(registeredExecutors);
      } else {
        fetchAttributes();
      }
    }
  }, [taskResponsibleId]);

  // Notify changes in attributes
  useEffect(() => {
    if (onAttributesChange) {
      onAttributesChange(attributes);
    }
  }, [attributes]);

  const [isProjectMemberNotCreator, setIsProjectMemberNotCreator] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (createdBy) {
    // Check if the user is a member of the project
    const isMember = attributes.some(attribute => attribute.user?.id == userId);
    // Check if the user is not the creator
    const isNotCreator = userId != createdBy.id;    
    setIsProjectMemberNotCreator(isMember && isNotCreator);
  }
}, [attributes, createdBy]);

  // Determine fetch function based on the main entity
  const getFetchFunction = (title) => {
    switch (mainEntity) {
      case "user":
        return generalService.fetchUserAttributes(title, username);
      case "project":
        return generalService.fetchProjectAttributes(title, projectId);
    }
  };

  // Fetch attributes from API
  const fetchAttributes = async () => {
    try {
      const response = await getFetchFunction(title);
      if (response.status === 200) {
        const data = await response.json();
        setAttributes(data);
      } else {
        throw new Error("Failed to fetch attributes");
      }
    } catch (error) {
      console.error("Error fetching attributes:", error.message);
    }
  };

  // Fetch suggestions from API based on the first letter
  const fetchSuggestions = async (firstLetter) => {
    if (
      (creationMode && title === "users" && mainEntity === "task") ||
      title === "Responsible user" ||
      title === "Registered executers"
    ) {
      try {
        const response = await membershipService.fetchSuggestionsByProjectId(
          firstLetter,
          projectId
        );
        if (response.status === 200) {
          const data = await response.json();
          setFetchedSuggestions(data);
          setSuggestions(data);
        } else {
          throw new Error("Failed to fetch suggestions");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error.message);
      }
    } else {
      try {
        const response = await generalService.fetchSuggestions(
          title,
          firstLetter
        );
        if (response.status === 200) {
          const data = await response.json();
          setFetchedSuggestions(data); // Store fetched suggestions
          setSuggestions(data); // Initially, set suggestions to fetched data
        } else {
          throw new Error("Failed to fetch suggestions");
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error.message);
      }
    }
  };
  // Get item property based on the title
  const getItemProperty = (item) => {
    switch (title) {
      case "users":
        return item.username;
      default:
        return item.name;
    }
  };
  // Filter suggestions based on user query
  const filterSuggestions = (query) => {
    const filtered = fetchedSuggestions.filter((item) =>
      getItemProperty(item)?.toLowerCase()?.startsWith(query.toLowerCase())
    );
    setSuggestions(filtered);
  };

  // Handle input change in the search field
  const handleInputChange = (newValue, { action }) => {
    if (action === "input-change") {
      setInput(newValue);

      if (newValue.length === 1) {
        fetchSuggestions(newValue); // Fetch from database on first letter input
      } else if (newValue.length > 1) {
        filterSuggestions(newValue); // Filter from fetched suggestions
      } else {
        setSuggestions([]);
      }
    }
  };

  // Handle change in the selected item
  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setInput(selectedOption.value); // Set input value to selected option value
      setSelectedValue(selectedOption); // Update selected value
    } else {
      setInput(""); // Clear input value if no option selected
      setSelectedValue(null); // Reset selected value
    }
  };
  // Update user role in a project
  const handleChangeUserProjectRole = async (userId, role) => {
    try {
      const response = await projectService.updateProjecUserRole(
        projectId,
        userId,
        role
      );
      if (response.status === 204) {
        fetchAttributes();
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error.message);
    }
  };

  // Add a new item to the list
  const addItem = async () => {
    let existingAttribute;
    let existingUser;
    // Check if the input already exists in the fetched suggestions
    if (title !== "users") {
      existingAttribute = fetchedSuggestions.some(
        (suggestion) => suggestion?.name?.toLowerCase() === input.toLowerCase()
      );
    } else {
      existingUser = fetchedSuggestions.some(
        (suggestion) =>
          suggestion?.username?.toLowerCase() === input.toLowerCase()
      );
    }
    // Ensure the user exists in suggestions
    if (title === "users" && !existingUser) {
      setDialogMessage(
        <FormattedMessage
          id="notInSuggestions"
          defaultMessage="Not found in suggestions. Not adding."
        />
      );
      setAlertType(true);
      setIsDialogOpen(true);
      setOnConfirm(() => {
        setIsDialogOpen(false);
      });
      return;
    }
    // Ensure only one user can be responsible for a task
    if (
      (title === "users" &&
        creationMode &&
        mainEntity === "task" &&
        attributes.length === 1) ||
      (title === "Responsible user" && attributes.length === 1)
    ) {
      setDialogMessage(
        <FormattedMessage
          id="onlyOneResponsible"
          defaultMessage="Only one user can be assigned to a task as responsible. Not adding."
        />
      );
      setAlertType(true);
      setIsDialogOpen(true);
      setOnConfirm(() => {
        setIsDialogOpen(false);
      });
      return;
    }
    try {
      // Ensure the input is not empty and does not exceed character limit
      if (!input) return;
      if (input.length > 25) {
        setDialogMessage(
          <FormattedMessage
            id="maxInputLenght"
            defaultMessage="Input exceeds maximum character limit. Not adding."
          />
        );
        setAlertType(true);
        setIsDialogOpen(true);
        setOnConfirm(() => {
          setIsDialogOpen(false);
        });

        return;
      }
      // Ensure no duplicate attributes/users
      console.log("attributes", attributes);
      if (title !== "users") {
        if (
          attributes.some(
            (attribute) => attribute.name?.toLowerCase() === input.toLowerCase()
          )
        ) {
          setDialogMessage(
            <FormattedMessage
              id="duplicateAttribute"
              defaultMessage="Duplicate attribute. Not adding."
            />
          );
          setAlertType(true);
          setIsDialogOpen(true);
          setOnConfirm(() => {
            setIsDialogOpen(false);
          });
          return;
        }
      } else {
        if (
          attributes.some(
            (attribute) =>
              attribute.user.username?.toLowerCase() === input.toLowerCase()
          )
        ) {
          setDialogMessage(
            <FormattedMessage
              id="duplicateAttribute"
              defaultMessage="Duplicate attribute. Not adding."
            />
          );
          setAlertType(true);
          setIsDialogOpen(true);
          setOnConfirm(() => {
            setIsDialogOpen(false);
          });
          return;
        }
      }
      //Ensure not adding more users than the maximum allowed
      if (title === "users" && mainEntity === "project") {
        let maxProjectMembersConfig = configurations.get("maxProjectMembers");
        console.log("maxProjectMembersConfig", maxProjectMembersConfig);
        if (creationMode) maxProjectMembersConfig = maxProjectMembersConfig - 1;
        if (attributes.length >= maxProjectMembersConfig) {
          setDialogMessage(
            <FormattedMessage
              id="maxProjectMembers"
              defaultMessage="Maximum number of project members reached. Not adding."
            />
          );
          setAlertType(true);
          setIsDialogOpen(true);
          setOnConfirm(() => {
            setIsDialogOpen(false);
          });
          return;
        }
      }

      //Ensure in case of a new project the user can't add himself to the project
      if (
        title === "users" &&
        mainEntity === "project" &&
        localStorage.getItem("username") === input
      ) {
        setDialogMessage(
          <FormattedMessage
            id="cantAddYourself"
            defaultMessage="Choose another user to add to the project. You will be automatically added."
          />
        );
        setAlertType(true);
        setIsDialogOpen(true);
        setOnConfirm(() => {
          setIsDialogOpen(false);
        });
        return;
      }

      let selectedOption = null;
      // Prompt user to select type for skills or interests
      if (!existingAttribute && (title === "skills" || title === "interests")) {
        const options =
          title === "skills"
            ? ["KNOWLEDGE", "SOFTWARE", "HARDWARE", "TOOLS"]
            : ["TOPICS", "CAUSES", "KNOWLEDGE_AREAS"];
        selectTypeModal.setOptions(options);
        selectTypeModal.setShowModal(true);
        selectedOption = await selectTypeModal.waitForSelection();
      }

      let data = { name: input, type: selectedOption };
      if (title === "keywords") {
        delete data.type;
      }

      let selectedQuantity = null;
      if (title === "assets") {
        const suggestion = fetchedSuggestions.find(
          (suggestion) =>
            suggestion?.name?.toLowerCase() === input?.toLowerCase()
        );
        if (suggestion) {
          usedQuantity.setShowModal(true);
          selectedQuantity = await usedQuantity.waitForQuantity();
          data = { ...data, usedQuantity: selectedQuantity }; // Update `data` with selected quantity
          delete data.type;
        }
      }

      // Add item to the server or state
      if (!creationMode) {
        let response;
        let suggestion;
        if (title === "users" && mainEntity === "project") {
          setIsLoading(true);
          response = await userService.addUserToProject(projectId, input);
        } else if (title === "Responsible user") {
          suggestion = fetchedSuggestions.find(
            (suggestion) =>
              suggestion?.username?.toLowerCase() === input?.toLowerCase()
          );
          setAttributes([
            ...attributes,
            { id: suggestion?.id, username: input, photo: suggestion?.photo },
          ]);
          setTaskData({
            ...taskData,
            responsibleId: {
              id: suggestion?.id,
              username: input,
              photo: suggestion?.photo,
            },
          });
        } else if (title === "Registered executers") {
          if (attributes.find((attribute) => attribute.username === input)) {
            setDialogMessage(
              <FormattedMessage
                id="duplicateAttribute"
                defaultMessage="Duplicate attribute. Not adding."
              />
            );
            setAlertType(true);
            setIsDialogOpen(true);
            setOnConfirm(() => {
              setIsDialogOpen(false);
            });
            return;
          }
          suggestion = fetchedSuggestions.find(
            (suggestion) =>
              suggestion?.username?.toLowerCase() === input?.toLowerCase()
          );
          setAttributes([
            ...attributes,
            { id: suggestion?.id, username: input, photo: suggestion?.photo },
          ]);
          setTaskData({
            ...taskData,
            registeredExecutors: [
              ...registeredExecutors,
              { id: suggestion?.id, username: input, photo: suggestion?.photo },
            ],
          });
        } else if (title === "assets") {
          suggestion = fetchedSuggestions.find(
            (suggestion) =>
              suggestion?.name?.toLowerCase() === input?.toLowerCase()
          );
          if (!suggestion) {
            setDialogMessage(
              <FormattedMessage
                id="notInSuggestions"
                defaultMessage="Not found in suggestions. Not adding."
              />
            );
            setAlertType(true);
            setIsDialogOpen(true);
            setOnConfirm(() => {
              setIsDialogOpen(false);
            });
            return;
          }
          setAttributes([
            ...attributes,
            { id: suggestion?.id, name: input, usedQuantity: selectedQuantity },
          ]);
          response = await generalService.addItem(
            title,
            data,
            mainEntity,
            projectId
          );
        } else {
          response = await generalService.addItem(
            title,
            data,
            mainEntity,
            projectId
          );
        }
        if (response.status === 204) {
          fetchAttributes();
          setIsLoading(false);
        } else {
          setIsLoading(false);
          throw new Error( "Failed to add item");
        }
      } else {
        let suggestion;
        if (title === "users") {
          suggestion = fetchedSuggestions.find(
            (suggestion) =>
              suggestion?.username?.toLowerCase() === input?.toLowerCase()
          );
          setAttributes([
            ...attributes,
            {
              user: {
                id: suggestion?.id,
                username: input,
                photo: suggestion?.photo,
                role: suggestion?.role,
                accepted: suggestion?.isAccepted,
              },
            },
          ]);
        } else if (title === "assets") {
          suggestion = fetchedSuggestions.find(
            (suggestion) =>
              suggestion?.name?.toLowerCase() === input?.toLowerCase()
          );
          if (!suggestion) {
            setDialogMessage(
              <FormattedMessage
                id="notInSuggestions"
                defaultMessage="Not found in suggestions. Not adding."
              />
            );
            setAlertType(true);
            setIsDialogOpen(true);
            setOnConfirm(() => {
              setIsDialogOpen(false);
            });
            return;
          }
          setAttributes([
            ...attributes,
            { id: suggestion?.id, name: input, usedQuantity: selectedQuantity },
          ]);
        } else {
          suggestion = fetchedSuggestions.find(
            (suggestion) =>
              suggestion?.name?.toLowerCase() === input?.toLowerCase()
          );
          setAttributes([
            ...attributes,
            {
              id: suggestion?.id,
              name: input,
              type: suggestion?.type ?? selectedOption,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error adding item:", error.message);
    } finally {
      clearInput();
    }
  };

  // Request to join a project
  const askToJoinProject = async () => {
    try {
      const response = await projectService.askToJoinProject(projectId);
      if (response.status === 204) {
        setAttributes([
          ...attributes,
          {
            user: {
              id: localStorage.getItem("userId"),
              username: localStorage.getItem("username"),
              photo: localStorage.getItem("photo"),
              role: "NORMAL_USER",
              accepted: false,
            },
          },
        ]);
      } else {
        throw new Error("Failed to ask to join project");
      }
    } catch (error) {
      console.error("Error asking to join project:", error.message);
    }
  };

  // Request to remove from project
  const removeFromProject = async () => {
    try {
      // Retrieve username and projectId from localStorage
      const username = localStorage.getItem("username");
      const response = await projectService.removeFromProject(
        username,
        projectId
      );
      if (response.status === 204) {
        // Update the attributes by filtering out the removed user
        setAttributes(
          attributes.filter((attribute) => attribute.user.username !== username)
        );
        navigate(`/authenticatedHomepage`);
      } else {
        throw new Error("Failed to remove from project");
      }
    } catch (error) {
      console.error("Error removing from project:", error.message);
    }
  };

  // Clear input field and reset suggestions
  const clearInput = () => {
    setInput("");
    setSelectedValue(null);
    setSuggestions([]);
  };
  // Remove an item from the list
  const removeItem = async (attributeToRemove) => {
    try {
      if (!creationMode) {
        let response;
        if (title === "users" && mainEntity === "project") {
          response = await userService.removeUserFromProject(
            projectId,
            attributeToRemove.user.username
          );
        } else if (title === "Responsible user" && !creationMode) {
          setAttributes([]);
          setTaskData({ ...taskData, responsibleId: null });
        } else if (title === "Registered executers" && !creationMode) {
          setAttributes(
            attributes.filter(
              (attribute) => attribute.username !== attributeToRemove.username
            )
          );
          setTaskData({
            ...taskData,
            registeredExecutors: registeredExecutors.filter(
              (attribute) => attribute.username !== attributeToRemove.username
            ),
          });
        } else {
          response = await generalService.removeItem(
            title,
            attributeToRemove.id,
            mainEntity,
            projectId
          );
        }
        if (response.status === 204) {
          fetchAttributes();
        } else {
          const data = await response.json();
          setDialogMessage(data.message);
          setAlertType(true);
          setIsDialogOpen(true);
          setOnConfirm(() => {
            setIsDialogOpen(false);
          });
          throw new Error("Failed to remove item: " + data.message);
        }
      }
      if (title === "users" && mainEntity === "project") {
        setAttributes(
          attributes.filter(
            (attribute) =>
              attribute.user.username !== attributeToRemove.user.username
          )
        );
      } else {
        setAttributes(
          attributes.filter(
            (attribute) => attribute.name !== attributeToRemove.name
          )
        );
      }
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  // Get label and value for a suggestion item
  const getLabelValue = (suggestion) => {
    switch (title) {
      case "users":
        return { label: suggestion.username, value: suggestion.username };
      case "Responsible user":
        return { label: suggestion.username, value: suggestion.username };
      case "Registered executers":
        return { label: suggestion.username, value: suggestion.username };
      default:
        return {
          label: suggestion.name + " - " + suggestion.type,
          value: suggestion.name,
        };
    }
  };

  // Capitalize the title for display
  const elementTitle =
    title.charAt(0).toUpperCase() + title?.slice(1)?.toLowerCase();
  // Determine if it's possible to join the project
  const maxProjectMembersConfig = configurations.get("maxProjectMembers");
  const isPossibleToJoin =
    (maxProjectMembersConfig
      ? attributes.length < maxProjectMembersConfig
      : true) &&
    !attributes.some(
      (attribute) =>
        attribute.user?.username === localStorage.getItem("username")
    );

    if((attributes.length === 0 || !attributes) && !editMode) return null;
  return (
    <div className={styles.container}>
      {isLoading && <Spinner />}
      {creationMode && title === "users" && mainEntity === "task" ? (
        <h2>
          <FormattedMessage id="responsible" defaultMessage="Responsible" />
        </h2>
      ) : (
        <h2>{elementTitle}</h2>
      )}
      {title === "users" && !creationMode && (
        <>
              {isPossibleToJoin ? (
            <button onClick={askToJoinProject}>
              {" "}
              <FormattedMessage id="askToJoin" defaultMessage="Ask To Join" />
            </button>
          ) : null}
          {isProjectMemberNotCreator && (
            <button onClick={removeFromProject}>
              <FormattedMessage
                id="removeFromProject"
                defaultMessage="Remove From Project"
              />
            </button>
          )}
        </>
      )}

      <div className={styles.innerContainer}>
        <div className={styles.existingAttributes}>
          <div className={styles.userAttributeContainer}>
            <ul className={styles.attributeList}>
              {attributes.map((attribute) => (
                <li className={styles.attribute} key={attribute.id}>
                  <ListItem
                    removeItem={removeItem}
                    title={title}
                    attribute={attribute}
                    creationMode={creationMode}
                    handleChangeUserProjectRole={handleChangeUserProjectRole}
                    editMode={editMode}
                    createdBy={createdBy}
                  />
                </li>
              ))}
            </ul>
          </div>
          {editMode && (
            <div className={styles.addAttribute}>
              <div className={styles.selectAddContainer}>
                <Select
                  className={styles.select}
                  classNamePrefix="react-select"
                  value={selectedValue}
                  onInputChange={handleInputChange}
                  onChange={handleSelectChange}
                  options={suggestions.map(getLabelValue)}
                  inputValue={input}
                  noOptionsMessage={() => (
                    <FormattedMessage
                      id="noSuggestionsFound"
                      defaultMessage="No suggestions found"
                    />
                  )}
                  placeholder={intl.formatMessage({ id: "addNewPlaceholder" })}
                  isClearable
                  styles={{
                    control: (base) => ({
                      ...base,
                      width: "100%",
                      border: "none",
                      background: "var(--input-select-textarea-background)",
                    }),
                    input: (base) => ({
                      ...base,
                      width: "100%",
                    }),
                  }}
                />
                <div onClick={addItem} className={styles.addBtn}>
                  <FaPlus />
                  {dimensions.width > 600 && (
                    <FormattedMessage id="add" defaultMessage="Add" />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <SelectTypeModal />
        <SelectQuantityModal />
      </div>
    </div>
  );
};

export default AttributeEditor;
