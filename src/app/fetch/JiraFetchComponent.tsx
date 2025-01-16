"use client";

import { useEffect, useState } from "react";
import Pagination from "./pagination"; // Adjust path as needed
import "../styles/fetch.css";

interface FetchComponentProps {
  triggerFetch: boolean;
  setTriggerFetch: (value: boolean) => void;
}

const FetchComponent = ({ triggerFetch, setTriggerFetch }: FetchComponentProps) => {
  const [issues, setIssues] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchIssuesFromDb = async (page: number = 1, pageSize: number = 10) => {
    try {
      setLoading(true);
      setErrorMessage(null);

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
        setErrorMessage("No issues found in the database.");
      }
    } catch (error) {
      setIssues([]);
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred while fetching issues."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (triggerFetch) {
      fetchIssuesFromDb();
      setTriggerFetch(false); // Reset trigger
    }
  }, [triggerFetch, setTriggerFetch]);

  return (
    <div className="fetch-container">
      {loading && <div className="loading">Loading...</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {issues && issues.length > 0 && (
        <div className="issues-wrapper">
          <h2>Issues from Database</h2>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchIssuesFromDb(page)}
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
            onPageChange={(page) => fetchIssuesFromDb(page)}
          />
        </div>
      )}
    </div>
  );
};

export default FetchComponent;
