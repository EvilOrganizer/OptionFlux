document.addEventListener('DOMContentLoaded', () => {
    const chatbox = document.getElementById('chatbox');
    const input = document.getElementById('input');
    const sendButton = document.getElementById('send');
    const fallback = document.getElementById('fallback');
    const accessKey = '<P0XwW3BOnjN6NqpvtHTssb46j34N9WP1>'; // Replace with your actual access key from DigitalOcean
    const endpoint = 'https://b2esubjm3asicapralxxt.ondigitalocean.app/api/v1/chat/completions';

    sendButton.addEventListener('click', async () => {
        const message = input.value.trim();
        if (!message) return;

        chatbox.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
        input.value = '';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessKey}`
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: message }],
                    stream: false,
                    include_retrieval_info: true
                })
            });

            console.log('Response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                chatbox.innerHTML += `<p><strong>Bot:</strong> ${data.choices[0].message.content}</p>`;
                fallback.style.display = 'none'; // Hide fallback on success
            } else {
                const errorData = await response.json();
                chatbox.innerHTML += `<p><strong>Error:</strong> ${response.status} - ${errorData.detail || 'Unknown error'}</p>`;
                fallback.style.display = 'block'; // Show fallback on error
            }
        } catch (error) {
            console.error('Fetch error:', error);
            chatbox.innerHTML += `<p><strong>Error:</strong> Network issue or invalid endpoint</p>`;
            fallback.style.display = 'block'; // Show fallback on network error
        }
        chatbox.scrollTop = chatbox.scrollHeight;
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendButton.click();
    });
});