import {z} from "zod";
import {ActionState} from "@/lib/create-safe-action";
import {Card} from "@prisma/client";
import {CreateCard} from "@/actions/create-card/schema";

export type InputType = z.infer<typeof CreateCard>
export type ReturnType = ActionState<InputType, Card>