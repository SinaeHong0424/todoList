// Module for handling DOM interactions
import { format } from 'date-fns';
import ProjectManager from './projectManager.js';

const UI = (() => {
  const loadUI = () => {
    renderProjects();
    renderTodos();
    setupEventListeners();
  };
  
  const renderProjects = () => {
    const projectsList = document.getElementById('projects-list');
    projectsList.innerHTML = '';
    
    const projects = ProjectManager.getAllProjects();
    const currentProject = ProjectManager.getCurrentProject();
    
    projects.forEach((project, index) => {
      const projectItem = document.createElement('li');
      projectItem.classList.add('project-item');
      
      if (project === currentProject) {
        projectItem.classList.add('active-project');
      }
      
      projectItem.textContent = project.name;
      projectItem.dataset.projectIndex = index;
      
      // Add delete button for projects (except the only remaining one)
      if (projects.length > 1) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.classList.add('delete-project-btn');
        deleteBtn.dataset.projectIndex = index;
        projectItem.appendChild(deleteBtn);
      }
      
      projectsList.appendChild(projectItem);
    });
  };
  
  const renderTodos = () => {
    const todosContainer = document.getElementById('todos-container');
    todosContainer.innerHTML = '';
    
    const currentProject = ProjectManager.getCurrentProject();
    document.getElementById('current-project-name').textContent = currentProject.name;
    
    const todos = currentProject.getAllTodos();
    
    if (todos.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'No todos yet. Create one!';
      emptyMessage.classList.add('empty-message');
      todosContainer.appendChild(emptyMessage);
      return;
    }
    
    todos.forEach((todo, index) => {
      const todoItem = document.createElement('div');
      todoItem.classList.add('todo-item');
      
      if (todo.isComplete) {
        todoItem.classList.add('completed');
      }
      
      // Add priority class
      todoItem.classList.add(`priority-${todo.priority.toLowerCase()}`);
      
      // Create todo header with title and buttons
      const todoHeader = document.createElement('div');
      todoHeader.classList.add('todo-header');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = todo.isComplete;
      checkbox.dataset.todoIndex = index;
      checkbox.classList.add('todo-checkbox');
      
      const title = document.createElement('h3');
      title.textContent = todo.title;
      
      const dueDate = document.createElement('span');
      dueDate.classList.add('due-date');
      dueDate.textContent = format(new Date(todo.dueDate), 'MMM d, yyyy');
      
      const expandBtn = document.createElement('button');
      expandBtn.textContent = 'Details';
      expandBtn.classList.add('expand-btn');
      expandBtn.dataset.todoIndex = index;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '×';
      deleteBtn.classList.add('delete-todo-btn');
      deleteBtn.dataset.todoIndex = index;
      
      todoHeader.appendChild(checkbox);
      todoHeader.appendChild(title);
      todoHeader.appendChild(dueDate);
      todoHeader.appendChild(expandBtn);
      todoHeader.appendChild(deleteBtn);
      
      todoItem.appendChild(todoHeader);
      
      // Create expandable details section (hidden by default)
      const todoDetails = document.createElement('div');
      todoDetails.classList.add('todo-details');
      todoDetails.style.display = 'none';
      
      const description = document.createElement('p');
      description.textContent = todo.description;
      
      const priorityLabel = document.createElement('p');
      priorityLabel.innerHTML = `<strong>Priority:</strong> ${todo.priority}`;
      
      const notesSection = document.createElement('div');
      notesSection.classList.add('notes-section');
      notesSection.innerHTML = '<h4>Notes:</h4>';
      
      const notesList = document.createElement('ul');
      
      if (todo.notes && todo.notes.length > 0) {
        todo.notes.forEach(note => {
          const noteItem = document.createElement('li');
          noteItem.textContent = note;
          notesList.appendChild(noteItem);
        });
      } else {
        const emptyNote = document.createElement('li');
        emptyNote.textContent = 'No notes yet';
        notesList.appendChild(emptyNote);
      }
      
      notesSection.appendChild(notesList);
      
      // Note input form
      const noteForm = document.createElement('form');
      noteForm.classList.add('note-form');
      noteForm.dataset.todoIndex = index;
      
      const noteInput = document.createElement('input');
      noteInput.type = 'text';
      noteInput.placeholder = 'Add a note...';
      noteInput.name = 'note';
      noteInput.required = true;
      
      const addNoteBtn = document.createElement('button');
      addNoteBtn.type = 'submit';
      addNoteBtn.textContent = 'Add Note';
      
      noteForm.appendChild(noteInput);
      noteForm.appendChild(addNoteBtn);
      
      // Priority selection
      const priorityForm = document.createElement('form');
      priorityForm.classList.add('priority-form');
      priorityForm.dataset.todoIndex = index;
      
      const prioritySelect = document.createElement('select');
      prioritySelect.name = 'priority';
      
      const priorities = ['Low', 'Medium', 'High'];
      priorities.forEach(p => {
        const option = document.createElement('option');
        option.value = p;
        option.textContent = p;
        if (p === todo.priority) {
          option.selected = true;
        }
        prioritySelect.appendChild(option);
      });
      
      const priorityBtn = document.createElement('button');
      priorityBtn.type = 'submit';
      priorityBtn.textContent = 'Update Priority';
      
      priorityForm.appendChild(prioritySelect);
      priorityForm.appendChild(priorityBtn);
      
      todoDetails.appendChild(description);
      todoDetails.appendChild(priorityLabel);
      todoDetails.appendChild(priorityForm);
      todoDetails.appendChild(notesSection);
      todoDetails.appendChild(noteForm);
      
      todoItem.appendChild(todoDetails);
      todosContainer.appendChild(todoItem);
    });
  };
  
  const setupEventListeners = () => {
    // Project creation
    document.getElementById('new-project-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const projectNameInput = document.getElementById('new-project-name');
      const projectName = projectNameInput.value.trim();
      
      if (projectName) {
        ProjectManager.createProject(projectName);
        projectNameInput.value = '';
        renderProjects();
      }
    });
    
    // Todo creation
    document.getElementById('new-todo-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      
      const title = form.elements.title.value.trim();
      const description = form.elements.description.value.trim();
      const dueDate = form.elements.dueDate.value;
      const priority = form.elements.priority.value;
      
      if (title && dueDate) {
        ProjectManager.createTodo(title, description, dueDate, priority);
        form.reset();
        renderTodos();
      }
    });
    
    // Project selection and deletion
    document.getElementById('projects-list').addEventListener('click', (e) => {
      if (e.target.classList.contains('project-item')) {
        const projectIndex = parseInt(e.target.dataset.projectIndex);
        ProjectManager.setCurrentProject(projectIndex);
        renderProjects();
        renderTodos();
      } else if (e.target.classList.contains('delete-project-btn')) {
        const projectIndex = parseInt(e.target.dataset.projectIndex);
        ProjectManager.deleteProject(projectIndex);
        renderProjects();
        renderTodos();
      }
    });
    
    // Todo events delegation
    document.getElementById('todos-container').addEventListener('click', (e) => {
      // Todo completion toggle
      if (e.target.classList.contains('todo-checkbox')) {
        const todoIndex = parseInt(e.target.dataset.todoIndex);
        const currentProject = ProjectManager.getCurrentProject();
        const todo = currentProject.getTodo(todoIndex);
        todo.toggleComplete();
        renderTodos();
      }
      
      // Todo expansion
      if (e.target.classList.contains('expand-btn')) {
        const todoIndex = parseInt(e.target.dataset.todoIndex);
        const todoDetails = e.target.closest('.todo-item').querySelector('.todo-details');
        
        if (todoDetails.style.display === 'none') {
          todoDetails.style.display = 'block';
          e.target.textContent = 'Hide';
        } else {
          todoDetails.style.display = 'none';
          e.target.textContent = 'Details';
        }
      }
      
      // Todo deletion
      if (e.target.classList.contains('delete-todo-btn')) {
        const todoIndex = parseInt(e.target.dataset.todoIndex);
        ProjectManager.deleteTodo(todoIndex);
        renderTodos();
      }
    });
    
    // Note addition
    document.getElementById('todos-container').addEventListener('submit', (e) => {
      if (e.target.classList.contains('note-form')) {
        e.preventDefault();
        const todoIndex = parseInt(e.target.dataset.todoIndex);
        const noteText = e.target.elements.note.value.trim();
        
        if (noteText) {
          const currentProject = ProjectManager.getCurrentProject();
          const todo = currentProject.getTodo(todoIndex);
          todo.addNote(noteText);
          e.target.reset();
          renderTodos();
          
          // Re-open the details section
          const todoItem = document.querySelectorAll('.todo-item')[todoIndex];
          const todoDetails = todoItem.querySelector('.todo-details');
          todoDetails.style.display = 'block';
          todoItem.querySelector('.expand-btn').textContent = 'Hide';
        }
      }
      
      // Priority update
      if (e.target.classList.contains('priority-form')) {
        e.preventDefault();
        const todoIndex = parseInt(e.target.dataset.todoIndex);
        const newPriority = e.target.elements.priority.value;
        
        const currentProject = ProjectManager.getCurrentProject();
        const todo = currentProject.getTodo(todoIndex);
        todo.updatePriority(newPriority);
        renderTodos();
        
        // Re-open the details section
        const todoItem = document.querySelectorAll('.todo-item')[todoIndex];
        const todoDetails = todoItem.querySelector('.todo-details');
        todoDetails.style.display = 'block';
        todoItem.querySelector('.expand-btn').textContent = 'Hide';
      }
    });
  };
  
  return {
    loadUI
  };
})();

export default UI;