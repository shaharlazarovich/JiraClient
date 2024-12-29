"use client";

import { useState } from "react";

const styles = {
  google: `
    .form-wrapper {
      background-color: #f5f5f5;
      border-radius: 10px;
      padding: 20px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      margin: 20px auto;
    }
    .form-wrapper h1 {
      font-size: 24px;
      text-align: center;
      margin-bottom: 20px;
    }
    .form-wrapper input {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
    }
    .form-wrapper button {
      width: 100%;
      padding: 10px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      margin-top: 10px;
    }
    .form-wrapper button:hover {
      background-color: #357ae8;
    }
    .issues-wrapper {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 20px;
      width: 90%;
      max-width: 800px;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      margin: 20px auto;
    }
    .issues-wrapper h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #333;
    }
    .issues-wrapper table {
      width: 100%;
      border-collapse: collapse;
    }
    .issues-wrapper th,
    .issues-wrapper td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }
    .issues-wrapper th {
      background-color: #f4f4f4;
      font-weight: bold;
    }
    .issues-wrapper tr:nth-child(even) {
      background-color: #f9f9f9;
    }
  `,
  facebook: `
    .form-wrapper {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 25px;
      width: 90%;
      max-width: 450px;
      box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
      margin: 30px auto;
    }
    .form-wrapper h1 {
      font-size: 26px;
      text-align: center;
      color: #1877f2;
      margin-bottom: 25px;
    }
    .form-wrapper input {
      width: 100%;
      padding: 12px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 16px;
    }
    .form-wrapper button {
      width: 100%;
      padding: 12px;
      background-color: #1877f2;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 18px;
      cursor: pointer;
      margin-top: 15px;
    }
    .form-wrapper button:hover {
      background-color: #145dbb;
    }
    .issues-wrapper {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 20px;
      width: 90%;
      max-width: 800px;
      box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.2);
      margin: 20px auto;
    }
    .issues-wrapper h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #1877f2;
    }
    .issues-wrapper table {
      width: 100%;
      border-collapse: collapse;
    }
    .issues-wrapper th,
    .issues-wrapper td {
      border: 1px solid #ccc;
      padding: 12px;
      text-align: left;
    }
    .issues-wrapper th {
      background-color: #eef3fc;
      font-weight: bold;
    }
    .issues-wrapper tr:nth-child(even) {
      background-color: #f9fbfd;
    }
  `,
  linkedin: `
    .form-wrapper {
      background-color: #f3f2ef;
      border-radius: 12px;
      padding: 30px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.15);
      margin: 40px auto;
    }
    .form-wrapper h1 {
      font-size: 28px;
      text-align: center;
      color: #0077b5;
      margin-bottom: 30px;
    }
    .form-wrapper input {
      width: 100%;
      padding: 14px;
      margin-bottom: 25px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
    }
    .form-wrapper button {
      width: 100%;
      padding: 14px;
      background-color: #0077b5;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      cursor: pointer;
      margin-top: 20px;
    }
    .form-wrapper button:hover {
      background-color: #005983;
    }
    .issues-wrapper {
      background-color: #ffffff;
      border-radius: 12px;
      padding: 20px;
      width: 90%;
      max-width: 800px;
      box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.15);
      margin: 20px auto;
    }
    .issues-wrapper h2 {
      text-align: center;
      margin-bottom: 20px;
      color: #0077b5;
    }
    .issues-wrapper table {
      width: 100%;
      border-collapse: collapse;
    }
    .issues-wrapper th,
    .issues-wrapper td {
      border: 1px solid #ddd;
      padding: 14px;
      text-align: left;
    }
    .issues-wrapper th {
      background-color: #e8f4fc;
      font-weight: bold;
    }
    .issues-wrapper tr:nth-child(even) {
      background-color: #f4f9fc;
    }
  `,
  themeSelector: `
    .theme-selector-wrapper {
      background-color: #ffffff;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 15px;
      width: 90%;
      max-width: 450px;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      margin: 20px auto;
      text-align: center;
    }
    .theme-selector-wrapper button {
      width: 100px;
      margin: 5px;
      padding: 10px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
    }
    .theme-selector-wrapper .google-btn {
      background-color: #4285f4;
      color: white;
    }
    .theme-selector-wrapper .google-btn:hover {
      background-color: #357ae8;
    }
    .theme-selector-wrapper .facebook-btn {
      background-color: #1877f2;
      color: white;
    }
    .theme-selector-wrapper .facebook-btn:hover {
      background-color: #145dbb;
    }
    .theme-selector-wrapper .linkedin-btn {
      background-color: #0077b5;
      color: white;
    }
    .theme-selector-wrapper .linkedin-btn:hover {
      background-color: #005983;
    }
  `,
};

const Register = () => {
  const [formData, setFormData] = useState({
    jiraUrl: "",
    jiraUser: "",
    jiraToken: "",
  });
  const [issues, setIssues] = useState([]);
  const [theme, setTheme] = useState("google");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/jira/getissues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch issues");
      }
      const data = await response.json();
      setIssues(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unknown error");
    }
  };

  return (
    <div>
      <style>{styles.themeSelector}</style>
      <style>{styles[theme as keyof typeof styles]}</style>
      <div className="theme-selector-wrapper">
        <button className="google-btn" onClick={() => setTheme("google")}>
          Google
        </button>
        <button className="facebook-btn" onClick={() => setTheme("facebook")}>
          Facebook
        </button>
        <button className="linkedin-btn" onClick={() => setTheme("linkedin")}>
          LinkedIn
        </button>
      </div>
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
      </div>
      {issues.length > 0 && (
        <div className="issues-wrapper">
          <h2>Issues</h2>
          <table>
            <thead>
              <tr>
                {Object.keys(issues[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {issues.map((issue: any, index) => (
                <tr key={index}>
                  {Object.keys(issue).map((key) => (
                    <td key={key}>{JSON.stringify(issue[key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Register;

