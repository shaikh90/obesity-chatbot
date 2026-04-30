const API_KEY = "AIzaSyAvdNjYR4wVcWZ6-kDsWLVUAEyIAWaAYzs"; 
// v1beta aur gemini-1.5-flash ka combination connection ke liye best hai
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let chatHistory = [];

async function getResponse(prompt) {
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
        console.log("Full Response:", data); // Is se aapko Console mein pura object dikhega

        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            chatHistory.push({ role: "model", parts: [{ text: aiText }] });
            return aiText;
        } else {
            return "Error: " + (data.error ? data.error.message : "Jawab nahi aaya.");
        }
    } catch (error) {
        return "Network fail ho gaya.";
    }
}

// Baki ka appendMessage aur eventListener wahi rahega jo aapne likha hai
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