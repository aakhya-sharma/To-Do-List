let form = document.querySelector('form');
let ul = document.querySelector('ul');

form.addEventListener('submit', (event) => {
    // Prevents going to /action on form submission
    event.preventDefault();

    // Adding the task to the list
    let input = document.querySelector('input');
    if (input.value != '') {
        let newTask = document.createElement('li');
        newTask.innerText = input.value + ' ';
        let delBtn = document.createElement('button');
        delBtn.setAttribute('type', 'button');  // Adding type=button attribute so delBtn doesn't end up submitting the form which happens by default as delBtn is inside the form
        delBtn.classList.add('del');    // Adding new buttons to the del class so we can apply proper functionalities to it
        delBtn.innerText = 'Delete Task';
        newTask.appendChild(delBtn);    // Appending delete button to li first and then appending li to ul
        ul.appendChild(newTask);

        // Reset input after submission
        input.value = '';
    } else {
        alert('Invalid input. Please enter a task.');
    }
})

// [let dels = document.querySelectorAll('.del');

// for (let del of dels) {
//     del.addEventListener('click', function() {
//         let parent = this.parentElement;     // normal function ke saath use 'this' to refer to each particular delete button one by one
//         parent.remove();
//     })
// }]

// The entire code in [] is applicable when we are not adding new tasks and thus new delete buttons but since we are, kisi type ke element par pehle se laga hua event listener does not apply on similar type ke newly created elements. Therefore, we use event delegation and we add event listeners on the parent element of the element which might be newly generated/deleted as per the clicks of the user. So, we choose ul as on clicking the delete button, the li has to be deleted.

ul.addEventListener('click', (event) => {
    let dels = document.querySelectorAll('.del');
    for (let del of dels) {
        if (event.target == del) {
            let par = event.target.parentElement;   // arrow function ke saath always use 'event.target' to refer to the element jis par click hua hai (button in this case) and normal function ke saath you can use 'this' to refer to the object jis par event listener laga hua hai (ul in this case)
            par.remove();
            break;  // loop ke run hote dauraan agar wo delete button mil jaaye jis par click hua tha toh no need to check further kyunki click toh ek baar mei ek hi jagah ho sakta hai
        }
    }
})