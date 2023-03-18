
let cookies;
let deletedCookie = "EMTY";
chrome.cookies.getAll({
}, function (theCookies) {
    cookies = theCookies
});
// console.log("TEST")

async function sendForCookies() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  const response = await chrome.runtime.sendMessage({tabId: tab.id, action: 'getCookies'});
  // do something with response here, not outside the function
  const url = tab.url;
  const hostname = new URL(url).hostname;
  const cookies = response.cookies;

  return displayCookies(cookies, hostname );
}

function displayCookies(cookies, hostname) {
  const container = document.getElementById("cookieList");
  container.innerHTML = "";

  const categories = ["firstParty", "thirdParty"];
  console.log(cookies)
  const categorizedCookies = categorizeCookies(cookies, hostname);

  categories.forEach((category) => {
    const cookies = categorizedCookies[category];
    console.log(cookies)

    if (!cookies) return;

    if (cookies.length > 0) {
      const categoryElement = document.createElement("h2");
      categoryElement.textContent = `${category} Cookies`;
      container.appendChild(categoryElement);


      cookies.forEach( (cookie) => {
        const list = document.createElement('ul');
        for ( const c in cookie ) {
          const item = document.createElement("li");
          item.textContent = `${c}: ${cookie[c]}`;
          list.appendChild(item);
        }
         container.appendChild(list);
      });

    }
  });
}

function categorizeCookies(cookies, hostname) {
  const firstParty = [];
  const thirdParty = [];

  cookies.forEach((cookie) => {
    const cookieDomain = new URL(cookie.url).hostname;

    if (cookieDomain === hostname) {
      firstParty.push(cookie);
    } else {
      thirdParty.push(cookie);
    }
  });

  return { firstParty, thirdParty };
}


document.getElementById("buttonsDelete").addEventListener("click", deleteFirstOne);
document.getElementById("buttonsAdd").addEventListener("click", addFirstOne);
document.getElementById("sendForCookies").addEventListener('click', sendForCookies);
document.getElementById("buttonsPrintAll").addEventListener("click", printAll);


function printAll() {
 //   var source = document.getElementById('source').value;
    //document.getElementById("result").innerHTML = source;
    console.log(cookies)
    document.getElementById("result").innerHTML = JSON.stringify(cookies)
}

function deleteFirstOne(){
deletedCookie = cookies.pop()
}
function printDeleteOne(){
console.log(deletedCookie)
}
function addFirstOne(){

}
