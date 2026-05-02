import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Aapki bilkul nayi aur secure key
const API_KEY = "AQAb8RN6L0ZLEVVnU2dKZn2PbLSHKDRpvUUenc6R5L5brQX1_2wA"; 
const genAI = new GoogleGenerativeAI(API_KEY);

// 2. Model initialization (Naye project ke liye apiVersion ki zaroorat nahi)
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash" 
});

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function getResponse(prompt) {
    try {
        // Expertise context seedha prompt mein bhej rahe hain taake payload simple rahe
        const fullPrompt = `Role: Professional Obesity Expert. Answer in Roman Urdu and English. Question: ${prompt}`;
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Technical Error:", error);
        // Error message ko user-friendly rakhein
        return "Connection mein masla hai, lekin key ab sahi hai. Error: " + error.message;
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