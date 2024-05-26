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

  return (
    <div>
            {userAttributes.map((attribute) => (
    </div>
  );
};

export default AttributeEditor;
