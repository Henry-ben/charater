const textInput = document.getElementById("textInput");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const sentenceCount = document.getElementById("sentenceCount");
const letterDensity = document.getElementById("letterDensity");
const excludeSpaces = document.getElementById("excludeSpaces");
const enableLimit = document.getElementById("enableLimit");
const charLimit = document.getElementById("charLimit");
const limitContainer = document.getElementById("limitContainer");
const warningMessage = document.getElementById("warningMessage");
const runtimeDisplay = document.getElementById("runtimeDisplay");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");



function updateReadingTime() {
    let text = textInput.value.trim();
    let words = text.split(/\s+/).filter(word => word.length > 0);
    
    let wordsPerMinute = 200; // Average reading speed (words per minute)
    let readingTime = words.length / wordsPerMinute; // Time in minutes

    let readingTimeMs = Math.ceil(readingTime ); // Convert to Minutes

    document.getElementById("runtimeDisplay").textContent = readingTimeMs;
}

function updateCharCount() {
    let startTime = performance.now(); // Start time

    let text = textInput.value;

    // If checkbox is checked, remove spaces before counting
    let charsWithoutSpaces = excludeSpaces.checked ? text.replace(/\s/g, "") : text;
    
    // Update the displayed count
    charCount.textContent = charsWithoutSpaces.length;

    updateReadingTime();
        // Check if limit is enabled
    let limit = enableLimit.checked ? parseInt(charLimit.value) || Infinity : Infinity;

    // Enforce limit (if exceeded, trim text)
    if (charsWithoutSpaces.length > limit) {
        textInput.value = text.slice(0, limit); // Trim the text
        charsWithoutSpaces = textInput.value.replace(/\s/g, ""); // Recalculate without spaces
       alert(warningMessage.style.display = "Exceed limit") ; // Show warning
    } else {
        warningMessage.style.display = "none"; // Hide warning if under limit
    }

    // Update character count display
    charCount.textContent = charsWithoutSpaces.length;


    let endTime = performance.now(); // End time
    let runtime = (endTime - startTime).toFixed(4); // Calculate time and round to 4 decimal places

    
    runtimeDisplay.textContent = `Runtime: ${runtime} min`; // Display runtime
    
}

    // Function to enable/disable the limit input field
    enableLimit.addEventListener("change", () => {
        if (enableLimit.checked) {
            limitContainer.style.display = "block";
            charLimit.removeAttribute("disabled");
        } else {
            charLimit.setAttribute("disabled", true);
            limitContainer.style.display = "none";
            warningMessage.style.display = "none"; // Hide warning if limit is disabled
        }
        updateCharCount(); // Recalculate when checkbox state changes
    });

    // Listen for input changes in textarea
textInput.addEventListener("input", updateCharCount);

    // Listen for checkbox and limit input changes
excludeSpaces.addEventListener("change", updateCharCount);
charLimit.addEventListener("input", updateCharCount);

// Listen for input changes in textarea
textInput.addEventListener("input", updateCharCount);

// Listen for checkbox changes
excludeSpaces.addEventListener("change", updateCharCount);

    textInput.addEventListener("input", () => {
        let text = textInput.value;

    charCount.textContent = text.length;
    
    let words = text.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = words.length;

    let sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    sentenceCount.textContent = sentences.length;

    let letterMap = {};
    let totalLetters = 0
    text.replace(/[^a-zA-Z]/g, "").split("").forEach(letter => {
        letter = letter.toUpperCase();
        letterMap[letter] = (letterMap[letter] || 0) + 1;
        totalLetters++;
    });

    let sortedLetters = Object.entries(letterMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
  

    letterDensity.innerHTML = sortedLetters.map(([letter, count]) =>{
        let percentage = ((count / text.length) * 100).toFixed(4); // Calculate percentage
        let barWidth = percentage + "%"; // Set bar width dynamically

    return `
        <div class="letter-row">
            <span class="letter">${letter}</span>
            <div class="bar-container">
                <div class="bar" style="width: ${barWidth}"> </div>
            </div>
            <span class="count">${count} (${percentage}%)</span>
        </div>
        `;
    }).join("");

})  ;

function loadTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
        themeIcon.src = "image/icon-moon.svg"; // Moon icon for light mode
        themeText.textContent = "light";
    } else {
        document.body.classList.remove("light-theme");
        themeIcon.src = "image/icon-sun.svg"; // Sun icon for dark mode
        themeText.textContent = "Dark";
    }
}

// Load the saved theme when the page loads
loadTheme();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    if (document.body.classList.contains("light-theme")) {
        themeIcon.src = "image/icon-moon.svg"; // Moon icon for light mode
        themeText.textContent = "Light";
        localStorage.setItem("theme", "light"); // Save theme preference
    } else {
        themeIcon.src = "image/icon-sun.svg"; // Sun icon for dark mode
        themeText.textContent = "Dark";
        localStorage.setItem("theme", "dark"); // Save theme preference
    }
});