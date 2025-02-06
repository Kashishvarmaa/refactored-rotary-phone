// Listen for messages to save posts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SAVE_POST') {
    // Get current collected posts from local storage
    chrome.storage.local.get(['collectedPosts'], (result) => {
      const posts = result.collectedPosts || [];
      
      // Add new post to the collection
      posts.push(message.data);
      
      // Save the latest 1000 posts in local storage
      chrome.storage.local.set({ collectedPosts: posts.slice(-1000) });
    });
  }
});

// Handle extension installation event
chrome.runtime.onInstalled.addListener(() => {
  console.log("Twitter Scraper Extension Installed");
});

// Listen for changes in storage and send notifications
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.suspiciousTweets) {
    // Get the new tweet count after change
    let tweetCount = changes.suspiciousTweets.newValue.length;
    
    // Create a notification when suspicious tweets are detected
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",  // Make sure the icon exists in the extension folder
      title: "Suspicious Tweets Detected",
      message: `Found ${tweetCount} abusive tweets.`,
      priority: 2
    });
  }
});