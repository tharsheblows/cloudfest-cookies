document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('button').addEventListener('click', main);
});
function main() {
 //   var source = document.getElementById('source').value;
    //document.getElementById("result").innerHTML = source;
    document.getElementById("result").innerHTML = "TEST"
    let cookies;
    chrome.cookies.getAll({
    }, function (theCookies) {
        cookies = theCookies
        console.log(cookies)
    });
    let json = JSON.stringify(cookies)
    document.getElementById("result").innerHTML = json

}