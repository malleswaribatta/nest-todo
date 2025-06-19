export type Task = {
    id: string,
    task: string,
    done: boolean,
}

export type Todo = {
    todoId: string,
    todo: string,
    tasks: Task[],
}

export type User = {
    username: string;
    todos: Todo[];
};

export type UserSessionDetails = {
    [userId: string]: string;
};
