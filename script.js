const API_KEY = "AIzaSyBxft-XH4xYtCJ1WFURvXCn3sKWPsfFBjs"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let chatHistory = [];

async function getResponse(prompt) {
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const requestBody = {
        // v1beta mein system_instruction ka format ye hona chahiye
        system_instruction: {
            parts: [{ text: "You are a professional obesity consultant. Answer in Roman Urdu or English about weight loss only." }]
        },
        contents: chatHistory
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            chatHistory.push({ role: "model", parts: [{ text: aiText }] });
            return aiText;
        } else {
            console.error("API Error Detail:", data);
            return "Server error: " + (data.error ? data.error.message : "Unknown error");
        }
    } catch (error) {
        return "Network connection issue.";
    }
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
    const text = userInput.value;
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    const aiResponse = await getResponse(text);
    appendMessage(aiResponse, 'ai');
});