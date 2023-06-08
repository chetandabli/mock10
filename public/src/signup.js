let form = document.getElementById("signup");

form.onsubmit = async(e)=>{
    e.preventDefault()
    if(form.username.value && form.email.value && form.password.value){
        let res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: form.username.value,
                email: form.email.value,
                password: form.password.value
            })
        });

        res = await res.json();
        if(res.msg == "please verify email using link sent on your email"){
            alert(res.msg);
            location.replace("../login.html")
        }else{
            alert(res.msg);
            form.username.value = "";
            form.email.value = "";
            form.password.value = "";
        }
    }else{
        alert("please fill all details")
    }
}