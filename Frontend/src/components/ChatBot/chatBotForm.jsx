import { useRef } from "react";
import './chatBot.css'

const ChatBotForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value = '';
        
        setChatHistory((history) => [...history, {role: "user", text: userMessage}]);

        setTimeout(() => {
            setChatHistory((history) => [...history, {role: "model", text: "🤔Thinking..."}])
            // Call the function to generate bot response
            generateBotResponse([...chatHistory, {role: "user", text: userMessage}]);
        }, 600);

    }

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input
                type="text"
                placeholder="Type a message..."
                className="message-input"
                ref={inputRef}
                required
            />
            <button className="material-symbols-rounded">arrow_upward</button>
        </form>
    );
}
export default ChatBotForm;