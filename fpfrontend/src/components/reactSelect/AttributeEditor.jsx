import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./AttributeEditor.module.css";
import generalService from "../../services/generalService";
import ListItem from "./listItems/ListItem";
import { useSelect } from "downshift";
import useSelectTypeModal from "../../stores/useSelectTypeModal";
import SelectTypeModal from "../modals/SelectTypeModal.jsx";
import userService from "../../services/userService";
import projectService from "../../services/projectService.jsx";


const AttributeEditor = ({ title, editMode, creationMode, mainEntity, onAttributesChange, username, projectId }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const selectTypeModal = useSelectTypeModal();

  
  useEffect(() => {
    if(!creationMode){
      fetchAttributes();
    }
  }, []);

  useEffect(() => {
    if (onAttributesChange) {
      onAttributesChange(attributes);
    }
  }, [attributes]);

  const getFetchFunction = (title) => {
    switch (mainEntity) {
      case 'user':
        return generalService.fetchUserAttributes(title, username);
      case 'project':
        return generalService.fetchProjectAttributes(title, projectId);
    }
  };

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



  const fetchSuggestions = async (firstLetter) => {
    try {
      const response = await generalService.fetchSuggestions(title, firstLetter);
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
  };

  const getItemProperty = (item) => {
    switch (title) {
      case 'users':
        return item.username;
      default:
        return item.name;
    }
  };

  const filterSuggestions = (query) => {
    const filtered = fetchedSuggestions.filter((item) =>
      getItemProperty(item).toLowerCase().startsWith(query.toLowerCase())
    );
    setSuggestions(filtered);
  };


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

  
  const handleSelectChange = (selectedOption) => {
    if (selectedOption) {
      setInput(selectedOption.value); // Set input value to selected option value
      setSelectedValue(selectedOption); // Update selected value
    } else {
      setInput(""); // Clear input value if no option selected
      setSelectedValue(null); // Reset selected value
    }
  };

  const handleChangeUserProjectRole = async (userId, role) => {
    try {
      const response = await projectService.updateProjecUserRole(projectId, userId, role);
      if (response.status === 204) {
        fetchAttributes();
      } else {
        throw new Error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error.message);
    }
  };


  const addItem = async () => {
    let existingAttribute 
    let existingUser

    if(title !== 'users'){
      existingAttribute = fetchedSuggestions.some((suggestion) =>
        suggestion?.name?.toLowerCase() === input.toLowerCase()
      );
    }
    else{
      existingUser = fetchedSuggestions.some((suggestion) =>
      suggestion?.username?.toLowerCase() === input.toLowerCase()
    );
    }
   

    if (title === 'users' && !existingUser) {
      console.warn("User not in suggestions. Not adding.");
      return;
    }

    try {
      if (!input) return;
      if (input.length > 25) {
        console.warn("Input exceeds maximum character limit. Not adding.");
        return;
      }
      if(title !== 'users'){
        if (attributes.some((attribute) => attribute.name?.toLowerCase() === input.toLowerCase())) {
          console.warn("Duplicate attribute. Not adding.");
          return;
        }
      }else{
        if (attributes.some((attribute) => attribute.username?.toLowerCase() === input.toLowerCase())) {
          console.warn("Duplicate user. Not adding.");
          return;
        }
      }
      

      let selectedOption = null;

      if (!existingAttribute && (title === 'skills' || title === 'interests')) {
        const options = title === 'skills' ? ["KNOWLEDGE", "SOFTWARE", "HARDWARE", "TOOLS"] : ["TOPICS", "CAUSES", "KNOWLEDGE_AREAS"];
        selectTypeModal.setOptions(options);
        selectTypeModal.setShowModal(true);
        selectedOption = await selectTypeModal.waitForSelection();
      }

      const data = { name: input, type: selectedOption };
      if(title === 'keywords'){
        delete data.type;
      }

      if (!creationMode) {
        let response
        if(title === 'users' && mainEntity === 'project'){
          response = await userService.addUserToProject(projectId, input);
        }else{
          response = await generalService.addItem(title, data, mainEntity, projectId);
        }
        if (response.status === 204) {
          fetchAttributes();
        } else {
          throw new Error("Failed to add item");
        }
      } else {
          let suggestion
          if(title === 'users'){
            suggestion = fetchedSuggestions.find((suggestion) => suggestion.username.toLowerCase() === input.toLowerCase());
            setAttributes([...attributes, {user:{id: suggestion?.id, username: input, photo: suggestion?.photo, role: suggestion?.role, accepted: suggestion?.isAccepted} }]);
          }
          else{
            suggestion = fetchedSuggestions.find((suggestion) => suggestion.name.toLowerCase() === input.toLowerCase());
          setAttributes([...attributes, { id: suggestion?.id, name: input, type: suggestion?.type ?? selectedOption }]);
          }
        
      }
    } catch (error) {
      console.error("Error adding item:", error.message);
    } finally {
      clearInput();
    }
  };

  const clearInput = () => {
    setInput("");
    setSelectedValue(null);
    setSuggestions([]);
  };

  const removeItem = async (attributeToRemove) => {
    try {
      if(!creationMode){
        let response
        if(title === 'users' && mainEntity === 'project'){
          response = await userService.removeUserFromProject(projectId, attributeToRemove.user.username);
        }else{
         response = await generalService.removeItem(title, attributeToRemove.id, mainEntity, projectId);
        }
        if (response.status === 204) {
          fetchAttributes();
        } else {
          throw new Error("Failed to remove item");
        }
      }

      if (title === 'users' && mainEntity === 'project') {
        setAttributes(
          attributes.filter((attribute) => attribute.user.username !== attributeToRemove.user.username)
        );
      }else{
        setAttributes(
        attributes.filter((attribute) => attribute.name !== attributeToRemove.name)
      );
      }
      
      
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  const getLabelValue = (suggestion) => {
    switch (title) {
      case 'users':
        return { label: suggestion.username, value: suggestion.username };
      default:
        return { label: suggestion.name + ' - ' + suggestion.type, value: suggestion.name };
    }
  };

  const elementTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();


  return (
    <div className={styles.container}>
      <h2>{elementTitle}</h2>
      <div className={styles.innerContainer}>
        <div className={styles.existingAttributes}>
          <div className={styles.userAttributeContainer}>
            <ul className={styles.attributeList}>
              {attributes.map((attribute) => (
                <li className={styles.attribute} key={attribute.id}>
                  <ListItem title={title} attribute={attribute} creationMode={creationMode} handleChangeUserProjectRole={handleChangeUserProjectRole}/>
                  {editMode && (<button
                    className={styles.removeButton}
                    onClick={() => removeItem(attribute)}
                  >
                    Remove
                  </button>)}
                </li>
              ))}
            </ul>
          </div>
          {editMode && (
        <div className={styles.addAttribute}>
          <div className={styles.selectAddContainer}>
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
              value={selectedValue}
              onInputChange={handleInputChange}
              onChange={handleSelectChange}
              options={suggestions.map(getLabelValue)}
              inputValue={input}
              noOptionsMessage={() => "No suggestions found"}
              placeholder={`Add new ${title}`}
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  width: "300px", 
                }),
                input: (base) => ({
                  ...base,
                  width: "100%", 
                }),
              }}
            />
            <div onClick={addItem}>Add</div>
          </div>
        </div>)}
        </div>
        <SelectTypeModal />
      </div>
    </div>
  );
};

export default AttributeEditor;
