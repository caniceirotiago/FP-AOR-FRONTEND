import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./AttributeEditor.module.css";
import generalService from "../../services/generalService";
import { FormattedMessage } from "react-intl";

const AttributeEditor = ({ title }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);
  const [userAttributes, setUserAttributes] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);


  useEffect(() => {
    fetchUserAttributes();
  }, []);

  const fetchUserAttributes = async () => {
    try {
      const response = await generalService.fetchUserAttributes(title);
      if (response.status === 200) {
        const data = await response.json();
        setUserAttributes(data);
      } else {
        throw new Error("Failed to fetch user attributes");
      }
    } catch (error) {
      console.error("Error fetching user attributes:", error.message);
    }
  };

  const fetchSuggestions = async (firstLetter) => {
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
  };

  const filterSuggestions = (query) => {
    const filtered = fetchedSuggestions.filter((item) =>
      item.name.toLowerCase().startsWith(query.toLowerCase())
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
    try {
      // Prevent adding empty attributes or too long attribute name
      if (!input) return;
      if (input.length > 25) {
        console.warn("Input exceeds maximum character limit. Not adding.");
        clearInput();
        return;
      }
      // Prevent adding duplicate attributes
      if (
        userAttributes.some(
          (attribute) => attribute.name.toLowerCase() === input.toLowerCase()
        )
      ) {
        console.warn("Duplicate attribute. Not adding.");
        clearInput();
        return;
      }
      const response = await generalService.addItem(title, input);
      if (response.status === 204) {
        fetchUserAttributes();
      } else {
        throw new Error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error.message);
    } finally {
      clearInput();
    }
  };

  const clearInput = () => {
    setInput("");
    setSuggestions([]);
  };

  const removeItem = async (id) => {
    console.log("attribute id: ", id);
    try {
      const response = await generalService.removeItem(title, id);
      if (response.status === 204) {
        setUserAttributes(
          userAttributes.filter((attribute) => attribute.id !== id)
        );
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  const elementTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  return (
    <div className={styles.container}>
      <h2>{elementTitle}</h2>
      <div className={styles.innerContainer}>
        <div className={styles.existingAttributes}>
          <div>
            <h3>
              <FormattedMessage id="existing-attributes" />
            </h3>
          </div>
          <div className={styles.userAttributeContainer}>
            <ul className={styles.attributeList}>
              {userAttributes.map((attribute) => (
                <li className={styles.attribute} key={attribute.id}>
                  <span className={styles.attributeName}>{attribute.name}</span>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeItem(attribute.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.addAttribute}>
          <div>
            <h3>
              <FormattedMessage id="add-attribute" />
            </h3>
          </div>
          <div className={styles.selectAddContainer}>
            <Select
              className="react-select-container"
              classNamePrefix="react-select"
              value={selectedValue}
              onInputChange={handleInputChange}
              onChange={handleSelectChange}
              options={suggestions.map((suggestion) => ({
                label: suggestion.name,
                value: suggestion.name,
              }))}
              inputValue={input}
              noOptionsMessage={() => "No suggestions found"}
              placeholder={`Add new ${title}`}
              isClearable
              styles={{
                control: (base) => ({
                  ...base,
                  width: "300px", // Set fixed width for control
                }),
                input: (base) => ({
                  ...base,
                  width: "100%", // Ensure the input takes up the full width
                }),
              }}
            />
            <button onClick={addItem}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeEditor;
