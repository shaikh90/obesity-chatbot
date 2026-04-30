const API_KEY = "AIzaSyBxft-XH4xYtCJ1WFURvXCn3sKWPsfFBjs"; 
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Chat History maintain karne ke liye array
let chatHistory = [];
const systemPrompt = "You are a Professional Obesity Consultant. Respond in Roman Urdu/English. Only discuss weight loss and health.";

async function getResponse(prompt) {
    // History mein user ka naya sawal add karein
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                // System Instruction ko yahan add karein (Advanced Method)
                system_instruction: {
                    parts: [{ text: "You are an expert obesity consultant for doctors and patients. Speak Roman Urdu and English." }]
                },
                contents: chatHistory,
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            chatHistory.push({ role: "model", parts: [{ text: aiText }] });
            return aiText;
        } else {
            // Agar safety block ho jaye toh data.promptFeedback check karein
            console.log("Full Data:", data);
            return "Maafi chahta hoon, main is sawal ka jawab nahi de sakta.";
        }
    } catch (error) {
        return "Network Error. Please try again.";
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