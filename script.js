const API_KEY = "AIzaSyBxft-XH4xYtCJ1WFURvXCn3sKWPsfFBjs"; 
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Chat History maintain karne ke liye array
let chatHistory = [
    {
        role: "user",
        parts: [{ text: `
            System Instructions:
            1. You are a Professional Obesity & Weight Management Consultant.
            2. Language: Support both English and Roman Urdu. 
            3. Context: You will be used by both general users and medical doctors.
            4. Tone: Professional, clinical, yet encouraging.
            5. Strict Rule: Only discuss obesity, weight loss, nutrition, and metabolic health. 
            6. If a doctor asks in English using medical terminology, respond with professional clinical accuracy.
            7. If a user asks in Roman Urdu, respond in a simple, easy-to-understand way.
            8. Always include a disclaimer that AI advice is for informational purposes and not a substitute for professional medical diagnosis.` 
        }]
    }
];

async function getResponse(prompt) {
    // History mein user ka message add karna
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: chatHistory })
        });

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;

        // History mein AI ka response add karna
        chatHistory.push({ role: "model", parts: [{ text: aiText }] });
        return aiText;
    } catch (error) {
        return "Maafi chahta hoon, kuch masla lag raha hai. Dobara koshish karein.";
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