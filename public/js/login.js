const login = document.getElementById('login');
login.addEventListener('submit', onSubmit);
const email = document.getElementById('email');
const password = document.getElementById('password');

function onSubmit(e) {
    e.preventDefault();

    loginObject = {
        email: email.value,
        password: password.value
    }

    axios.post('http://localhost:3000/user/login', loginObject)
        .then((result) => {
            console.log(result);
            alert('Login successfull!!')
        })
        .catch((err) => {
            if(err.response.data.error){
                document.body.innerHTML += `<span class='text-danger'>${err.response.data.error}</span>`;
            } else {
                console.log(err);
            }
        });
}