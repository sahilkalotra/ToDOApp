export type Todo = {
  id: string;
  title: string;
  isDone: boolean;
  createdAt: number;
  updatedAt: number;
};

export type TodoId = Todo['id'];

export type AddTodoPayload = { title: string };
export type ToggleTodoPayload = { id: TodoId };
export type EditTodoPayload = { id: TodoId; title: string };
export type DeleteTodoPayload = { id: TodoId };
export type UndoDeletePayload = { maxTime: number };

export type TodoListProps = {
  todos: Todo[];
  onToggle: (id: TodoId) => void;
  onDelete: (id: TodoId) => void;
  onEdit: (todo: Todo) => void;
};

