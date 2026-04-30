const API_KEY = "AIzaSyBxft-XH4xYtCJ1WFURvXCn3sKWPsfFBjs"; 
// Stable URL use karein
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let chatHistory = [];

async function getResponse(prompt) {
    // User ka message history mein dalien bina system instruction ke
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const requestBody = {
        contents: chatHistory,
        // System Instruction ko contents ke bahar rakhein
        systemInstruction: {
            parts: [{ text: "You are a professional obesity expert. Talk about weight loss in Roman Urdu and English only. Politely refuse other topics." }]
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        
        // Debugging ke liye full data console par dekhein
        console.log("Full API Response:", data);

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            chatHistory.push({ role: "model", parts: [{ text: aiText }] });
            return aiText;
        } else {
            // Agar koi error hai toh detail yahan dikhegi
            return "Maafi chahta hoon, AI ne sahi jawab nahi diya. Error: " + (data.error ? data.error.message : "Unknown");
        }
    } catch (error) {
        return "Network ka masla hai. Dobara check karein.";
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