let cookies: chrome.cookies.Cookie[];
let deletedCookie = "EMTY";
fetchCookies()
console.log("TESTHELLOchookies")



document.getElementById("buttonsDelete").addEventListener("click", deleteFirstOne);
document.getElementById("buttonsAdd").addEventListener("click", addFirstOne);
document.getElementById("buttonsPrintDeleted").addEventListener("click", printDeleteOne);

document.getElementById("buttonsPrintAll").addEventListener("click", printAll);
document.getElementById("buttonsDELETEALL").addEventListener("click", deleteAllTEST);


function printAll() {
 //   var source = document.getElementById('source').value;
    //document.getElementById("result").innerHTML = source;
fetchCookies()
    document.getElementById("result").innerHTML = JSON.stringify(cookies)
}

function deleteFirstOne(){
//deletedCookie = <string>cookies.pop()
}
function fetchCookies(){
  console.log("fetchCookies")
  chrome.cookies.getAll({
  }, function (theCookies) {
    cookies = theCookies
    console.log(cookies)
  });
}
function printDeleteOne(){
  console.log("printDeleteOne")
  console.log(cookies[0].name)
console.log(deletedCookie)
  document.getElementById("test").innerHTML = cookies[0].name
}
function addFirstOne(){

}

function deleteAllTEST(){
  console.log("DELETE")
  chrome.cookies.remove({"url": "https://"+ cookies[0].domain + cookies[0].path, "name": cookies[0].name}, function(deleted_cookie) { console.log(deleted_cookie); });
  fetchCookies()
}



