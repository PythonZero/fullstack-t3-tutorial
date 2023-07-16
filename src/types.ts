import {z} from "zod";
import type {inferRouterOutputs} from "@trpc/server";
import {AppRouter} from "~/server/api/root";

export const todoInput = z.string({
    required_error: "Describe your todo",
}).min(1).max(50)

type RouterOutputs = inferRouterOutputs<AppRouter>
type allTodosOutput = RouterOutputs["todo"]["all"]

export type Todo = allTodosOutput[number]
