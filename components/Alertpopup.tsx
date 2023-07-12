import { Terminal, Waves } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AlertProps = {
  invoice: string;
  message: string;
};

export function AlertPop({ invoice, message }: AlertProps) {
  return (
    <Alert className="w-1/2 mt-10 ">
      <Terminal className="h-4 w-4" />
      <AlertTitle>{invoice}✅ is up!</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
