import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type AlertProps = {
  invoice: string;
  message: string;
  alertType: "edit" | "add" | null;
};

export function AlertPop({ invoice, message, alertType }: AlertProps) {
  if (alertType === "edit") {
    return (
      <Alert className="z-50 fixed bottom-5 right-4 w-3/4 md:w-1/4 bg-transparent backdrop-blur-lg border border-sky-500 p-3">
        <Terminal className="h-4 w-4" />
        <AlertTitle className="font-medium">{invoice}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  } else if (alertType === "add") {
    return (
      <Alert className="z-50 fixed bottom-5 right-2 w-1/3 bg-transparent backdrop-blur-lg border border-b-greenprimary p-3">
        <Terminal className="h-4 w-4" />
        <AlertTitle className="font-medium">{invoice}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  } else {
    return (
      <Alert className="z-50 fixed bottom-5 right-2 w-1/3 bg-transparent backdrop-blur-lg border border-white p-3">
        <Terminal className="h-4 w-4" />
        <AlertTitle className="font-medium">{invoice}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }
}
