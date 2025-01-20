"use client";
import { useEffect, useState } from "react";
import FetchComponent from "../fetch/JiraFetchComponent";
import "../styles/register.css";

interface JiraFormData {
    jiraUrl: string;
    jiraUser: string;
    jiraToken: string;
}

interface JiraCredentials {
    baseUrl: string;
    username: string;
    token: string;
}

const RegisterComponent: React.FC<RegisterComponentProps> = ({ onMessage, onLoaderChange }) => {
    const [formData, setFormData] = useState<JiraFormData>({
        jiraUrl: "",
        jiraUser: "",
        jiraToken: "",
    });
    const [loading, setLoading] = useState(false);
    const [triggerFetch, setTriggerFetch] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      
      // Transform the credentials to match backend expected format
      const transformedCredentials: JiraCredentials = {
        baseUrl: formData.jiraUrl.trim(),
        username: formData.jiraUser.trim(),
        token: formData.jiraToken.trim()
      };
      
      // Log before storing (omitting sensitive data)
      console.log('Storing credentials:', {
          baseUrl: transformedCredentials.baseUrl,
          username: transformedCredentials.username,
          hasToken: !!transformedCredentials.token
      });
      
      // Store transformed credentials
      localStorage.setItem('jiraCredentials', JSON.stringify(transformedCredentials));
      
      // Signal to show the loader and start the fetch process
      onLoaderChange(true);
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