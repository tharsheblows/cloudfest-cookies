
let cookies;
let deletedCookie = "EMTY";
chrome.cookies.getAll({
}, function (theCookies) {
    cookies = theCookies
});
console.log("TEST")



document.getElementById("buttonsDelete").addEventListener("click", deleteFirstOne);
document.getElementById("buttonsAdd").addEventListener("click", addFirstOne);
document.getElementById("buttonsPrintDeleted").addEventListener("click", printDeleteOne);



document.getElementById("buttonsPrintAll").addEventListener("click", printAll);

function myFunction(){
    console.log('asd');
}

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