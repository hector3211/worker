import { Terminal, Waves } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type AlertProps = {
  invoice: string;
  message: string;
};

export function AlertPop({ invoice, message }: AlertProps) {
  return (
    <Alert className="fixed bottom-5 right-2 w-1/3 dark:bg-gradient-to-tr from-yellowprimary to-gray-900">
      <Terminal className="h-4 w-4" />
      <AlertTitle className="font-medium">{invoice}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
