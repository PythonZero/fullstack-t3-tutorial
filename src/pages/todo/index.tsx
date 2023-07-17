import {Layout} from "~/pages";
import Link from "next/link";
import Todos from "~/component/Todos";
import CreateTodo from "~/component/CreateTodo";
import {withAuthorization} from "~/utils/auth";

function TodoDisplay() {

    return (
        <Layout>
            <p className="text-center text-2xl text-yellow-300">
                Here are your Todos:
            </p>
            <div className="max-w-lg mx-auto p-4 bg-pink-300 rounded-lg shadow-md">
                <Todos/>
                <CreateTodo/>
            </div>
            <HomeButton/>
        </Layout>
    )
}

function HomeButton() {
    return (
        <p className="text-center text-2xl text-yellow-300">
            <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                <Link href={"/"}>Link to Home</Link>
            </button>
        </p>
    )
}

export default withAuthorization(TodoDisplay)
