// Module for managing projects
import Project from './project.js';
import Todo from './todo.js';
import Storage from './storage.js';

const ProjectManager = (() => {
  const projects = [];
  let currentProject = null;
  
  // Initialize with a default project
  const init = () => {
    const savedProjects = Storage.loadProjects();
    
    if (savedProjects && savedProjects.length > 0) {
      // Restore saved projects
      savedProjects.forEach(projectData => {
        const project = Project(projectData.name);
        
        // Restore todos in the project
        projectData.todos.forEach(todoData => {
          const todo = Todo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority,
            todoData.notes || [],
            todoData.isComplete || false
          );
          project.addTodo(todo);
        });
        
        projects.push(project);
      });
      
      currentProject = projects[0];
    } else {
      // Create default project if no saved projects
      const defaultProject = Project('Default');
      projects.push(defaultProject);
      currentProject = defaultProject;
      
      // Save to localStorage
      Storage.saveProjects(projects);
    }
    
    return currentProject;
  };
  
  const createProject = (name) => {
    const newProject = Project(name);
    projects.push(newProject);
    Storage.saveProjects(projects);
    return newProject;
  };
  
  const deleteProject = (index) => {
    if (index >= 0 && index < projects.length) {
      projects.splice(index, 1);
      
      // If we deleted the current project, switch to the first available
      if (projects.length > 0) {
        currentProject = projects[0];
      } else {
        // Create a new default project if none left
        const defaultProject = Project('Default');
        projects.push(defaultProject);
        currentProject = defaultProject;
      }
      
      Storage.saveProjects(projects);
      return currentProject;
    }
    return null;
  };
  
  const getProject = (index) => {
    return projects[index];
  };
  
  const getAllProjects = () => {
    return projects;
  };
  
  const setCurrentProject = (index) => {
    if (index >= 0 && index < projects.length) {
      currentProject = projects[index];
      return currentProject;
    }
    return null;
  };
  
  const getCurrentProject = () => {
    return currentProject;
  };
  
  const createTodo = (title, description, dueDate, priority, notes = []) => {
    const newTodo = Todo(title, description, dueDate, priority, notes);
    currentProject.addTodo(newTodo);
    Storage.saveProjects(projects);
    return newTodo;
  };
  
  const deleteTodo = (index) => {
    currentProject.removeTodo(index);
    Storage.saveProjects(projects);
  };
  
  return {
    init,
    createProject,
    deleteProject,
    getProject,
    getAllProjects,
    setCurrentProject,
    getCurrentProject,
    createTodo,
    deleteTodo
  };
})();

export default ProjectManager;