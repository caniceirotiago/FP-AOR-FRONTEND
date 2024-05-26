import React, { useState, useEffect } from "react";
import Select from "react-select";
import styles from "./AttributeEditor.module.css";
import generalService from "../../services/generalService";

const AttributeEditor = ({ title }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);
  const [userAttributes, setUserAttributes] = useState([]);

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
      setInput(selectedOption.value);
    } else {
      setInput("");
    }
  };

  const addItem = async () => {
    console.log("Add button clicked. Input value:", input); // Debug log
    if (!input) return; // Prevent adding empty attributes
    try {
      const response = await generalService.addItem(title, input);
      if (response.status === 204) {
        fetchUserAttributes();
        setInput("");
        setSuggestions([]);
      } else {
        throw new Error("Failed to create input");
      }
    } catch (error) {
      console.error("Error adding item:", error.message);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await generalService.removeItem(title, id);
      if (response.status === 204) {
        setUserAttributes(userAttributes.filter(attribute => attribute.id !== id));
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error.message);
    }
  };

  return (
    <div>
      <div className="title">
        <h2>{title}</h2>
      </div>
      <div className="content">
        <div className="unordered_list">
          <h3>Existing {title}</h3>
          <ul>
            {userAttributes.map((attribute) => (
              <li key={attribute.id}>{attribute.name}<button onClick={() => removeItem(attribute.id)}>Remove</button></li>
            ))}
          </ul>
        </div>
        <div className="add_attribute_title">
          <h3>Add more {title}</h3>
        </div>
        <div className={styles.suggestions}>
          <Select
            value={{ label: input, value: input }}
            onInputChange={handleInputChange}
            onChange={handleSelectChange}
            options={suggestions.map((suggestion) => ({
              label: suggestion.name,
              value: suggestion.name,
            }))}
            inputValue={input}
            noOptionsMessage={() => "No suggestions found"}
            placeholder={`Add a new ${title}`}
            isClearable
          />
          <button onClick={addItem}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AttributeEditor;
