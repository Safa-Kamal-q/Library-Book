let loginForm=document.querySelector('.login-form-containers');

document.querySelector(".login-Btn").onclick= ()=>
{
    loginForm.classList.toggle('active');
}
 
document.querySelector(".close").onclick = () =>
{
    loginForm.classList.remove('active');
}