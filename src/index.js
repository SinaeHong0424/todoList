
import './style.css';
import { format } from 'date-fns';
import ProjectManager from './projectManager.js';
import UI from './ui.js';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Set default date value in form to today
  const dateInput = document.getElementById('new-todo-due-date');
  dateInput.value = format(new Date(), 'yyyy-MM-dd');
  
  // Initialize project manager and UI
  ProjectManager.init();
  UI.loadUI();
});