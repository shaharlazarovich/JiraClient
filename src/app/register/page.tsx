"use client";

import { useState } from "react";
import Pagination from "./pagination";
import "../styles/register.css"; // Import global CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    jiraUrl: "",
    jiraUser: "",
    jiraToken: "",
  });
  const [issues, setIssues] = useState<any[] | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [theme, setTheme] = useState("google");
  const [source, setSource] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [noIssues, setNoIssues] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const flattenIssue = (issue: any) => {
    if (!issue || !issue.fields) return {};
    return {
      Key: issue.key || "N/A",
      Summary: issue.fields.summary || "N/A",
      Description: issue.fields.description || "N/A",
      Priority: issue.fields.priority?.name || "N/A",
      IssueType: issue.fields.issuetype?.name || "N/A",
      Project: `${issue.fields.project?.key || "N/A"} - ${issue.fields.project?.name || "N/A"}`,
      Resolution: issue.fields.resolution?.name || "N/A",
      Updated: issue.fields.updated || "N/A",
      Progress: `${issue.fields.progress?.progress || 0} out of ${issue.fields.progress?.total || 0}`,
      Assignee: issue.fields.assignee?.displayName || "Unassigned",
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInitialLoad(false);
    setSource("jira");
    setLoading(true);
    setErrorMessage(null);
    setNoIssues(false);

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
          setMessage(`${responseData.data} Press the 'Fetch Issues from Database' button to view them.`);
        } else {
          setMessage(`${responseData.data} Make sure your credentials are correct.`);
        }
      } else {
        setMessage("Unexpected response structure. Please try again.");
      }
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching and saving issues."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFetchIssuesFromDb = async (page: number = 1, pageSize: number = 10) => {
    try {
      setInitialLoad(false);
      setSource("db");
      setLoading(true);
      setErrorMessage(null);
      setNoIssues(false);

      const response = await fetch(
        `http://localhost:5001/jira/getissuesfromdb?page=${page}&pageSize=${pageSize}`
      );

      if (!response.ok) throw new Error(await response.text());

      const responseData = await response.json();
      const issues = responseData?.data?.issues || [];
      if (Array.isArray(issues) && issues.length > 0) {
        setIssues(issues.map(flattenIssue));
        setCurrentPage(responseData?.data?.currentPage || 1);
        setTotalPages(responseData?.data?.totalPages || 1);
      } else {
        setIssues([]);
        setNoIssues(true);
      }
    } catch (error) {
      setIssues([]);
      setErrorMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <div className="form-wrapper">
        <h1>Register</h1>
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
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button onClick={() => handleFetchIssuesFromDb()}>Fetch Issues from Database</button>
      </div>

      {message && <div className="success-message">{message}</div>}

      {noIssues && <div className="error-message">No issues found. Ensure data is saved correctly.</div>}

      {!initialLoad && issues && issues.length > 0 && (
        <div className="issues-wrapper">
          <h2>Issues from Database</h2>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => handleFetchIssuesFromDb(page)}
          />
          <table>
            <thead>
              <tr>
                {Object.keys(issues[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue, index) => (
                <tr key={index}>
                  {Object.keys(issue).map((key) => (
                    <td key={key}>{issue[key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => handleFetchIssuesFromDb(page)}
          />
        </div>
      )}
    </div>
  );
};

export default Register;
