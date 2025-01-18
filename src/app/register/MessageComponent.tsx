"use client";
import { FC } from 'react';
import "../styles/message.css";

interface MessageComponentProps {
  message: string | null;
  type: 'success' | 'error' | null;
}

const MessageComponent: FC<MessageComponentProps> = ({ message, type }) => {
  if (!message) return null;

  return (
    <div className={`message-wrapper ${type}`}>
      <div className={`message ${type === 'success' ? 'message-success' : 'message-error'}`}>
        {message}
      </div>
    </div>
  );
};

export default MessageComponent;