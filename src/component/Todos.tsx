import {api} from "~/utils/api";
import Todo from "~/component/Todo";

export default function Todos() {
    const {data: todos, isLoading, isError} = api.todo.all.useQuery();

    if (isLoading) return <>Loading Todos ... 🔃</>
    if (isError) return <>Error Fetching Todos ❌</>
    return (
        <div>
            {todos.length ? todos.map(todo => {
                return <Todo key={todo.id} todo={todo}/>
            }) : "Create your first todo"}
        </div>
    )
}