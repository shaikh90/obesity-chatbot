import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAvdNjYR4wVcWZ6-kDsWLVUAEyIAWaAYzs";
const genAI = new GoogleGenerativeAI(API_KEY);

// 'gemini-1.5-flash' ki jagah 'gemini-pro' use karein, ye hamesha chalta hai
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function getResponse(prompt) {
    try {
        // Obesity instruction prompt ke sath hi bhej rahe hain
        const result = await model.generateContent(`Role: Obesity Expert. Talk in Roman Urdu and English. User Question: ${prompt}`);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Technical Error:", error);
        return "Connection fail: " + error.message;
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