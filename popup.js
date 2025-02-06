// Function to download collected data as CSV
function downloadCSV(data) {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Timestamp,URL,Keywords,Content\n"
    + data.map(post => 
        `"${post.timestamp}","${post.url}","${post.detectedKeywords.join(',')}","${post.text.replace(/"/g, '""')}"`
      ).join("\n");
  
  const encodedUri = encodeURI(csvContent);
  chrome.downloads.download({
    url: encodedUri,
    filename: 'suspicious_posts.csv',
    saveAs: true
  });
}

// Event listener for downloading CSV
document.getElementById('download').addEventListener('click', () => {
  chrome.storage.local.get(['collectedPosts'], (result) => {
    const data = result.collectedPosts || [];
    if (data.length > 0) {
      downloadCSV(data);
    } else {
      alert('No suspicious posts found yet!');
    }
  });
});

// Event listener for clearing collected data
document.getElementById('clear').addEventListener('click', () => {
  chrome.storage.local.remove('collectedPosts', () => {
    alert('Data cleared successfully!');
  });
});

// Handling suspicious posts display and JSON download
document.addEventListener("DOMContentLoaded", () => {
  let list = document.getElementById("tweetsList");

  chrome.storage.local.get("suspiciousTweets", data => {
    let tweets = data.suspiciousTweets || [];
    
    tweets.forEach(tweet => {
        let li = document.createElement("li");
        li.textContent = tweet.text;
        list.appendChild(li);
    });

    // Download JSON when button is clicked
    document.getElementById("downloadBtn").addEventListener("click", () => {
      let jsonStr = JSON.stringify(tweets, null, 2);
      let blob = new Blob([jsonStr], { type: "application/json" });
      let url = URL.createObjectURL(blob);
      
      let a = document.createElement("a");
      a.href = url;
      a.download = "suspicious_tweets.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
});