"use client";

import { useState } from "react";
import FetchComponent from "../fetch/JiraFetchComponent";
import "../styles/register.css";

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    jiraUrl: "",
    jiraUser: "",
    jiraToken: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [triggerFetch, setTriggerFetch] = useState(false); // State to trigger FetchComponent methods

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setMessageType(null);

    try {
      const response = await fetch("http://localhost:5001/jira/fetchandsaveissues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(await response.text());

      const responseData = await response.json();
      if (responseData.success && responseData.data) {
        if (responseData.data !== "No issues were fetched.") {
          setMessage(`${responseData.data} issues were successfully fetched and saved.`);
          setMessageType("success");
          handleHistory(e);
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
      console.log("in get history got:"+responseData.data)
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
    // Trigger FetchComponent fetch logic
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
          />
          <input
            type="text"
            name="jiraUser"
            placeholder="Jira User"
            value={formData.jiraUser}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="jiraToken"
            placeholder="Jira Token"
            value={formData.jiraToken}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>

        {loading && <div className="loading">Loading...</div>}

        {message && (
          <div
            className={`message-container ${
              messageType === "success" ? "message-success" : "message-error"
            }`}
          >
            {message}
          </div>
        )}

        {/* Button to trigger FetchComponent's fetch logic */}
        <button onClick={handleFetchFromDb}>Fetch Issues from Database</button>
      </div>

      {/* Render FetchComponent */}
      <FetchComponent triggerFetch={triggerFetch} setTriggerFetch={setTriggerFetch} />
    </div>
  );
};

export default RegisterComponent;
