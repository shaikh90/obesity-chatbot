const API_KEY = "AIzaSyBxft-XH4xYtCJ1WFURvXCn3sKWPsfFBjs"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let chatHistory = [];

async function getResponse(prompt) {
    // User ka sawal history mein add karein
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const requestBody = {
        contents: chatHistory,
        systemInstruction: {
            parts: [{ text: `
                Role & Strict Policy:
                1. You are a Professional Obesity & Weight Loss Specialist.
                2. Only answer questions related to obesity, fat loss, diet, exercise, and metabolic health.
                3. LANGUAGE RULE: 
                   - If the user asks in Roman Urdu, respond in Roman Urdu.
                   - If the user asks in English, respond in English.
                4. OFF-TOPIC RULE:
                   - If the user asks anything NOT related to obesity/health:
                     - In Roman Urdu say: "Main sirf motapay (obesity) aur weight loss ke bare mein guide kar sakta hoon. Aap mujhse diet plan, exercises, ya fat kam karne ke tariqon ke bare mein pooch sakte hain."
                     - In English say: "I can only provide guidance regarding obesity and weight loss. You can ask me about diet plans, exercises, or ways to reduce body fat."
                5. Maintain a professional and clinical tone for doctors, and a simple helpful tone for general users.`
            }]
        }
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
            console.error("API Error:", data);
            return "Maafi chahta hoon, abhi main jawab nahi de sakta.";
        }
    } catch (error) {
        return "Network connection fail ho gayi.";
    }
}

// Append message function
function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
    msgDiv.innerText = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event Listener
sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    const aiResponse = await getResponse(text);
    appendMessage(aiResponse, 'ai');
});