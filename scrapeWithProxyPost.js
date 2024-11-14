const axios = require('axios');

async function scrapeWithProxy(url, proxy = null) {
  try {
    // Axios request configuration
    const config = {
      maxRedirects: 0, // Prevent automatic redirects to capture the Location header
      validateStatus: status => status >= 200 && status < 400, // Allow redirect status codes
    };

    // Add proxy if provided
    if (proxy) {
      config.proxy = {
        host: proxy.host,
        port: proxy.port,
        auth: proxy.auth ? { username: proxy.auth.username, password: proxy.auth.password } : undefined,
      };
    }

    // Perform GET request
    const response = await axios.get(url, config);

    // Check if the Location header is present
    if (response.headers.location) {
      return response.headers.location;
    } else {
      return 'No Location header found.';
    }
  } catch (error) {
    if (error.response && error.response.headers.location) {
      // Capture Location header from redirect response
      return error.response.headers.location;
    } else {
      console.error('Error fetching the URL:', error.message);
      return null;
    }
  }
}

// Example usage
(async () => {
  const url = 'https://www.idealo.de/relocator/relocate?categoryId=2020&offerKey=f758d39b89cdb404a20f56777a8477f7&offerListId=203873382-0D0DE59EF5AE3077082DD11BA5163763&pos=3&price=15.38&productid=203873382&sid=12041&type=offer';
  const locationHeader = await scrapeWithProxy(url);
  console.log('Location Header:', locationHeader);
})();
