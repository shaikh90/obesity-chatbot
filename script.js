import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAvdNjYR4wVcWZ6-kDsWLVUAEyIAWaAYzs";
const genAI = new GoogleGenerativeAI(API_KEY);

// Force karein ke 'v1' stable use ho aur model name check karein
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
}, { apiVersion: "v1" }); // Ye line 404 error ko fix karne ke liye critical hai

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function getResponse(prompt) {
    try {
        // Simple prompt format taake koi JSON payload error na aaye
        const result = await model.generateContent(`Talk in Roman Urdu/English. You are an obesity expert. User: ${prompt}`);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Technical Error:", error);
        return "Connection error: " + error.message;
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