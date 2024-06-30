// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const openModalBtn = $('#openModel');
const taskModal = $('#taskModal');
const taskForm = $('#taskForm');
const closeBtn = $('.close');
const taskNameInputEl = $('#taskName');
const taskDueDateInputEl = $('#taskDueDate');
const taskDescriptionInputEl = $('#taskDescription');





// Todo: create a function to generate a unique task id
function generateTaskId() {
    const timestamp = new Date().getTime(); // Get current timestamp
    const randomNum = Math.floor(Math.random() * 1000); // Generate a random number
    return `${timestamp}-${randomNum}`; // Combine timestamp and random number
                              
}
const TaskId = generateTaskId();


// Todo: create a function to create a task card
function createTaskCard(task) {

    //Create a new task card element and add the classes `card`, `task-card`, `draggable`, and `my-3`. Also add a `data-task-id` attribute and set it to the Task id.
  const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  // Create a new task card header element and add the classes `card-header` and `h4`. Also set the text of the card header to the project name.
  const cardHeader = $('<div>').addClass('card-header h4').text(task.name);
  // Create a new task card body element and add the class `card-body`.
  const cardBody = $('<div>').addClass('card-body');
  // Create a new task paragraph element and add the class `card-text`. Also set the text of the paragraph to the project type.
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  // Create a new task paragraph element and add the class `card-text`. Also set the text of the paragraph to the project due date.
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  // Create a new task button element and add the classes `btn`, `btn-danger`, and `delete`. Also set the text of the button to "Delete" and add a `data-project-id` attribute and set it to the project id.
  const cardDeletebtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeletebtn.on('click', handleDeleteTask);

  // ? Sets the card background color based on due date. Only apply the styles if the dueDate exists and the status is not done.
  if (task.dueDate && task.description !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // ? If the task is due today, make the card yellow. If it is overdue, make it red.
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate)) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteBtn.addClass('border-light');
    }
  }

  //Append the card description, card due date, and card delete button to the card body.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  // Append the card header and card body to the card.

  // ? Return the card so it can be appended to the correct lane.
  return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    let Tasks = JSON.parse(localStorage.getItem('tasks'));

    $( function() {
        $( "#draggable" ).draggable();
      } );

  // If there are no projects in localStorage, initialize an empty array
  if (!tasks) {
      tasks = [];
  }

  return tasks;

  


}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // TODO: Get the project name, type, and due date from the form
    const taskName = TaskNameInputEl.val().trim();
    const taskDescription = TaskDescriptionInputEl.val();
    const taskDueDate = TaskDueDateInputEl.val();
  
  
    // ? Create a new project object with the data from the form
    const newTask = {
      // ? Here we use a tool called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.
     // id: crypto.randomUUID(),
      name: taskName,
      description: taskDescription,
      dueDate: taskDueDate,
      status: 'to-do',
    };
  
    // ? Pull the projects from localStorage and push the new project to the array
    const tasks = renderTaskList();
    tasks.push(newTask);
  
    // ? Save the updated projects array to localStorage
    handleDrop(tasks);
  
   

   
    }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).attr('data-task-id');
    const tasks = renderTaskList();
  
    // TODO: Loop through the projects array and remove the project with the matching id.
    tasks.forEach((task) => {
      if (task.id === taskId) {
        tasks.splice(tasks.indexof(task), 1);
      }
    });
    
    // ? We will use our helper function to save the projects to localStorage
    handleDrop();
  
    // ? Here we use our other function to print projects back to the screen
    handleAddTask();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    
        // ? Read projects from localStorage
        const tasks = taskList
        
        // ? Get the project id from the event
        const taskId = ui.draggable[0].dataset.taskId;
      
        // ? Get the id of the lane that the card was dropped into
        const newStatus = event.target.id;
      
        for (let task of tasks) {
          // ? Find the project card by the `id` and update the project status.
          if (Task.id === taskId) {
            Task.status = newStatus;
          }
        }
        // ? Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
        localStorage.setItem('Tasks', JSON.stringify(tasks));
        printTaskData();
}


// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
     // ? Print project data back to the screen
     function printTaskData() {
        const Tasks = renderTaskList();
      
       // ? Empty existing project cards out of the lanes
        const todoList = $('#todo-cards');
        todoList.empty();
      
        const inProgressList = $('#in-progress-cards');
        inProgressList.empty();
      
        const doneList = $('#done-cards');
        doneList.empty();
    }
        
        // TODO: Loop through projects and create project cards for each status
        for (let task of tasks) {
          if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
           } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
           } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
           }
        }

    $('#taskDueDate').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  
    // ? Make lanes droppable
    $('.lane').droppable({
      accept: '.draggable',
      drop: handleDrop,
    });



      // Open the modal
      openModalBtn.on('click', function() {
        taskModal.show();
    
        $('#taskDueDate').datepicker({
          changeMonth: true,
          changeYear: true,
        });

        // Close the modal
      closeBtn.on('click', function() {
        taskModal.hide();
      });
    
      // Form submission
     taskForm.on ('submit', handleAddTask);
        // Clear the form
        taskForm[0].reset();
    
        // Close the modal
        taskModal.hide();
      });
    
      
      
    
    
    
});
