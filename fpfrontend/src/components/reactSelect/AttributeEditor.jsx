import React, { useState, useEffect } from "react";
import Select from "react-select";
import generalService from '../../services/generalService';



const AttributeEditor = ({ title }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [items, setItems] = useState([]);
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
      const response = await generalService.fetchSuggestions(title, firstLetter);
      if (response.status === 200) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        throw new Error("Failed to fetch suggestions");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    }
  };

  const filterSuggestions = (suggestions, query) => {
    return suggestions.filter((item) =>
      item.toLowerCase().startsWith(query.toLowerCase())
    );
  };

  const handleInputChange = (newValue) => {
    const value = newValue;
    setInput(value);
  
    // Extract the first letter from the input value
    const firstLetter = value.charAt(0);
  
    if (firstLetter.length === 1) {
      fetchSuggestions(firstLetter); // Pass the first letter to fetchSuggestions
    } else if (value.length > 1) {
      setSuggestions(filterSuggestions(suggestions, value));
    } else {
      setSuggestions([]);
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
    try {
      const response = await generalService.addItem(title, input);
      if (response.status === 200) {
        const data = await response.json();
        setUserAttributes([...userAttributes, data]);
        if (input && !items.includes(input)) {
          setItems([...items, input]);
          setInput("");
          setSuggestions([]);
        }
      } else {
        throw new Error("Failed to create input");
      }
    } catch (error) {
      console.error("Error adding item:", error.message);
    }
  };

  return (
    <div>
      <h2>{title}</h2>
     
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <h3>Existing {title}</h3>
      <ul>
        {userAttributes.map((attribute) => (
          <li key={attribute.id}>{attribute.name}</li>
        ))}
      </ul>
      <h3>Add more {title}</h3>
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
        placeholder={`Add a new ${title.toLowerCase()}`}
        isClearable
      />
      <button onClick={addItem}>Add</button>
    </div>
  );
};

export default AttributeEditor;
