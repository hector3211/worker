"use client";
import { Button } from "@/components/ui/button";

type DoneButtonProps = {
  jobId: number;
  isCompleted: boolean;
};

export default function DoneButton({ jobId, isCompleted }: DoneButtonProps) {
  return (
    <div className="w-full">
      <Button className="w-full">Done</Button>
    </div>
  );
}
