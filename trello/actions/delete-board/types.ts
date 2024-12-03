import {z} from "zod";
import {ActionState} from "@/lib/create-safe-action";
import {Board} from "@prisma/client";
import {DeleteBoard} from "@/actions/delete-board/schema";

export type InputType = z.infer<typeof DeleteBoard>
export type ReturnType = ActionState<InputType, Board>