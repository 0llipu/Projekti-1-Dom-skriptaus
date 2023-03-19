// DOM Project, Javascript course, Laurea UAS, Commenting starts here.
// First we wait for the page to load, then we declare some variables.
// Event listener for listening the page to load and general variables are declared here beneath.

window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const newTodoForm = document.querySelector('#new-todo-form');
	const totalStat = document.querySelector('#totalStat');
	const remainingStat = document.querySelector('#remainingStat');
	const completedStat = document.querySelector('#completedStat');
	const todoInput = document.getElementById('content');
	const showAll = document.getElementById('showAll');
	const showCompleted = document.getElementById('showCompleted');
	const showRemaining = document.getElementById('showRemaining');

	let todoFilter = 'showAll'; //Here we se the default value for the task filtering variable.
	showAll.classList.add('active');

	//Here we run the basic functions of the page to show all the todos and count them and reset the forms input field.

	constructTodos();
	countTodos();
	todoInput.focus();

	// After declaring variables we move to the form that is going to submit the todos to the To-Do list.
	// The form to add todos starts here, first we listen if the submit-button is pressed.

	newTodoForm.addEventListener('submit', (e) => {
		e.preventDefault(); // First we prevent the default thing for submit form, that is, submit and reload. We don't want that reload phase in this one.

		const inputValue = e.target.elements.content.value; //Then we take the input value of the forms inner element named content.

		//After that we do some validating checks for the input so that it has to be long enough and not empty or too short.
		if (
			inputValue == '' ||
			inputValue.length <= 2 ||
			inputValue.length >= 50
		) {
			e.target.reset(); //If the form is not filled out properly then we reset it.
			e.target.focus(); //And focus it to the beginning.
			errorTodo(); //And present an error for the user into the input form.
			return;
		}
		//If the input value is validated then we take the info from the form and push it into localStorage as a todo into an todos array we declared at the start.

		const todo = {
			content: inputValue,
			done: false,
		};
		todos.push(todo);
		localStorage.setItem('todos', JSON.stringify(todos));

		// After that we run some basic functions of the page to show what's in the localStorage and how much it is there.

		constructTodos(); //Here we run the function that builds this new one and the other todos on to the page.
		countTodos(); //Here we run the function that counts the todos on the page to add this new one into the numbers.

		//Then after the input is done we clear out and reset the forms input field.

		todoInput.classList.remove('error');
		e.target.reset();
		e.target.focus();
	});

	//This function builds the styling and text for the forms input field error.

	function errorTodo() {
		todoInput.classList.add('error');
		todoInput.placeholder = "Can't be empty, too short or too long!";
	}

	//Here we have the function that constructs the todos visually to the page.

	function constructTodos() {
		const todoList = document.querySelector('#todo-list'); //We select the list that we are going to put the todos in.
		todoList.innerHTML = ''; //We clear out the list so that it is blank to start.

		//Then for each todo in the localStorage we build the visual construction piece by piece.

		todos.forEach((todo) => {
			//First we create the div the todo item sits in and add a classlist to it.

			const todoItem = document.createElement('div');
			todoItem.classList.add('todo-item');

			//Then we build the button for completing the todo item.
			//First a label where the input sits in and then a span element where the styled checkbox sits in.
			//Input type is declared and the state for the button to be checked and a classlist is added to style the button.

			const label = document.createElement('label');
			const input = document.createElement('input');
			const span = document.createElement('span');
			input.type = 'checkbox';
			input.checked = todo.done;
			span.classList.add('doneBall');

			//Then we add a content div for the content we took from the input form and add it into a div and give it an attribute of readonly.

			const content = document.createElement('div');
			content.classList.add('todo-content');
			content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;

			//After that we add the actions field for the edit and delete buttons.

			const actions = document.createElement('div');
			const edit = document.createElement('button');
			const deleteButton = document.createElement('button');
			actions.classList.add('actions');
			edit.classList.add('edit');
			deleteButton.classList.add('delete');
			edit.innerHTML = 'Edit';
			deleteButton.innerHTML = 'Delete';

			//When we have constructed these elements we append them on to the webpage.

			label.appendChild(input);
			label.appendChild(span);
			actions.appendChild(edit);
			actions.appendChild(deleteButton);
			todoItem.appendChild(label);
			todoItem.appendChild(content);
			todoItem.appendChild(actions);
			todoList.appendChild(todoItem);

			//Here we check if the todo is declared as done, if it is we add the classlist"done" to it.

			if (todo.done) {
				todoItem.classList.add('done');
			}

			//Here we listen in to the button that marks todos as done if the todo is marked as done we push that in to the localStorage.
			//After that we filter and count the todos again to get the new values shown correctly on the page.

			input.addEventListener('change', (e) => {
				todo.done = e.target.checked;
				localStorage.setItem('todos', JSON.stringify(todos));

				if (todo.done) {
					todoItem.classList.add('done');
				} else {
					todoItem.classList.remove('done');
				}
				filterTodos();
				countTodos();
			});

			//This is a function to edit the todo after inputting it. We can either edit it by clicking on to the input or the edit button.
			//When the function is activated we change the "Edit"-button from "Edit" to "Save" and then we add classlists to style the text and the new "Save"-button.
			//We also remove the readonly-attribute.

			function editInput() {
				const input = content.querySelector('input');
				edit.innerHTML = 'Save';
				input.classList.add('unsaved-text');
				edit.classList.add('unsaved-btn');
				input.removeAttribute('readonly');

				//Here we start to listen in to the actions user is taking, if user tries to come out of the editInput function by clicking outside we trigger some things.
				//This here beneath triggers a validation for the input text.
				//If the text is ok then we remove the classlists, change the button to "Edit" and push the changes to local storage and construct the todos.
				//If the validation does not pass the criteria we have se then we don't let the user save this and present an error for the user.

				input.addEventListener('blur', (e) => {
					if (
						e.target.value != '' &&
						e.target.value.length > 2 &&
						e.target.value.length < 50
					) {
						edit.innerHTML = 'Edit';
						edit.classList.remove('unsaved-btn');
						input.classList.remove('unsaved-text');
						input.setAttribute('readonly', true);
						todo.content = e.target.value;
						localStorage.setItem('todos', JSON.stringify(todos));
						constructTodos();
					} else {
						input.placeholder = 'Please insert a valid task!';
						input.classList.add('error');
						edit.innerHTML = 'Save';
						e.target.value = '';
						input.removeAttribute('readonly');
					}
				});

				//Listen for the "Enter"-key to be pressed. If pressed then try to save by triggering the blur-method.

				input.addEventListener('keydown', (e) => {
					if (e.keyCode == 13) {
						e.preventDefault();
						e.target.blur();
					}
				});
			}

			//Here we listen in on the "Edit"-button. If it is clicked then we run the editInput and focusInputEnd functions.
			//If the criteria is met and we then try to save by pressing this button we change the "Save"-button back to "Edit"-button.

			edit.addEventListener('click', (e) => {
				editInput();
				focusInputEnd();
				edit.addEventListener('click', (e) => {
					edit.innerHTML = 'Edit';
				});
			});

			//Here we listen in on the content-field and if it is clicked then we trigger the editInput functions and put the mouse where we click.

			content.addEventListener('click', (e) => {
				editInput();
				input.focus();
			});

			//This is a function to move the mouse cursor to the end of the content input when we press the "Edit"-button.

			function focusInputEnd() {
				const inputFocus = content.querySelector('input');
				const endFocus = inputFocus.value.length;
				inputFocus.setSelectionRange(endFocus, endFocus);
				inputFocus.focus();
			}

			//Here we listen in on the delete button and if it is pressed then we delete the information about that todo from localStorage and construct the todos again.
			//Click on the delete-button will open a confirmation dialog where the user can stop the deletion by canceling the action.
			//If the todo is deleted then we also filter and count them again.

			deleteButton.addEventListener('click', (e) => {
				if (confirm('Are you sure You want to delete?') == true) {
					todos = todos.filter((t) => t != todo);
					localStorage.setItem('todos', JSON.stringify(todos));
					constructTodos();
					todoInput.focus();
				} else {
					constructTodos();
					return;
				}
			});
		});
		filterTodos();
		countTodos();
	}

	//This is a function to count the tasks. First we construct an array of the completed todos by filtering the todos by checking if the todo is done.
	//When we have the length of completed todos we can use that to calculate remaining todos by deducting total amount of todos with the amount of completed todos.

	function countTodos() {
		const completedTodosArray = todos.filter((todo) => todo.done);

		totalStat.textContent = todos.length;
		completedStat.textContent = completedTodosArray.length;
		remainingStat.textContent = todos.length - completedTodosArray.length;
	}

	//Filtering todos, first we bring out the buttons for filtering the todos.
	//These button are listened for clicks and the clicks change the value of the todoFilter.
	//This then triggers adding/removing classlists for the styling of the buttons to tell the user what filter is chosen at this moment.
	//Lastly we filter the todos with the chosen todoFilter.

	showAll.addEventListener('click', (e) => {
		todoFilter = 'showAll';
		showAll.classList.add('active');
		showCompleted.classList.remove('active');
		showRemaining.classList.remove('active');
		filterTodos();
	});

	showCompleted.addEventListener('click', (e) => {
		todoFilter = 'showCompleted';
		showCompleted.classList.add('active');
		showRemaining.classList.remove('active');
		showAll.classList.remove('active');
		filterTodos();
	});

	showRemaining.addEventListener('click', (e) => {
		todoFilter = 'showRemaining';
		showRemaining.classList.add('active');
		showCompleted.classList.remove('active');
		showAll.classList.remove('active');
		filterTodos();
	});

	//This is the function for filtering the todos. First a nodelist is consructed of any div element that has a class named todo-item on it.
	//Then for every nodelist item we add the classlist of hidden and then modify the view with the input user has given us by pressing the buttons for filtering todos.

	function filterTodos() {
		const items = document.querySelectorAll('div.todo-item');
		items.forEach((item) => {
			item.classList.add('hidden');
			if (
				!item.classList.contains('done') &&
				todoFilter === 'showRemaining'
			) {
				item.classList.remove('hidden');
			} else if (
				item.classList.contains('done') &&
				todoFilter === 'showCompleted'
			) {
				item.classList.remove('hidden');
			} else {
				if (todoFilter === 'showAll') {
					item.classList.remove('hidden');
				}
			}
		});
	}
});
