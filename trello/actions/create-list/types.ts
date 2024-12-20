import {z} from "zod";
import {ActionState} from "@/lib/create-safe-action";
import {List} from "@prisma/client";
import {CreateList} from "@/actions/create-list/schema";

export type InputType = z.infer<typeof CreateList>
export type ReturnType = ActionState<InputType, List>