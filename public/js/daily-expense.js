let editingExpenseId = null;
const token = localStorage.getItem('token');

const expense = document.getElementById('expense');
expense.addEventListener('submit', onSubmit);

function onSubmit(e){
    e.preventDefault();

    let expenseObj = {
        amount: document.getElementById('amount').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value
    }
    

    if(editingExpenseId === null){
        axios.post('http:/localhost:3000/expense/post-expense', expenseObj, { headers: {'Authorization': token} })
        .then((response) => {
            addNewLineElement(response.data)
        }).catch((err) => {
            document.body.innerHTML+= '<h6> Submit failed try again</h6>'
            console.log(err);      
        }
        );
    } else {
        axios.post(`http:/localhost:3000/expense/edit-expense/${editingExpenseId}`,expenseObj, { headers: {'Authorization': token} })
        .then((response) => {
            const parRes = JSON.parse(response.config.data);
            addNewLineElement(parRes);
        }).catch((err) => {
            document.body.innerHTML+= '<h6> Submit failed try again</h6>'
            console.log(err);      
        });
        editingExpenseId = null;
    }
}

if (document.readyState == "loading" ){
    
    
    axios.get('http:/localhost:3000/expense/get-expenses', { headers: {'Authorization': token} } )
        .then((result) => {
            result.data.forEach(element => {
                addNewLineElement(element);
            });
        }).catch((err) => {
            console.log(err);
            document.body.innerHTML+= '<h6> Error: Failed to load data from server</h6>'
        }
    );
};

function addNewLineElement(expenseDetails){
    const ul = document.getElementById('tracker');
    const li = document.createElement('li');

    li.appendChild(
        document.createTextNode('$' + expenseDetails.amount + ' - Category:' + expenseDetails.category + ' - Description:' + expenseDetails.description + ' ')
    );

    

    const delBtn = document.createElement('input');
    delBtn.id='delete';
    delBtn.type='button';
    delBtn.value='delete';
    delBtn.addEventListener('click', ()=> {
        axios.get(`http:/localhost:3000/expense/delete-expense/${expenseDetails.id}`, { headers: {'Authorization': token} })
        li.remove();
    });
    delBtn.style.border = '2px solid red';
    delBtn.style.marginRight = '5px'
    li.appendChild(delBtn);
    
    const editBtn = document.createElement('input');
    editBtn.id='edit';
    editBtn.type='button';
    editBtn.value='Edit';
    editBtn.addEventListener('click', ()=> {
        document.getElementById('amount').value = expenseDetails.amount;
        document.getElementById('description').value = expenseDetails.description;
        document.getElementById('category').value = expenseDetails.category;
        li.remove();
        editingExpenseId = expenseDetails.id;
        console.log(editingExpenseId);
    });
    editBtn.style.border = '2px solid green';
    li.appendChild(editBtn);
    ul.appendChild(li);
}

document.getElementById('premium').onclick = async function (e) {
    const response  = await axios.get('http://localhost:3000/purchase/premium-membership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id,
     "order_id": response.data.order.id,
     "handler": async function (response) {
        const result = await axios.post("http://localhost:3000/purchase/update-transaction-status", {
            order_id: options.order_id, payment_id: response.razorpay_payment_id
        }, { headers: { "authorization": token } })
        alert("You are now a premium user")
        }
    }

    const rzrp1 = new Razorpay(options);
    rzrp1.open();
    e.preventDefault();
    
    rzrp1.on("payment.failed", () => {
        axios.post("http://localhost:3000/purchase/update-transaction-status", { order_id: response.data.order.id }, { headers: { "authorization": token } })
        alert("something went wrong");
        rzrp1.close()
    })
}
