let form = document.getElementById("login");

form.onsubmit = async(e)=>{
    e.preventDefault()
    if(form.email.value && form.password.value){
        let res = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: form.email.value,
                password: form.password.value
            })
        });
        res = await res.json();

        if(res.msg == "user logged in!"){
            alert(res.msg);
            localStorage.setItem("token", res.token);
            location.replace("../chat.html")
        }else{
            alert(res.msg);
            form.email.value = "";
            form.password.value = "";
        }
    }else{
        alert("please fill all details")
    }
}