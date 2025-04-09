// Factory function for creating todo items
const Todo = (title, description, dueDate, priority, notes = [], isComplete = false) => {
    return {
      title,
      description,
      dueDate,
      priority,
      notes,
      isComplete,
      toggleComplete() {
        this.isComplete = !this.isComplete;
      },
      updatePriority(newPriority) {
        this.priority = newPriority;
      },
      addNote(note) {
        this.notes.push(note);
      }
    };
  };
  
  export default Todo;