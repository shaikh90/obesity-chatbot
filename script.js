import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAvdNjYR4wVcWZ6-kDsWLVUAEyIAWaAYzs";
const genAI = new GoogleGenerativeAI(API_KEY);

// Simple model initialization without extra config
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function getResponse(prompt) {
    try {
        // System instruction ko hum prompt ka hissa bana denge
        const fullPrompt = `System Instruction: You are a professional obesity expert. Talk in Roman Urdu and English. Answer ONLY weight loss questions. 
        User Question: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("SDK Error:", error);
        return "Connection mein masla hai. Dubara try karein.";
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