"use client";
import { useState } from 'react';
import RegisterComponent from "./register/RegisterComponent";
import LoaderComponent from "./register/LoaderComponent";
import MessageComponent from "./register/MessageComponent";

const Page = () => {
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [showLoader, setShowLoader] = useState(false);

    const handleMessage = (msg: string, type: 'success' | 'error') => {
        setMessage(msg);
        setMessageType(type);
        
        // Hide loader on error
        if (type === 'error') {
            setShowLoader(false);
        }
    };

    return (
        <div className="page-container">
            <RegisterComponent 
                onMessage={handleMessage}
                onLoaderChange={setShowLoader}
            />
            {showLoader && <LoaderComponent onMessage={handleMessage} />}
            <MessageComponent message={message} type={messageType} />
        </div>
    );
};

export default Page;