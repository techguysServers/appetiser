import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { convertComplexityToLabel } from "@/lib/utils";
import { CreateStepSchema } from "@/schemas/step";
import { Pen, Trash2 } from "lucide-react";
import { FieldArrayWithId } from "react-hook-form";
import z from "zod";

export default function TaskTable({
  tasks,
  onEditTask,
  onDeleteTask,
}: {
  tasks: FieldArrayWithId<z.infer<typeof CreateStepSchema>, "subSteps", "id">[];
  onEditTask: (
    task: FieldArrayWithId<z.infer<typeof CreateStepSchema>, "subSteps", "id">,
  ) => void;
  onDeleteTask: (
    task: FieldArrayWithId<z.infer<typeof CreateStepSchema>, "subSteps", "id">,
  ) => void;
}) {
  return (
    <div className="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="h-9 py-2">Name</TableHead>
            <TableHead className="h-9 py-2">Description</TableHead>
            <TableHead className="h-9 py-2">Hours</TableHead>
            <TableHead className="h-9 py-2">Complexity</TableHead>
            <TableHead className="h-9 py-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-4 text-center">
                No tasks added yet.
              </TableCell>
            </TableRow>
          )}
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="py-2 font-medium">{task.name}</TableCell>
              <TableCell className="py-2">{task.description}</TableCell>
              <TableCell className="py-2">{task.hours}</TableCell>
              <TableCell className="py-2">
                {convertComplexityToLabel(task.complexity)}
              </TableCell>
              <TableCell className="flex justify-end">
                <Button
                  variant="ghost"
                  size={"icon"}
                  onClick={() => onEditTask(task)}
                >
                  <Pen />
                </Button>
                <Button
                  variant="ghost"
                  size={"icon"}
                  onClick={() => onDeleteTask(task)}
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
