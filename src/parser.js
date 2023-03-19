const psl = require('./psl.min.js')
function categorizeCookies(cookies, hostname) {
  const firstParty = [];
  const thirdParty = [];

  const parsedHostname = psl.parse(hostname);
  const rootDomain = parsedHostname.domain;

  cookies.forEach((cookie) => {
    const domainMatch = cookie.domain.replace(/^\./, "");
    const parsedDomain = psl.parse(domainMatch);

    if (parsedDomain.domain === rootDomain) {
      firstParty.push(cookie);
    } else {
      thirdParty.push(cookie);
    }
  });

  return { firstParty, thirdParty };
}

function displayCookies(cookies, hostname) {
  const container = document.getElementById("cookieList");
  container.innerHTML = "";

  const categories = ["firstParty", "thirdParty"];
  const categorizedCookies = categorizeCookies(cookies, hostname);

  categories.forEach((category) => {
    const cookies = categorizedCookies[category];

    if (!cookies) return;

    if (cookies.length > 0) {
      const categoryElement = document.createElement("h2");
      categoryElement.textContent = `${category} Cookies`;
      container.appendChild(categoryElement);

      const list = document.createElement("ul");
      cookies.forEach((cookie) => {
        const item = document.createElement("li");
        item.textContent = `${cookie.name}: ${cookie.value}`;
        list.appendChild(item);
      });

      container.appendChild(list);
    }
  });
}

function cookieJson(cookies, hostname) {
  const container = document.getElementById('cookieList');
  container.innerHTML = '';

  const categories = ['firstParty', 'thirdParty'];
  const categorizedCookies = categorizeCookies(cookies, hostname);

  let cookiesJson = {};

  categories.forEach((category) => {
    const cookies = categorizedCookies[category];
    cookiesJson[category] = [];

    if (!cookies) {
      return cookiesJson;
    }

    if (cookies.length > 0) {
      cookies.forEach((cookie) => {
        cookiesJson[category].push( cookie );
      });
    }
  });

  return cookiesJson;
}

function loadCookies() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const hostname = new URL(url).hostname;

    chrome.cookies.getAll({}, (cookies) => {
      console.log(cookies);
      displayCookies(cookies, hostname);
    });
  });
}

document.addEventListener("DOMContentLoaded", loadCookies);
