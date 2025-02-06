// Add at the top with other declarations
let collectedPosts = new Set();
let isExtensionEnabled = true;
let keywords = new Set(['kill', 'abuse', 'assault', 'torture', 'sexual']);
let hoverTimers = new WeakMap();

// Updated regex for filtering suspicious content
let suspiciousContentRegex = /\b(2g1c|2\s?girls\s?1\s?cup|acrotomophilia|alabama\s?hot\s?pocket|alaskan\s?pipeline|anal|anilingus|anus|apeshit|arsehole|ass|asshole|assmunch|auto\s?erotic|autoerotic|babeland|baby\s?batter|baby\s?juice|ball\s?gag|ball\s?gravy|ball\s?kicking|ball\s?licking|ball\s?sack|ball\s?sucking|bangbros|bareback|barely\s?legal|barenaked|bastard|bastardo|bastinado|bbw|bdsm|beaner|beaners|beaver\s?cleaver|beaver\s?lips|bestiality|big\s?black|big\s?breasts|big\s?knockers|big\s?tits|bimbos|birdlock|bitch|bitches|black\s?cock|blonde\s?action|blonde\s?on\s?blonde\s?action|blowjob|blow\s?job|blow\s?your\s?load|blue\s?waffle|blumpkin|bollocks|bondage|boner|boob|boobs|booty\s?call|brown\s?showers|brunette\s?action|bukkake|bulldyke|bullet\s?vibe|bullshit|bung\s?hole|bunghole|busty|butt|buttcheeks|butthole|camel\s?toe|camgirl|camslut|camwhore|carpet\s?muncher|carpetmuncher|chocolate\s?rosebuds|circlejerk|cleveland\s?steamer|clit|clitoris|clover\s?clamps|clusterfuck|cock|cocks|coprolagnia|coprophilia|cornhole|coon|coons|creampie|cum|cumming|cunnilingus|cunt|darkie|date\s?rape|daterape|deep\s?throat|deepthroat|dendrophilia|dick|dildo|dingleberry|dingleberries|dirty\s?pillows|dirty\s?sanchez|doggie\s?style|doggiestyle|doggy\s?style|doggystyle|dog\s?style|dolcett|domination|dominatrix|dommes|donkey\s?punch|double\s?dong|double\s?penetration|dp\s?action|dry\s?hump|dvda|eat\s?my\s?ass|ecchi|ejaculation|erotic|erotism|escort|eunuch|faggot|fecal|felch|fellatio|feltch|female\s?squirting|femdom|figging|fingerbang|fingering|fisting|foot\s?fetish|footjob|frotting|fuck|fuck\s?buttons|fuckin|fucking|fucktards|fudge\s?packer|fudgepacker|futanari|gang\s?bang|gay\s?sex|genitals|giant\s?cock|girl\s?on|girl\s?on\s?top|girls\s?gone\s?wild|goatcx|goatse|god\s?damn|gokkun|golden\s?shower|goodpoop|goo\s?girl|goregasm|grope|group\s?sex|g-spot|guro|hand\s?job|handjob|hard\s?core|hardcore|hentai|homoerotic|honkey|hooker|hot\s?carl|hot\s?chick|how\s?to\s?kill|how\s?to\s?murder|huge\s?fat|humping|incest|intercourse|jack\s?off|jail\s?bait|jailbait|jelly\s?donut|jerk\s?off|jigaboo|jiggaboo|jiggerboo|jizz|juggs|kike|kinbaku|kinkster|kinky|knobbing|leather\s?restraint|leather\s?straight\s?jacket|lemon\s?party|lolita|lovemaking|make\s?me\s?come|male\s?squirting|masturbate|menage\s?a\s?trois|milf|missionary\s?position|motherfucker|mound\s?of\s?venus|mr\s?hands|muff\s?diver|muffdiving|nambla|nawashi|negro|neonazi|nigga|nigger|nig\s?nog|nimphomania|nipple|nipples|nsfw\s?images|nude|nudity|nympho|nymphomania|octopussy|omorashi|one\s?cup\s?two\s?girls|one\s?guy\s?one\s?jar|orgasm|orgy|paedophile|paki|panties|panty|pedobear|pedophile|pegging|penis|phone\s?sex|piece\s?of\s?shit|pissing|piss\s?pig|pisspig|playboy|pleasure\s?chest|pole\s?smoker|ponyplay|poof|poon|poontang|punany|poop\s?chute|poopchute|porn|porno|pornography|prince\s?albert\s?piercing|pthc|pubes|pussy|queaf|queef|quim|raghead|raging\s?boner|rape|raping|rapist|rectum|reverse\s?cowgirl|rimjob|rimming|rosy\s?palm|rosy\s?palm\s?and\s?her\s?5\s?sisters|rusty\s?trombone|sadism|santorum|scat|schlong|scissoring|semen|sex|sexo|sexy|shaved\s?beaver|shaved\s?pussy|shemale|shibari|shit|shitblimp|shitty|shota|shrimping|skeet|slanteye|slut|s&m|smut|snatch|snowballing|sodomize|sodomy|spic|splooge|splooge\s?moose|spooge|spread\s?legs|spunk|strap\s?on|strapon|strappado|strip\s?club|style\s?doggy|suck|sucks|suicide\s?girls|sultry\s?women|swastika|swinger|tainted\s?love|taste\s?my|tea\s?bagging|threesome|throating|tied\s?up|tight\s?white|tit|tits|titties|titty|tongue\s?in\s?a|topless|tosser|towelhead|tranny|tribadism|tub\s?girl|tubgirl|tushy|twat|twink|twinkie|two\s?girls\s?one\s?cup|undressing|upskirt|urethra\s?play|urophilia|vagina|venus\s?mound|vibrator|violet\s?wand|vorarephilia|voyeur|vulva|wank|wetback|wet\s?dream|white\s?power|wrapping\s?men|wrinkled\s?starfish|xx|xxx|yaoi|yellow\s?showers|yiffy|zoophilia|🖕)\b/i;

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

// Main detection function - Updated with regex check
function detectSuspiciousPosts() {
  const posts = document.querySelectorAll('div[data-post], article, .post');

  posts.forEach(post => {
    const text = post.textContent.toLowerCase();
    // Create an array of detected keywords in the post
    const detectedKeywords = Array.from(keywords).filter(keyword => 
      text.includes(keyword.toLowerCase())
    );

    // Check for regex matches
    const regexMatches = text.match(suspiciousContentRegex);

    // Check if suspicious keywords or regex matches are found
    if (detectedKeywords.length > 0 || regexMatches) {
      post.style.border = '2px solid red';
      post.dataset.suspicious = 'true';

      // Prepare the post data
      const postData = {
        text: post.textContent.trim().substring(0, 500), // Limit length
        url: window.location.href,
        timestamp: new Date().toISOString(),
        detectedKeywords: detectedKeywords,
        regexMatches: regexMatches
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

// Event handler functions
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