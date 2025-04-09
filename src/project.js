// Factory function for creating projects
const Project = (name) => {
    const todos = [];
    
    return {
      name,
      todos,
      addTodo(todo) {
        todos.push(todo);
      },
      removeTodo(index) {
        todos.splice(index, 1);
      },
      getTodo(index) {
        return todos[index];
      },
      getAllTodos() {
        return todos;
      }
    };
  };
  
  export default Project;