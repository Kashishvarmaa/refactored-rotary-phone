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

// Main detection function
function detectSuspiciousPosts() {
  const posts = document.querySelectorAll('div[data-post], article, .post');
  
  posts.forEach(post => {
    const text = post.textContent.toLowerCase();
    const isSuspicious = Array.from(keywords).some(keyword => 
      text.includes(keyword.toLowerCase())
    );

    if (isSuspicious) {
      post.style.border = '2px solid red';
      post.dataset.suspicious = 'true';

      // Hover handling
      post.addEventListener('mouseover', handleMouseOver);
      post.addEventListener('mouseout', handleMouseOut);
      
      // Click handling
      post.addEventListener('click', handleClick);
    }
  });
}

// Event handlers
function handleMouseOver(e) {
  if (!isExtensionEnabled) return;
  const post = e.currentTarget;
  hoverTimers.set(post, setTimeout(() => {
    showAlert('Warning: This post contains suspicious content!');
  }, 3000));
}

function handleMouseOut(e) {
  const post = e.currentTarget;
  clearTimeout(hoverTimers.get(post));
}

function handleClick(e) {
  if (!isExtensionEnabled) return;
  if (e.currentTarget.dataset.suspicious) {
    e.preventDefault();
    showAlert('Warning: This post was flagged as potentially dangerous!');
  }
}

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