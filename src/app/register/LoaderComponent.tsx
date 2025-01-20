"use client";
import { useEffect, useState, useCallback } from 'react';
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import "../styles/loader.css";

const LoaderComponent: React.FC<LoaderComponentProps> = ({ onMessage }) => {
  const [currentBatch, setCurrentBatch] = useState<BatchData | null>(null);
  const [totalCounts, setTotalCounts] = useState<FetchSummary>({ users: 0, issues: 0, histories: 0 });
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [isComplete, setIsComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const createConnection = useCallback(() => {
    try {
      console.log('Creating new SignalR connection...');
      const newConnection = new HubConnectionBuilder()
        .withUrl("http://localhost:5001/fetchHub", {
          skipNegotiation: true,
          transport: HttpTransportType.WebSockets,
          timeout: 120000, // 2 minute timeout
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount === 0) {
              return 0;
            }
            const baseDelay = 1000;
            const maxDelay = 30000;
            const delay = Math.min(
              maxDelay,
              baseDelay * Math.pow(2, retryContext.previousRetryCount - 1)
            );
            console.log(`Connection retry attempt ${retryContext.previousRetryCount}. Next retry in ${delay}ms`);
            return delay;
          }
        })
        .configureLogging(LogLevel.Information)
        .build();

      // Connection event handlers
      newConnection.onclose((error) => {
        console.log('Connection closed:', error);
        setConnectionStatus('Disconnected');
      });

      newConnection.onreconnecting((error) => {
        console.log('Connection lost. Attempting to reconnect...', error);
        setConnectionStatus('Reconnecting');
      });

      newConnection.onreconnected((connectionId) => {
        console.log('Connection reestablished. ConnectionId:', connectionId);
        setConnectionStatus('Connected');
      });

      // Message handlers
      newConnection.on("ReceiveBatchUpdate", (type: 'issues' | 'histories' | 'users', data: any) => {
        console.log(`Received ${type} batch update:`, data);
        
        requestAnimationFrame(() => {
          const batchSize = type === 'issues' ? 30 : type === 'users' ? 50 : 40;
          const batchNumber = Math.floor(data.totalProcessed / batchSize);
          
          setCurrentBatch({
            type,
            items: data.items,
            totalProcessed: data.totalProcessed,
            batchNumber: batchNumber
          });

          setTotalCounts(prev => ({
            ...prev,
            [type]: data.totalProcessed
          }));
        });
      });

      newConnection.on("ProcessComplete", (summary: FetchSummary) => {
        console.log('Process complete with summary:', summary);
        setTotalCounts(summary);
        setIsComplete(true);
        setShowLoader(false);
        const usersCount = summary.users ?? 0;
        const issuesCount = summary.issues ?? 0;
        const historiesCount = summary.histories ?? 0;
        onMessage(
          `Successfully fetched ${usersCount} Users, ${issuesCount} Issues and ${historiesCount} Issue Histories from Jira`,
          "success"
        );
      });

      newConnection.on("error", (error: Error) => {
        console.error("Connection error:", error);
        setConnectionError(`Connection error: ${error.message}`);
        onMessage(`Connection error: ${error.message}`, 'error');
      });

      console.log('Connection created with enhanced retry policy');
      setConnection(newConnection);

    } catch (error) {
      console.error('Error creating connection:', error);
      setConnectionError(`Error creating connection: ${error}`);
      onMessage(`Failed to establish connection: ${error}`, 'error');
    }
  }, [onMessage]);

  // Initialize SignalR connection
  useEffect(() => {
    createConnection();
    return () => {
      if (connection && connection.state === HubConnectionState.Connected) {
        console.log('Cleaning up connection...');
        connection.stop()
          .catch(error => console.error('Error stopping connection:', error));
      }
    };
  }, [createConnection]);

  // Start connection and initiate fetch
  // Update the useEffect that handles connection and fetching
  useEffect(() => {
    const startConnectionAndFetch = async () => {
      if (connection && connection.state === HubConnectionState.Disconnected) {
        try {
          await connection.start();
          console.log('SignalR Connection started');
          setConnectionStatus('Connected');
  
          const credentialsString = localStorage.getItem('jiraCredentials');
          console.log('Retrieved credentials string:', credentialsString ? 'exists' : 'null');
          
          if (!credentialsString) {
            throw new Error('No credentials found in localStorage');
          }
  
          let credentials;
          try {
            credentials = JSON.parse(credentialsString);
            console.log('Parsed credentials:', {
              hasBaseUrl: !!credentials.baseUrl,
              hasUsername: !!credentials.username,
              hasToken: !!credentials.token,
              baseUrlValue: credentials.baseUrl // let's see the actual value
            });
          } catch (e) {
            console.error('Error parsing credentials:', e);
            throw new Error('Invalid credentials format in localStorage');
          }
  
          // Validate credentials
          if (!credentials.baseUrl || !credentials.username || !credentials.token) {
            console.error('Missing credentials:', {
              baseUrl: !credentials.baseUrl,
              username: !credentials.username,
              token: !credentials.token
            });
            throw new Error('Missing required credentials');
          }
  
          const requestBody = {
            baseUrl: credentials.baseUrl,
            username: credentials.username,
            token: credentials.token
          };
  
          console.log('Sending request with body:', {
            baseUrl: requestBody.baseUrl,
            username: requestBody.username,
            hasToken: !!requestBody.token
          });
  
          const response = await fetch("http://localhost:5001/api/fetch/fetch-all", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify(requestBody)
          });
  
          const responseText = await response.text();
          console.log('Raw response:', responseText);
  
          let responseData;
          try {
            responseData = JSON.parse(responseText);
          } catch (e) {
            console.error('Error parsing response:', e);
            throw new Error(`Invalid response format: ${responseText}`);
          }
  
          if (!response.ok || !responseData.success) {
            throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
          }
  
          console.log('Fetch process initiated successfully');
  
        } catch (error) {
          console.error('Error in connection/fetch:', error);
          setConnectionStatus('Error');
          setConnectionError(error instanceof Error ? error.message : 'Unknown error occurred');
          onMessage(error instanceof Error ? error.message : 'Unknown error occurred', 'error');
          setShowLoader(false);
        }
      }
    };
  
    if (connection) {
      console.log('Connection state:', connection.state);
      startConnectionAndFetch();
    }
  }, [connection, onMessage]);


  if (!showLoader) {
    return null;
  }

  if (connectionError) {
    return (
      <div className="loader-container">
        <div className="loader-content error">
          <h2>Connection Error</h2>
          <p>{connectionError}</p>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!currentBatch) {
    return (
      <div className="loader-container">
        <div className="loader-content">
          <h2>Initializing... ({connectionStatus})</h2>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className="loader-content">
        <h2>Fetching {currentBatch.type}</h2>
        <div className="progress-info">
          <p>Processing Batch #{currentBatch.batchNumber}</p>
          <p>Total {currentBatch.type} Processed: {currentBatch.totalProcessed}</p>
        </div>

        <div className="batch-items">
          <div className="batch-header">Current Batch Items:</div>
          {currentBatch.items.slice(0, 5).map((item, index) => (
            <div key={index} className="batch-item">
              {currentBatch.type === 'users' ? (
                <>
                  {item.name && <span className="field">Name: {item.name}</span>}
                  {item.email && <span className="field">Email: {item.email}</span>}
                  {item.accountId && <span className="field">Account ID: {item.accountId}</span>}
                </>
              ) : currentBatch.type === 'issues' ? (
                <>
                  {item.key && <span className="field">Key: {item.key}</span>}
                  {item.summary && <span className="field">Summary: {item.summary}</span>}
                  {item.status && <span className="field">Status: {item.status}</span>}
                </>
              ) : (
                <>
                  {item.field && <span className="field">Field: {item.field}</span>}
                  {item.changedBy && <span className="field">Changed By: {item.changedBy}</span>}
                  {item.changedAt && <span className="field">Changed At: {item.changedAt}</span>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoaderComponent;