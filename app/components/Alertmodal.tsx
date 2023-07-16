import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

type AlertModalProps = {
  message: string;
  url: string | undefined;
};

export function AlertModal({ message, url }: AlertModalProps) {
  function clipBoardCopy(url: string) {
    navigator.clipboard.writeText(url);
  }
  return (
    <>
      {url && (
        <div className="absolute w-full h-screen backdrop-blur-lg z-40">
          <div className="absolute top-1/4 left-1/3 z-50">
            <Card className="bg-zinc-600">
              <CardHeader>
                <CardTitle>{message}</CardTitle>
                <CardContent>{url}</CardContent>
                <CardFooter>
                  <Button onClick={() => clipBoardCopy(url)}>Copy</Button>
                </CardFooter>
              </CardHeader>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
