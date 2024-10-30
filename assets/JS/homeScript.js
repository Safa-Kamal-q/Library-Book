let loginForm=document.querySelector('.login-form-containers');

document.querySelector(".login-Btn").onclick= ()=>
{
    loginForm.classList.toggle('active');
}
 
document.querySelector(".close").onclick = () =>
{
    loginForm.classList.remove('active');
}

let body=document.querySelector("body");
let darck=document.querySelector(".darck");
let darckBtn=document.querySelector(".darckBtn");
function toDarck(){

    const buttonImage = document.getElementById("buttonImage");
    const image1 = "assets/images/icons/moon.png"; 
     const image2 = "assets/images/icons/sun.png"; 
     buttonImage.src = buttonImage.src.includes(image1) ? image2 : image1;

    body.classList.toggle("darck");

   
}
darckBtn.onclick=toDarck;