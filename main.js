// Initial setup and constants
const definitionBoxHTML = `
<div class="avagama-wrapper">

    <div class="avagama-header">
        <a class="avagama-link-wp" href="https://pravin.website/avagama?app" target="_blank">
            <img id="logo" class="avagama-logo" src="https://raw.githubusercontent.com/Pravinakajerry/Avagama/main/images/avagama-logo.svg">
            <p id="avagama-label" class="avagama-label">Definition</p>
        </a>

        <div>
            <img id="avagama-close" class="avagama-close-icn" src="https://raw.githubusercontent.com/Pravinakajerry/Avagama/fc1a6ee40cd8e2a9f78f41f4aa3ccf03de337ec3/images/close-icn.svg">
        </div>
    </div>

    <div id="define" class="avagama-inner-content">
        <div class="avagama-inner-content-wp">
            <p id="d-word" class="avagama-color-cf4" style="color: #cf4; text-transform: capitalize;">āvagamaṃ</p>
            <p id="d-meaning" style="color: white;">Understanding...</p>        
        </div>
    </div>

</div>
`;

const styleCSS = `
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

.avagama-wrapper p {
    padding: 0%;
    margin: 0%;
    font-size: 15px;
    line-height: 130%;
}

.avagama-wrapper p::selection {
    background-color: #cf4; 
    color: black;

}

.avagama-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1f1e1f;
    color: #fff;
    padding: 8px;
}

.avagama-logo {
    width: 32px;
    height: 32px;
}

.avagama-close-icn {
    cursor: pointer;
    opacity: 0.5;
}

.avagama-input-wp {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;
}

.avagama-input {
    padding: 16px;
    font-family: 'Inter', sans-serif;
    background-color: #393839;
    border: none;
    color: white;
    font-size: 16px;
    outline: none;
    margin-left: -8px;
    width: calc(100% + 16px);
}

.avagama-inner-content {
    padding: 8px;
}

.avagama-hide {
    display: none;
}

.avagama-inner-content-wp {
    padding: 12px;
    background-color: #393839;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 4px;
}

.avagama-inner-content-wp p{
    font-family: 'Inter', sans-serif;
}

.avagama-color-cf4 {
    color: #cf4;
}

.avagama-button-wp {
    display: flex;
    padding-top: 16px;
    padding-bottom: 4px;
    padding-left: 8px;
    padding-right: 8px;
    justify-content: space-between;
    gap: 16px;
}

.avagama-button {
    font-family: 'Inter', sans-serif;
    padding-top: 12px;
    padding-bottom: 12px;
    width: 50%;
    min-height: 32px;
    background-color: #191819;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
}

.avagama-active {
    background-color: #393839;
    color: white;
}

.avagama-label {
    color: #fff;
}

.avagama-wrapper {
    font-family: 'Inter', sans-serif;
    width: 380px;
    box-sizing: border-box;
    background-color: #1f1e1f;
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 8px;
    border-radius: 8px;
    border: #646464 1px solid;
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    box-shadow: 0px 9px 19px 0px rgba(0, 0, 0, 0.10), 0px 35px 35px 0px rgba(0, 0, 0, 0.09), 0px 79px 48px 0px rgba(0, 0, 0, 0.05), 0px 141px 56px 0px rgba(0, 0, 0, 0.01), 0px 220px 62px 0px rgba(0, 0, 0, 0.00);
    transition: opacity 0.5s, visibility 0.5s;
    overflow: hidden;
}

.avagama-link-wp {
    font-family: 'Inter', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
}

.avagama-link-wp p {
    font-family: 'Inter', sans-serif;
}


.avagama-wrapper.show {
    opacity: 1;
    visibility: visible;
}
</style>
`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'simulateKeyPress') {
        const evt = new KeyboardEvent('keydown', {
            ctrlKey: true,
            key: '/',
            code: 'Slash',
        });
        document.dispatchEvent(evt);
        console.log('Ctrl + / pressed');
    }
});

// On page load
console.log('Clean Avagama is running...');
document.body.insertAdjacentHTML('beforeend', styleCSS);

// Utility functions
function fetchDefinition(selectedText, paragraphContent) {
    console.log("Avagama Fetching definition for:", selectedText);
    const meaningElement = document.getElementById('d-meaning');
    if (meaningElement) {
        meaningElement.textContent = "Understanding...";
    }

    // Fetch logic
    let data = {
        model: "gpt-4-turbo-preview",
        messages: [{
            role: "user",
            content: `Provide Definition of Word in context to Context: "${selectedText}"\n Context: "${paragraphContent}" Output: (a)Definition of the word in silo(short and easy to read) (b)Explain of the meaning of the word in context to the paragraph - JSON Output Example: Definition: content, Explanation: content. If no content is selected - ask the user to select the content and try again.` 
        }],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    };

    fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR-OPENAI-API'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    
        const choice = data.choices[0];
        // Remove the markdown code block syntax to extract the JSON string
        let contentJsonString = choice.message.content.replace(/```json\n|\n```/g, '');
        try {
            // Parse the clean JSON string
            const contentObj = JSON.parse(contentJsonString);
            
            // Extract "Definition" and "Explanation" using the correct keys
            const definition = contentObj.Definition;
            const explanation = contentObj.Explanation;
    
            // Ensure elements are available before updating
            setTimeout(() => {
                const dWordElement = document.getElementById('d-word');
                const dMeaningElement = document.getElementById('d-meaning');
                
                if (dWordElement && dMeaningElement) {
                    dWordElement.textContent = selectedText; // Use 'selectedText' directly
                    dMeaningElement.innerHTML = `${definition}<br><br>${explanation}`;
                }
            }, 1000); // Adjust the delay as needed
        } catch (error) {
            console.error('Error parsing JSON content:', error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function showMessage() {
    // Create a new div element
    const newDiv = document.createElement("div");
    newDiv.textContent = "Avagama is currently limited to 4 words";

    // Set the style for the div
    newDiv.style.position = "fixed";
    newDiv.style.bottom = "24px";
    newDiv.style.right = "24px";
    newDiv.style.zIndex = "999999";
    newDiv.style.fontSize = "14px";
    newDiv.style.backgroundColor = "#191819";
    newDiv.style.color = "#f5f5f5";
    newDiv.style.fontFamily = "'Inter', sans-serif";
    newDiv.style.fontWeight = "400";
    newDiv.style.padding = "8px";
    newDiv.style.borderRadius = "2px";
    newDiv.style.boxShadow = "0px 9px 19px 0px rgba(0, 0, 0, 0.10), 0px 35px 35px 0px rgba(0, 0, 0, 0.09), 0px 79px 48px 0px rgba(0, 0, 0, 0.05), 0px 141px 56px 0px rgba(0, 0, 0, 0.01), 0px 220px 62px 0px rgba(0, 0, 0, 0.00)";

    // Append the new div to the body
    document.body.appendChild(newDiv);

    // After 2 seconds, start fading out the message
    setTimeout(function() {
        newDiv.style.transition = "opacity 1s ease-in-out";
        newDiv.style.opacity = "0";
    }, 2000);

    // After the fade out, remove the div from the body
    setTimeout(function() {
        document.body.removeChild(newDiv);
    }, 3000);
}

    // Keyboard event listeners
    let ctrlDown = false;
    let lastRequest = null;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Control') {
            ctrlDown = true;
        }
        if (e.key === '/' && ctrlDown) {
            const activeElement = document.activeElement;
            const isInputField = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;
            if (!isInputField) {
                const selection = window.getSelection().toString();
                if (selection !== lastRequest) {
                    lastRequest = selection;
                    handleKeyDown(e);
                }
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Control') {
            ctrlDown = false;
        }
    });

function handleKeyDown(e) {
    if (e.key === '/') {
        e.preventDefault(); // Prevent the default action for "/" key
        const selectedText = window.getSelection().toString().trim();
        const wordCount = selectedText.split(/\s+/).length;

        // Only proceed if 1 to 3 words are selected
        if (wordCount >= 1  && wordCount <= 4) {
            const definitionBox = document.querySelector('.avagama-wrapper');
            if (!definitionBox) {
                document.body.insertAdjacentHTML('beforeend', definitionBoxHTML);
            }
            const definitionBoxUpdated = document.querySelector('.avagama-wrapper');
            if (definitionBoxUpdated) {
                definitionBoxUpdated.style.display = 'flex';
                definitionBoxUpdated.style.opacity = 1;
            }

            // Set the selected text to the #d-word element immediately
            const dWordElement = document.getElementById('d-word');
            if (dWordElement) {
                dWordElement.textContent = selectedText;
            }

            // Find the paragraph content around the selected text
            let paragraphContent = "No paragraph content";
            if (selectedText) {
                const anchorNode = window.getSelection().anchorNode;
                let parentElement = anchorNode.nodeType === 3 ? anchorNode.parentNode : anchorNode;
                while (parentElement && !["P", "DIV", "ARTICLE", "SECTION", "BODY"].includes(parentElement.nodeName)) {
                    parentElement = parentElement.parentNode;
                }
                paragraphContent = parentElement ? parentElement.textContent : "Paragraph not found.";
            }

            // Now call fetchDefinition with the selected text and its context
            fetchDefinition(selectedText, paragraphContent);
            console.log('Avagama Selected text:', selectedText);
            console.log('Avagama Paragraph content:', paragraphContent);
        } else {
            console.log('Avagama Selection does not meet the criteria.');
            showMessage();
        }
    }
}

// document.addEventListener('keydown', handleKeyDown);

document.addEventListener('click', (e) => {
    if (e.target.id === 'avagama-close') {
        const definitionBox = document.querySelector('.avagama-wrapper');
        definitionBox.style.opacity = 0;
        definitionBox.style.display = 'none';
        setTimeout(() => definitionBox.classList.add('avagama-hide'), 500);
    }
});

console.log('Clean Avagama is running is till end...');


