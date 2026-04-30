import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAvdNjYR4wVcWZ6-kDsWLVUAEyIAWaAYzs";

// Force stable version v1 instead of v1beta
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
}, { apiVersion: 'v1' }); // <--- Ye line add karein, ye 404 khatam karegi

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

async function getResponse(prompt) {
    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: "You are a professional obesity expert. Answer in Roman Urdu and English only."
        });
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("SDK Error Details:", error);
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