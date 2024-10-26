"use client";

import { useRef } from "react";
import { Button } from "./ui/Button";

export default function Topbar() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full flex items-center justify-end gap-2 bg-foreground p-4 text-right text-text rounded-md shadow-md">
      <p className="text-sm w-[400px]">
        Upload a document with your company's information or guidelines to help
        improve the accuracy of responses {"\u2192"}
      </p>

      <Button
        onClick={() => fileInputRef.current?.click()}
        size="md"
        color="accent"
      >
        Upload Context
      </Button>

      {/* Disimula el input type file */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            //FIXME: guardar el file con el contexto
            console.log("File selected:", file);
          }
        }}
      />
    </div>
  );
}
