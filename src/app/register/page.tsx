"use client";

import { useRef, useEffect, useState } from "react";
import Pagination from "./pagination"; 

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
      display: flex;
      justify-content: center;
      gap: 10px;
    }
    .theme-selector-wrapper button {
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

const themes = {
    jira: {
      backgroundColor: "#ffffff", // White for Jira fetch
      borderRadius: "10px",
      padding: "20px",
      width: "90%",
      maxWidth: "800px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      margin: "20px auto",
    },
    db: {
      backgroundColor: "#d0eaff", // Light blue for DB fetch
      borderRadius: "10px",
      padding: "20px",
      width: "90%",
      maxWidth: "800px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      margin: "20px auto",
    },
  };

  const tableStyles = `
  table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto; /* Automatically adjust column widths */
  }

    th, td {
    border: 1px solid #ddd;
    padding: 10px;
    text-align: left;
    word-break: break-word; /* Break long words for better display */
    }

    th {
    background-color: #f4f4f4;
    font-weight: bold;
    }

    tr:nth-child(even) {
    background-color: #f9f9f9;
    }
    `;

const Register = () => {
    const [formData, setFormData] = useState({
      jiraUrl: "",
      jiraUser: "",
      jiraToken: "",
    });
    const [issues, setIssues] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true); // New state to track initial page load
    const [theme, setTheme] = useState("google");
    const [source, setSource] = useState("jira"); // Tracks the source of the data
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFormSubmitted, setIsFormSubmitted] = useState(false); // Track if the form has been submitted
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const tableRef = useRef<HTMLTableElement | null>(null);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const pageSize = 10; // Number of issues per page
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        setInitialLoad(false); // User has interacted
        setSource("jira"); // Set source to Jira
        e.preventDefault();
        try {
            setLoading(true);
            setErrorMessage(null);
            const response = await fetch("http://localhost:5001/jira/fetchandsaveissues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                throw new Error(await response.text());
            }
    
            const data = await response.json();
            setIssues(data.issues); // Set the issues from the response
            setCurrentPage(data.currentPage || 1);
            setTotalPages(data.totalPages || 1);
          } catch (error: unknown) {
            if (error instanceof Error) {
              setErrorMessage(error.message);
            } else {
              setErrorMessage("An unexpected error occurred.");
            }
          } finally {
            setLoading(false);
          }
    };

    const fetchIssues = async (page: number, pageSize: number) => {
        const response = await fetch(
            `/api/issues?page=${page}&pageSize=${pageSize}`
        );
    
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch issues: ${errorText}`);
        }
    
        try {
            return await response.json();
        } catch (error) {
            throw new Error("Failed to parse JSON response from the server.");
        }
    };
    

      const loadIssues = async () => {
        try {
          const data = await fetchIssues(currentPage, pageSize);
          setIssues(data.issues);
          setTotalPages(data.totalPages);
        } catch (error) {
          console.error("Error fetching issues:", error);
        }
      };

      useEffect(() => {
        if (isFormSubmitted) {
          loadIssues(); // Only load issues if the form has been submitted
        }
      }, [currentPage, isFormSubmitted]);

      useEffect(() => {
        if (tableRef.current) {
            const table = tableRef.current;
            const colWidths: number[] = [];
    
            // Calculate the max width for each column
            Array.from(table.rows).forEach((row) => {
                Array.from(row.cells).forEach((cell, index) => {
                    const width = cell.offsetWidth;
                    colWidths[index] = Math.max(colWidths[index] || 0, width);
                });
            });
    
            // Apply the widths to the header cells
            Array.from(table.rows[0].cells).forEach((cell, index) => {
                cell.style.minWidth = `${colWidths[index]}px`;
            });
        }
    }, [issues, currentPage]);
    

      const handlePageChange = async (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
          if (source === "db") {
            await handleFetchIssuesFromDb(newPage, 10);
          } else if (source === "jira") {
            setCurrentPage(newPage); // For now, pagination from Jira is not yet supported
          }
        }
      };
      
      const handleFetchIssuesFromDb = async (page: number = 1, pageSize: number = 10) => {
        try {
          setInitialLoad(false); // User has interacted
          setSource("db"); // Set source to Database
          setLoading(true);
          setErrorMessage(null);
          const response = await fetch(`http://localhost:5001/jira/getissuesfromdb?page=${currentPage}&pageSize=${pageSize}`);

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch: ${errorText}`);
          }
      
          const data = await response.json();
          setIssues(data.issues);
          setCurrentPage(page);
          setTotalPages(data.totalPages || 1);
        } catch (error) {
          setErrorMessage((error as Error).message);
        } finally {
          setLoading(false);
        }
      };
      
    
    return (
        <div>
        <style>{tableStyles}</style>
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
          {initialLoad && (
            <div>
                <p>Welcome! Please enter details to fetch issues.</p>
            </div>
            )}
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
          {loading && (
            <div style={{ marginTop: '20px', textAlign: 'center', color: '#555' }}>
                Loading...
            </div>
            )}
            {errorMessage && (
            <div style={{ marginTop: '10px', color: 'red' }}>{errorMessage}</div>
            )}
         <button
        onClick={() => {
            handleFetchIssuesFromDb();
        }}
        className="db-fetch-btn"
        >
        Fetch Issues from Database
        </button>
        </div>
        {!initialLoad && Array.isArray(issues) && issues.length > 0 && (    
        <div style={source === "jira" ? themes.jira : themes.db}>
            <h2>
            Issues {source === "jira" ? "from Jira" : "from Database"}
            </h2> 
            {/* Pagination at the top */}
            <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
            />

            <table ref={tableRef}>
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
            {/* Pagination at the bottom */}
            <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
            />
        </div>
        )}

        {!initialLoad && (!Array.isArray(issues) || issues.length === 0) && (
        <div>
            <h2>No Issues to Display</h2>
            {source === "jira" ? (
            <p>No issues found in Jira. Try refreshing or modifying your query.</p>
            ) : source === "db" ? (
            <p>No issues found in the database. Ensure data is saved correctly.</p>
            ) : null}
        </div>
        )}
      </div>
    );
  };
  export default Register;