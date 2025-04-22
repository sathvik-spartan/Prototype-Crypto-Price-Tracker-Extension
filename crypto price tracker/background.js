// EmailJS config directly inside background.js
const EMAILJS_CONFIG = {
  service_id: "service_yof1xum",
  template_id: "template_j37gubi",
  user_id: "u6uiYp-d_myxQ8efW"
};

// API call logic
const fetchCryptoPrice = async (coin) => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
    const data = await response.json();
    return data[coin].usd;
  } catch (error) {
    console.error("Failed to fetch crypto price:", error);
    return null;
  }
};

// EmailJS integration
const sendEmail = async (coin, price) => {
  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.service_id,
        template_id: EMAILJS_CONFIG.template_id,
        user_id: EMAILJS_CONFIG.user_id,
        template_params: {
          coin_name: coin,
          current_price: price
        }
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Email sent successfully:", data);
    } else {
      console.error("❌ Error sending email:", data);
    }
  } catch (error) {
    console.error("❌ EmailJS request failed:", error);
  }
};

// Example: Monitor BTC price every minute
setInterval(async () => {
  const coin = "bitcoin";
  const price = await fetchCryptoPrice(coin);

  if (price && price > 60000) {
    console.log(`💰 ${coin.toUpperCase()} is above threshold: $${price}`);
    sendEmail(coin, price);
  } else {
    console.log(`📉 ${coin.toUpperCase()} is below threshold: $${price}`);
  }
}, 60000); // Check every 1 minute