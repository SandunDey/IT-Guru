import { useState, useEffect, useRef } from 'react';
import ChatBotIcon from '../ChatBot/chatBotIcon'
import ChatBotForm from '../ChatBot/chatBotForm'
import ChatMessage from '../ChatBot/chatMessage'
import './chatBot.css'
import { companyDetails } from '../ChatBot/companyDetails.js';
import { ChevronDown, MessageCircleMore, MessageCircleX } from 'lucide-react';



const ChatBot = () => {

    const [chatHistory, setChatHistory] = useState([{
        hideInChat: true,
        role: "model",
        text: companyDetails
    }]);
    const [showChatbot, setShowChatbot] = useState(false);
    const chatBodyref = useRef();

    const generateBotResponse = async (history) => {

        const updateHistory = (text) => {
            setChatHistory(prev => [...prev.filter(msg => msg.text !== "🤔Thinking..."), {role: "model", text}]);
        }

        history = history.map(({role, text}) => ({role, parts: [{text}]}));

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": import.meta.env.VITE_CHATBOT_API_KEY,
            },
            body: JSON.stringify({ contents: history })
        }

        try {

            const response = await fetch(import.meta.env.VITE_CHATBOT_API_URL, requestOptions);
            
            if (!response.ok) {
                const errorText = await response.text(); // log HTML or error JSON
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const apiResponseText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/\*\*(.*?)\*\*/g, "$1").trim() || "⚠️ No response from API";

            updateHistory(apiResponseText);
            
        } catch (err) {
        console.error("Bot fetch failed:", err);
        updateHistory("⚠️ Sorry, I couldn't get a response.");
        }


    };

    useEffect(() => {
        chatBodyref.current.scrollTop = chatBodyref.current.scrollHeight;
    }, [chatHistory]);

    return (
        <div className="chatbot">
        <div className="cbody"> 
        <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
            <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
            <span className="material-symbols-rounded"><MessageCircleMore/></span>
            <span className="material-symbols-rounded"><MessageCircleX/></span>
            </button>
            <div className="chatbot-popup">
                {/*Chatbot Header*/}
                <div className="chat-header">
                    <div className="header-info">
                        <ChatBotIcon />
                        <h2 className="chatbot-title">ITGuru ChatBot</h2>
                    </div>
                    <button onClick={() => setShowChatbot(prev => !prev)}
                     className="material-symbols-rounded"><ChevronDown/></button>
                </div>
                <div ref={chatBodyref} className="chat-body">
                    <div className="message bot-message">
                        <ChatBotIcon />
                        <p className="message-text">
                            Hello👋<br /> How can I assist you today?
                        </p>
                    </div>
                    {/*Render chat history*/}
                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                ))}


                </div>
                <div className="chat-footer">
                    <ChatBotForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                </div>
            </div>
        </div>
        </div>
        </div>
    );
}
export default ChatBot;





