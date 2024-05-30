import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./AttributeEditor.module.css";
import generalService from "../../services/generalService";
import ListItem from "./listItems/ListItem";
import { useSelect } from "downshift";
import useSelectTypeModal from "../../stores/useSelectTypeModal";
import SelectTypeModal from "../modals/SelectTypeModal.jsx";


const AttributeEditor = ({ title, editMode, creationMode, mainEntity, onAttributesChange, username }) => {
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
        return generalService.fetchProjectAttributes(title);
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
        console.log(data);
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


  const addItem = async () => {
    const existingAttribute = fetchedSuggestions.some((suggestion) =>
      suggestion?.name?.toLowerCase() === input.toLowerCase()
    );
    const existingUser = fetchedSuggestions.some((suggestion) =>
      suggestion?.username?.toLowerCase() === input.toLowerCase()
    );
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
      if (attributes.some((attribute) => attribute.name.toLowerCase() === input.toLowerCase())) {
        console.warn("Duplicate attribute. Not adding.");
        return;
      }

      let selectedOption = null;

      if (!existingAttribute && (title === 'skills' || title === 'interests')) {
        const options = title === 'skills' ? ["KNOWLEDGE", "SOFTWARE", "HARDWARE", "TOOLS"] : ["TOPICS", "CAUSES", "KNOWLEDGE_AREAS"];
        selectTypeModal.setOptions(options);
        selectTypeModal.setShowModal(true);
        console.log("waiting for selection");
        selectedOption = await selectTypeModal.waitForSelection();
        console.log("selected option: " + selectedOption);
      }

      const data = { name: input, type: selectedOption };
      console.log("data: ", data);

      if (!creationMode) {
        const response = await generalService.addItem(title, data, mainEntity);
        if (response.status === 204) {
          fetchAttributes();
        } else {
          throw new Error("Failed to add item");
        }
      } else {
        setAttributes([...attributes, { id: attributes.length + 1, name: input, type: selectedOption }]);
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

  const removeItem = async (id) => {
    try {
      setAttributes(
        attributes.filter((attribute) => attribute.id !== id)
      );
      if(!creationMode){
        const response = await generalService.removeItem(title, id);
        if (response.status !== 204) {
          fetchAttributes();
        } else {
          throw new Error("Failed to remove item");
        }
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

    console.log(attributes);


  return (
    <div className={styles.container}>
      <h2>{elementTitle}</h2>
      <div className={styles.innerContainer}>
        <div className={styles.existingAttributes}>
          <div className={styles.userAttributeContainer}>
            <ul className={styles.attributeList}>
              {attributes.map((attribute) => (
                <li className={styles.attribute} key={attribute.id}>
                  <ListItem title={title} attribute={attribute}/>
                  {editMode && (<button
                    className={styles.removeButton}
                    onClick={() => removeItem(attribute.id)}
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
