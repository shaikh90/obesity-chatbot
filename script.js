const API_KEY = "AIzaSyBxft-XH4xYtCJ1WFURvXCn3sKWPsfFBjs"; 
// Stable URL without 'beta' to avoid 404
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let chatHistory = [];

async function getResponse(prompt) {
    // History update
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: chatHistory
            })
        });

        const data = await response.json();
        console.log("Response Check:", data);

        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            chatHistory.push({ role: "model", parts: [{ text: aiText }] });
            return aiText;
        } else {
            return "Server se sahi jawab nahi aaya. Error: " + (data.error ? data.error.message : "Unknown");
        }
    } catch (error) {
        return "Network fail ho gaya. Internet check karein.";
    }
}

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = sender === 'user' ? 'message user-message' : 'message ai-message';
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    userInput.value = '';
    const aiResponse = await getResponse(text);
    appendMessage(aiResponse, 'ai');
});