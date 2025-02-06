// Add at the top with other declarations
let collectedPosts = new Set();
let isExtensionEnabled = true;
let keywords = new Set(['kill', 'abuse', 'assault', 'torture', 'sexual']);
let hoverTimers = new WeakMap();

// Load settings from storage
chrome.storage.local.get(['enabled', 'keywords'], (result) => {
  isExtensionEnabled = result.enabled !== undefined ? result.enabled : true;
  if (result.keywords) keywords = new Set(result.keywords);
});

// Watch for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) isExtensionEnabled = changes.enabled.newValue;
  if (changes.keywords) keywords = new Set(changes.keywords.newValue);
});

// Main detection function - Fixed version
function detectSuspiciousPosts() {
  const posts = document.querySelectorAll('div[data-post], article, .post');

  posts.forEach(post => {
    const text = post.textContent.toLowerCase();
    // Create an array of detected keywords in the post
    const detectedKeywords = Array.from(keywords).filter(keyword => 
      text.includes(keyword.toLowerCase())
    );

    // Check if suspicious keywords are found
    if (detectedKeywords.length > 0) {
      post.style.border = '2px solid red';
      post.dataset.suspicious = 'true';

      // Prepare the post data
      const postData = {
        text: post.textContent.trim().substring(0, 500), // Limit length
        url: window.location.href,
        timestamp: new Date().toISOString(),
        detectedKeywords: detectedKeywords
      };

      // Log the post data to the console
      console.log('Suspicious Post Detected:', postData);

      const postHash = btoa(encodeURIComponent(JSON.stringify(postData)));
      if (!collectedPosts.has(postHash)) {
        collectedPosts.add(postHash);
        chrome.runtime.sendMessage({
          type: 'SAVE_POST',
          data: postData
        });
      }

      // Event handlers
      post.addEventListener('mouseover', handleMouseOver);
      post.addEventListener('mouseout', handleMouseOut);
      post.addEventListener('click', handleClick);
    }
  });
}

// Event handler functions (You can customize these)
function handleMouseOver(event) {
  event.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
  if (!isExtensionEnabled) return;
  const post = event.currentTarget;
  hoverTimers.set(post, setTimeout(() => {
    showAlert('Warning: This post contains suspicious content!');
  }, 3000));
}

function handleMouseOut(event) {
  event.currentTarget.style.backgroundColor = '';
  const post = event.currentTarget;
  clearTimeout(hoverTimers.get(post));
}

function handleClick(event) {
  const post = event.currentTarget;
  if (!isExtensionEnabled) return;
  if (post.dataset.suspicious) {
    showAlert('Warning: This post was flagged as potentially dangerous!');
  }
}

// Additional code for managing collected posts and sending alerts can go here
// For example, listening to messages to show notifications
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'ALERT_USER') {
    alert('Suspicious activity detected!');
  }
});

// Alert system
function showAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.style.position = 'fixed';
  alertBox.style.bottom = '20px';
  alertBox.style.right = '20px';
  alertBox.style.padding = '15px';
  alertBox.style.background = '#ff4444';
  alertBox.style.color = 'white';
  alertBox.style.borderRadius = '5px';
  alertBox.style.zIndex = '9999';
  alertBox.textContent = message;
  
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}

// Dynamic content monitoring
const observer = new MutationObserver(mutations => {
  if (isExtensionEnabled) detectSuspiciousPosts();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
});

// Initial detection
detectSuspiciousPosts();