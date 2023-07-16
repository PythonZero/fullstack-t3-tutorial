import {useState} from "react";
import {todoInput} from "~/types";
import toast from "react-hot-toast";
import {api} from "~/utils/api";

export default function CreateTodo() {
    const [newTodo, setNewTodo] = useState('');
    const trpc = api.useContext()
    const {mutate} = api.todo.create.useMutation(
        {
            onSettled: async () => {
                await trpc.todo.all.invalidate()
            },
            onMutate: async (newTodo) => {
                // Cancel any outgoing refetches so they don't overwrite our optimistic update
                await trpc.todo.all.cancel()
                // Snapshot previous data
                const previousTodos = trpc.todo.all.getData()
                // Optimistically update to new value
                trpc.todo.all.setData(undefined, (prev) => {
                    const optimisticTodo = {
                        id: "optimistic-todo-id",
                        text: newTodo,
                        done: false
                    }
                    if (!prev) return [optimisticTodo]
                    return [...prev, optimisticTodo]
                })
                setNewTodo("")  // Clear the todo
                return ({previousTodos})
            },
            onError: (error, newTodo, context) => {
                toast.error("An error occurred when creating todo");
                setNewTodo(newTodo)  // Unclear the todo
                trpc.todo.all.setData(undefined, () => context?.previousTodos)
            }
        }
    )
    return (
        <div className="flex justify-center">
            <form className={"flex gap-2"} onSubmit={(event) => {
                event.preventDefault()
                const result = todoInput.safeParse(newTodo)
                if (!result.success) {
                    console.log("Not valid")
                    toast.error(result.error.format()._errors.join("\n"))
                    return
                }
                // Create the new Todo
                mutate(newTodo)
            }}>
                <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="New Todo..."
                    type="text" name="new-todo" id="new-todo"
                    value={newTodo}
                    onChange={(e) => {
                        setNewTodo(e.target.value)
                    }}
                />
                <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Create
                </button>
            </form>
        </div>
    )
}