document.addEventListener('mouseup', async function(event) {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        let anchorNode = window.getSelection().anchorNode;
        let parentElement = anchorNode.nodeType === 3 ? anchorNode.parentNode : anchorNode;
        while (parentElement && !["P", "DIV", "ARTICLE", "SECTION", "BODY"].includes(parentElement.nodeName)) {
            parentElement = parentElement.parentNode;
        }
        
        let paragraphContent = parentElement ? parentElement.textContent : "Paragraph not found.";

        // Prepare the payload for the API call
        let data = {
            model: "gpt-4-turbo-preview",
            messages: [
              {
                role: "user",
                content: `Provide Defination of Word in context to Context: "${selectedText}"\n Context: "${paragraphContent}" Output: a: Definition of the word in silo(short and easy to read) b:Explain of the meaning of the word in context to the paragraph`
              }
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        };

        // Make the API call
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer YOUR_API_KEY`
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.choices && data.choices.length > 0 && data.choices[0].message) {
                const responseContent = data.choices[0].message.content;
                
                const responseContainer = document.createElement('div');
                // styling code omitted for brevity
                responseContainer.innerText = responseContent;
                responseContainer.style.position = 'fixed';
                responseContainer.style.bottom = '10px';
                responseContainer.style.right = '10px';
                responseContainer.style.backgroundColor = 'black';
                responseContainer.style.color = 'white';
                responseContainer.style.padding = '10px';
                responseContainer.style.width = '250px';
                responseContainer.style.zIndex = '9999';
                
                document.body.appendChild(responseContainer);
        
                setTimeout(() => {
                    document.body.removeChild(responseContainer);
                }, 1000000);
            } else {
                console.log('Unexpected response structure:', data);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
});