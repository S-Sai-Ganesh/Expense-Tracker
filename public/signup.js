const signup = document.getElementById('signup');
signup.addEventListener('submit', onSubmit);

function onSubmit(e) {
    e.preventDefault();

    let signupObject = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    axios
        .post('http://localhost:3000/user/signup', signupObject)
        .then((response) => {
            console.log(response);
        })
        .catch((err) => {
            document.body.innerHTML += `<span class='text-danger'>${err.response.data.error}</span>`;
        });
}