// Console test to trigger queue generation
// Run this in the browser console

async function triggerQueueGeneration() {
  console.log("🧪 Triggering queue generation...");

  // Try to access the weather music hook via React DevTools or context
  if (
    window.React &&
    window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
  ) {
    console.log(
      "React internals found, attempting to trigger queue generation...",
    );
  }

  // Alternative: trigger through button click if available
  const generateButton =
    document.querySelector('button[contains("Generate")]') ||
    document.querySelector('button[aria-label*="generate"]') ||
    document.querySelector('button:contains("Generate Queue")');

  if (generateButton) {
    console.log("Found generate button, clicking...");
    generateButton.click();
  } else {
    console.log("No generate button found");
  }

  // Check for queue cards
  const queueCards = document.querySelectorAll('[class*="queue"]');
  console.log(`Found ${queueCards.length} queue-related elements`);

  // Check for album art images
  const albumImages = document.querySelectorAll(
    'img[alt*="album"], img[src*="scdn.co"], img[src*="placeholder"]',
  );
  console.log(`Found ${albumImages.length} album art images`);

  albumImages.forEach((img, i) => {
    console.log(`Image ${i + 1}: ${img.src.substring(0, 50)}...`);
  });
}

triggerQueueGeneration();
