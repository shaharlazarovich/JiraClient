"use client";
import { useEffect, useState, useCallback } from 'react';
import { HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import "../styles/loader.css";

interface BatchItem {
  key?: string;
  summary?: string;
  status?: string;
  field?: string;
  changedBy?: string;
  changedAt?: string;
}

interface BatchData {
  type: 'issues' | 'histories';
  items: BatchItem[];
  totalProcessed: number;
  batchNumber: number;
}

interface FetchSummary {
  issues: number;
  histories: number;
}

interface LoaderComponentProps {
  onMessage: (message: string, type: 'success' | 'error') => void;
}

const LoaderComponent: React.FC<LoaderComponentProps> = ({ onMessage }) => {
  const [currentBatch, setCurrentBatch] = useState<BatchData | null>(null);
  const [totalCounts, setTotalCounts] = useState<FetchSummary>({ issues: 0, histories: 0 });
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
              return 0; // First retry immediately
            }
            
            const baseDelay = 1000; // Start with 1 second
            const maxDelay = 30000; // Max 30 seconds between retries
            
            // Exponential backoff with a max delay
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

      newConnection.on("ReceiveBatchUpdate", (type: 'issues' | 'histories', data: any) => {
        console.log(`Received ${type} batch update:`, data);
        
        requestAnimationFrame(() => {
          const batchSize = type === 'issues' ? 30 : 50;
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
        
        onMessage(
          `Successfully fetched ${summary.issues} Issues and ${summary.histories} Issue Histories from Jira`,
          "success"
        );
      });

      // Add error handling for the connection itself
      newConnection.on("error", (error: Error) => {
        console.error("Connection error:", error);
        // Don't fail completely, let automatic reconnection handle it
      });

      console.log('Connection created with enhanced retry policy');
      setConnection(newConnection);

    } catch (error) {
      console.error('Error creating connection:', error);
      setConnectionError(`Error creating connection: ${error}`);
      onMessage(`Failed to establish connection: ${error}`, 'error');
    }
  }, [onMessage]);

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

  useEffect(() => {
    if (connection) {
      const startConnection = async () => {
        try {
          if (connection.state === HubConnectionState.Disconnected) {
            await connection.start();
            console.log('SignalR Connection started');
            setConnectionStatus('Connected');
          }
        } catch (error) {
          console.error('Error starting connection:', error);
          setConnectionStatus('Error');
          setConnectionError(`Failed to connect: ${error}`);
          onMessage(`Failed to establish connection: ${error}`, 'error');
        }
      };

      startConnection();
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
        <h2>Fetching {currentBatch.type === 'issues' ? 'Issues' : 'Issue History'}</h2>
        <div className="progress-info">
          <p>Processing Batch #{currentBatch.batchNumber}</p>
          <p>Total {currentBatch.type} Processed: {currentBatch.totalProcessed}</p>
        </div>

        <div className="batch-items">
          <div className="batch-header">Current Batch Items:</div>
          {currentBatch.items.slice(0, 5).map((item, index) => (
            <div key={index} className="batch-item">
              {currentBatch.type === 'issues' ? (
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