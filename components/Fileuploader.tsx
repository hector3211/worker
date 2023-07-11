"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function Uploader() {
  const [filecont, setFileCont] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileCont(file);
      setImgUrl(URL.createObjectURL(file));
      console.log(`the file contents are: ${filecont}`);
    }
  }
  return (
    <div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" onChange={handleFile} />
      </div>
      {imgUrl && (
        <div>
          <p>Image</p>
          <img src={imgUrl} alt="what the heck" />
        </div>
      )}
    </div>
  );
}
