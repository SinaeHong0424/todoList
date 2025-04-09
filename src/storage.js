// Module for handling localStorage
const Storage = (() => {
    const saveProjects = (projects) => {
      // Convert projects to JSON-friendly format
      const projectsData = projects.map(project => {
        return {
          name: project.name,
          todos: project.getAllTodos()
        };
      });
      
      localStorage.setItem('todoProjects', JSON.stringify(projectsData));
    };
    
    const loadProjects = () => {
      const projectsJSON = localStorage.getItem('todoProjects');
      if (!projectsJSON) return null;
      
      return JSON.parse(projectsJSON);
    };
    
    return {
      saveProjects,
      loadProjects
    };
  })();
  
  export default Storage;
  