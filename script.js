const moods = [
    { text: "chlo abhi kro", emoji: "😋" },
    { text: "mt kr phir", emoji: "😉" },
    { text: "Tum horny ni hote", emoji: "😂😂😂" },
    { text: "Shrarti to m bhut hu", emoji: "😛" },
    { text: "Dekti hu pass ho ki", emoji: "💅" }
];

const resultBox = document.getElementById('resultBox');
const emojiDisplay = document.getElementById('emojiDisplay');
const moodText = document.getElementById('moodText');
const confValue = document.getElementById('confValue');
const confProgress = document.getElementById('confProgress');
const moodBtn = document.getElementById('moodBtn');
const btnText = moodBtn.querySelector('.btn-text');
const blobs = document.querySelectorAll('.blob');

let isAnalyzing = false;
let clickCount = 0;

function typeWriter(text, element, speed, callback) {
    element.innerHTML = '<span id="tw-text"></span><span class="cursor"></span>';
    const textSpan = document.getElementById('tw-text');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            textSpan.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            setTimeout(callback, 800);
        }
    }
    type();
}

function generateMood() {
    if (isAnalyzing) return;
    
    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback for mobile
    
    isAnalyzing = true;
    clickCount++;
    
    moodBtn.classList.add('analyzing');
    moodBtn.style.pointerEvents = 'none';
    btnText.innerText = 'Analyzing...';
    
    // Hide current result
    resultBox.classList.remove('show');
    resultBox.classList.remove('shake-anim');
    confProgress.style.width = '0%';
    
    // Simulate AI "Processing"
    setTimeout(() => {
        let displayData = { text: "", emoji: "" };
        let targetConf = 0;
        let isFinal = false;

        // Reset classes
        moodText.className = "";
        confValue.className = "highlight";
        confProgress.style.backgroundColor = "var(--accent)";

        if (clickCount < 4) {
            // Normal behavior
            displayData = moods[Math.floor(Math.random() * moods.length)];
            targetConf = Math.floor(Math.random() * (98 - 85 + 1)) + 85;
            
            emojiDisplay.innerText = displayData.emoji;
            moodText.innerText = displayData.text;
            
        } else if (clickCount === 4) {
            // Glitch Reveal + Shake
            displayData.text = "wait... scanning our Insta DMs";
            displayData.emoji = "🧐";
            targetConf = 12;
            
            emojiDisplay.innerText = displayData.emoji;
            moodText.className = "glitch-text";
            moodText.innerText = displayData.text;
            
            resultBox.classList.add('shake-anim');
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]); // Glitch haptics
            
            // Color shift blobs and progress bar to warning orange
            blobs.forEach(b => b.style.background = '#fbbf24');
            confProgress.style.backgroundColor = '#fbbf24';
            
        } else if (clickCount >= 5) {
            // Final Reveal - "Trouble" confirmed
            displayData.emoji = "👑";
            targetConf = 100;
            isFinal = true;
            
            emojiDisplay.innerText = displayData.emoji;
            moodText.className = "final-text";
            confValue.style.color = "var(--crimson)";
            
            // Color shift blobs and progress bar to crimson
            blobs.forEach(b => b.style.background = '#ff0055');
            confProgress.style.backgroundColor = '#ff0055';
            document.body.style.backgroundColor = '#1a050d';
            
            if (navigator.vibrate) navigator.vibrate(200); // Final heavy haptic
            
            const finalMessage = "System override: 'Trouble' confirmed. You officially own my DMs right now";
            typeWriter(finalMessage, moodText, 40, () => {
                const cursor = document.querySelector('.cursor');
                if (cursor) cursor.style.display = 'none';
            });
        }

        if (!isFinal) {
            animateValue(confValue, 0, targetConf, 800);
            confProgress.style.width = targetConf + '%';
            resultBox.classList.add('show');
            
            setTimeout(() => {
                moodBtn.classList.remove('analyzing');
                btnText.innerText = 'Check Mood';
                moodBtn.style.pointerEvents = 'all';
                isAnalyzing = false;
            }, 800); // Wait for progress animation slightly to release lock
        } else {
            animateValue(confValue, 0, targetConf, 800);
            confProgress.style.width = '100%';
            resultBox.classList.add('show');
            
            moodBtn.classList.remove('analyzing');
            btnText.innerText = 'Connection Locked';
            moodBtn.disabled = true;
        }
    }, 1000); // 1 second AI scan time
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutQuart
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        obj.innerHTML = Math.floor(easeProgress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initial state entrance animation
window.onload = () => {
    const card = document.querySelector('.card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
};

// Bind the event listener to the button
moodBtn.addEventListener('click', generateMood);

