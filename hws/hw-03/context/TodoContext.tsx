import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";
import type { Todo } from "@/types";
import {
    addTodo as apiAddTodo,
    deleteTodo as apiDeleteTodo,
    getTodos,
    toggleTodo as apiToggleTodo,
    updateTodoText,
} from "@/services/api";

const TODOS_STORAGE_KEY = "@todo_tasks";

interface TodoContextValue {
    todos: Todo[];
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    refreshTodos: () => Promise<void>;
    addTodo: (text: string) => Promise<void>;
    toggleTodo: (id: string, completed: boolean) => Promise<void>;
    updateTodo: (id: string, text: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
    clearCompleted: () => Promise<void>;
    clearAll: () => Promise<void>;
}

const TodoContext = createContext<TodoContextValue | undefined>(
    undefined,
);

interface TodoProviderProps {
    children: ReactNode;
}

export function TodoProvider({ children }: TodoProviderProps) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const saveTodos = useCallback(async (nextTodos: Todo[]) => {
        try {
            await AsyncStorage.setItem(
                TODOS_STORAGE_KEY,
                JSON.stringify(nextTodos),
            );
        } catch (error) {
            console.error("Не вдалося зберегти завдання:", error);
        }
    }, []);

    const loadCachedTodos = useCallback(async () => {
        try {
            const cached = await AsyncStorage.getItem(TODOS_STORAGE_KEY);

            if (cached) {
                const parsed: Todo[] = JSON.parse(cached);
                setTodos(parsed);
            }
        } catch (error) {
            console.error("Не вдалося завантажити локальні завдання:", error);
        }
    }, []);

    const refreshTodos = useCallback(async () => {
        try {
            setRefreshing(true);
            setError(null);

            const data = await getTodos();

            setTodos(data);
            await saveTodos(data);
        } catch (err) {
            setError(
                "Не вдалося з'єднатися з json-server. Переконайтеся, що сервер запущено на порту 3000.",
            );
            console.error(err);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    }, [saveTodos]);

    useEffect(() => {
        const initialize = async () => {
            await loadCachedTodos();
            await refreshTodos();
        };

        initialize();
    }, [loadCachedTodos, refreshTodos]);

    const addTodo = useCallback(
        async (text: string) => {
            try {
                const newTodo = await apiAddTodo(text);

                setTodos((prev) => {
                    const next = [...prev, newTodo];
                    void saveTodos(next);
                    return next;
                });
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        [saveTodos],
    );

    const toggleTodo = useCallback(
        async (id: string, completed: boolean) => {
            const previousTodos = todos;

            const nextTodos = todos.map((todo) =>
                todo.id === id ? { ...todo, completed } : todo,
            );

            setTodos(nextTodos);
            await saveTodos(nextTodos);

            try {
                await apiToggleTodo(id, completed);
            } catch (error) {
                setTodos(previousTodos);
                await saveTodos(previousTodos);
                throw error;
            }
        },
        [todos, saveTodos],
    );

    const updateTodo = useCallback(
        async (id: string, text: string) => {
            const previousTodos = todos;

            const nextTodos = todos.map((todo) =>
                todo.id === id ? { ...todo, text } : todo,
            );

            setTodos(nextTodos);
            await saveTodos(nextTodos);

            try {
                await updateTodoText(id, text);
            } catch (error) {
                setTodos(previousTodos);
                await saveTodos(previousTodos);
                throw error;
            }
        },
        [todos, saveTodos],
    );

    const deleteTodo = useCallback(
        async (id: string) => {
            const previousTodos = todos;

            const nextTodos = todos.filter((todo) => todo.id !== id);

            setTodos(nextTodos);
            await saveTodos(nextTodos);

            try {
                await apiDeleteTodo(id);
            } catch (error) {
                setTodos(previousTodos);
                await saveTodos(previousTodos);
                throw error;
            }
        },
        [todos, saveTodos],
    );

    const clearCompleted = useCallback(async () => {
        const completedTodos = todos.filter((todo) => todo.completed);
        const previousTodos = todos;

        if (completedTodos.length === 0) {
            return;
        }

        const nextTodos = todos.filter((todo) => !todo.completed);

        setTodos(nextTodos);
        await saveTodos(nextTodos);

        try {
            await Promise.all(
                completedTodos.map((todo) => apiDeleteTodo(todo.id)),
            );
        } catch (error) {
            setTodos(previousTodos);
            await saveTodos(previousTodos);
            throw error;
        }
    }, [todos, saveTodos]);

    const clearAll = useCallback(async () => {
        const previousTodos = todos;

        if (todos.length === 0) {
            return;
        }

        setTodos([]);
        await saveTodos([]);

        try {
            await Promise.all(
                previousTodos.map((todo) => apiDeleteTodo(todo.id)),
            );
        } catch (error) {
            setTodos(previousTodos);
            await saveTodos(previousTodos);
            throw error;
        }
    }, [todos, saveTodos]);

    const value = useMemo(
        () => ({
            todos,
            loading,
            refreshing,
            error,
            refreshTodos,
            addTodo,
            toggleTodo,
            updateTodo,
            deleteTodo,
            clearCompleted,
            clearAll,
        }),
        [
            todos,
            loading,
            refreshing,
            error,
            refreshTodos,
            addTodo,
            toggleTodo,
            updateTodo,
            deleteTodo,
            clearCompleted,
            clearAll,
        ],
    );

    return (
        <TodoContext.Provider value={value}>
            {children}
        </TodoContext.Provider>
    );
}

export function useTodos(): TodoContextValue {
    const context = useContext(TodoContext);

    if (!context) {
        throw new Error("useTodos має використовуватися всередині TodoProvider");
    }

    return context;
}
