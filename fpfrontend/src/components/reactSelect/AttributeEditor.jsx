import React, { useState, useEffect } from "react";
import Select from "react-select";
import generalService from '../../services/generalService';



const AttributeEditor = ({ title }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [items, setItems] = useState([]);
  const [userAttributes, setUserAttributes] = useState([]);

  const fetchInputs = async () => {
    try {
      const response = await generalService.fetchInputs(title);
      if (response.status !== 204) {
        const data = await response.json();
        setUserAttributes(data);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    }
  };

  useEffect(() => {
    // Fetch user inputs
    fetchInputs();
  }, []);

  
    const addItem = async() => {
    
    };
    try {
      const response = await generalService.createInput(name);
      if (response.status !== 204) {
        const data = await response.json();
        setUserAttributes(...data);
        if (input && !items.includes(input)) {
          setItems([...items, input]);
          setInput("");
          setSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
    }
  };



  const fetchSuggestions = async (firstLetter) => {
    try {
      const response = await generalService.fetchSuggestions(title, firstLetter);
      if (response.status !== 204) {
        const data = await response.json();
        setAllSuggestions(data);
        setSuggestions(filterSuggestions(data, firstLetter));
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

    if (value.length === 1) {
      fetchSuggestions(value);
    } else if (value.length > 1) {
      setSuggestions(filterSuggestions(allSuggestions, value));
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



  return (
    <div>
      <h2>{title}</h2>
      <Select
        value={{ label: input, value: input }}
        onInputChange={handleInputChange}
        onChange={handleSelectChange}
        options={suggestions.map((suggestion) => ({
          label: suggestion,
          value: suggestion,
        }))}
        inputValue={input}
        noOptionsMessage={() => "No suggestions found"}
        placeholder={`Add a new ${title.toLowerCase()}`}
        isClearable
      />
      <button onClick={addItem}>Add</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default AttributeEditor;
