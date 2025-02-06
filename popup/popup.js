document.addEventListener('DOMContentLoaded', () => {
    // Load current settings
    chrome.storage.local.get(['enabled', 'keywords'], (result) => {
      document.getElementById('toggle').checked = result.enabled !== undefined ? result.enabled : true;
      document.getElementById('keywords').value = result.keywords ? result.keywords.join('\n') : [
        'kill', 'abuse', 'assault', 'torture', 'sexual'
      ].join('\n');
    });
  
    // Save settings
    document.getElementById('save').addEventListener('click', () => {
      const enabled = document.getElementById('toggle').checked;
      const keywords = document.getElementById('keywords').value
        .split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0);
  
      chrome.storage.local.set({ enabled, keywords }, () => {
        alert('Settings saved!');
      });
    });
  });