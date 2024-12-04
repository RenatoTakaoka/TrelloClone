import {z} from "zod";
import {ActionState} from "@/lib/create-safe-action";
import {DeleteList} from "@/actions/delete-list/schema";
import {List} from "@prisma/client";

export type InputType = z.infer<typeof DeleteList>
export type ReturnType = ActionState<InputType, List>