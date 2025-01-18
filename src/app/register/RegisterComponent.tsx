"use client";

import { useEffect, useState } from "react";
import FetchComponent from "../fetch/JiraFetchComponent";
import LoaderComponent from "./LoaderComponent";
import "../styles/register.css";

const RegisterComponent: React.FC<RegisterComponentProps> = ({ onMessage, onLoaderChange }) => {

    const [formData, setFormData] = useState({
    jiraUrl: "",
    jiraUser: "",
    jiraToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (message) {
      onMessage(message, messageType || 'error');
    }
  }, [message, messageType, onMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLoaderChange(true); // Show loader
    setLoading(true);
    setMessage(null);
    setMessageType(null);
    setShowLoader(true);

    try {
      const response = await fetch("http://localhost:5001/api/fetch/fetch-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let responseData;
      const responseText = await response.text();
      console.log('Raw response:', responseText); // Debug log

      try {
        responseData = JSON.parse(responseText);
      } catch (error) {
        console.error('Error parsing response:', error);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      if (!response.ok) {
        throw new Error(responseData.message || await response.text());
      }

      if (responseData.success && responseData.data) {
        if (responseData.data !== "No data fetched.") {
          // Don't set any success message here - let LoaderComponent handle it
          onLoaderChange(true);
        } else {
          setMessage("No data was fetched. Please check your credentials.");
          setMessageType("error");
          setShowLoader(false);
          onLoaderChange(false);
        }
      } else {
        setMessage(responseData.message || "Unexpected response structure. Please try again.");
        setMessageType("error");
        setShowLoader(false);
        onLoaderChange(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching data."
      );
      setMessageType("error");
      setShowLoader(false);
    } finally {
      setLoading(false);
    }
  };

  // Keep handleHistory for reference or future use
  const handleHistory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const response = await fetch("http://localhost:5001/api/jira/history/fetch-and-save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(await response.text());

      const responseData = await response.json();
      console.log("in get history got:" + responseData.data);
      if (responseData.success && responseData.data) {
        if (responseData.data !== "No issues were fetched.") {
          setMessage(`${responseData.data} history were successfully fetched and saved.`);
          setMessageType("success");
        } else {
          setMessage("No issues were fetched. Please check your credentials.");
          setMessageType("error");
        }
      } else {
        setMessage("Unexpected response structure. Please try again.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching issues."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchFromDb = () => {
    setTriggerFetch(true);
  };

  return (
    <div className="register-container">
      <div className="form-wrapper">
        <h1>Register Jira Credentials</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="jiraUrl"
            placeholder="Jira URL"
            value={formData.jiraUrl}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="jiraUser"
            placeholder="Jira User"
            value={formData.jiraUser}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="jiraToken"
            placeholder="Jira Token"
            value={formData.jiraToken}
            onChange={handleInputChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <button onClick={handleFetchFromDb} disabled={loading}>
          Fetch Issues from Database
        </button>
      </div>

      
      <FetchComponent triggerFetch={triggerFetch} setTriggerFetch={setTriggerFetch} />
    </div>
  );
};

export default RegisterComponent;