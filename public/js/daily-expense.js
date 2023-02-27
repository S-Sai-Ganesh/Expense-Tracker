let editingExpenseId = null;

const expense = document.getElementById('expense')
expense.addEventListener('submit', onSubmit);

function onSubmit(e){
    e.preventDefault();

    let expenseObj = {
        amount: document.getElementById('amount').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value
    }

    if(editingExpenseId === null){
        axios.post('http:/localhost:3000/expense/post-expense',expenseObj)
        .then((response) => {
            addNewLineElement(response.data)
        }).catch((err) => {
            document.body.innerHTML+= '<h6> Submit failed try again</h6>'
            console.log(err);      
        }
        );
    } else {
        axios.post(`http:/localhost:3000/expense/edit-expense/${editingExpenseId}`,expenseObj)
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
    
    axios.get('http:/localhost:3000/expense/get-expenses')
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
        axios.get(`http:/localhost:3000/expense/delete-expense/${expenseDetails.id}`)
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