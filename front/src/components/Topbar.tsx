/* eslint-disable react/no-unescaped-entities */
import { useRules, Rule, Property } from "../context/RulesContext";
import { useRef, useState } from "react";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { sendContextFile } from "@/services/s3";
import { cn } from "@/lib/utils";

const propertyOptions: Record<Property, string[]> = {
  category: ["technical", "billing", "support"],
  sentiment: ["positive", "neutral", "negative"],
  priority: ["low", "mid", "high"],
};

type Props = {
  activeView: "tickets" | "answered";
  onViewChange: (view: "tickets" | "answered") => void;
};

export default function Topbar({ activeView, onViewChange }: Props) {
  const { rules, addRule, removeRule } = useRules();
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddRule = (value: string) => {
    if (!selectedProperty) return;
    const newRule: Rule = {
      property: selectedProperty,
      value,
      strategy: "autoAnswer",
    };
    addRule(newRule);
  };

  return (
    <div className="w-full flex items-center justify-between bg-foreground p-4 text-text rounded-md shadow-md">
      <div className="rounded-md">
        <Button
          onClick={() => onViewChange("tickets")}
          size="md"
          color="muted"
          className={cn(
            "rounded-r-none border-r",
            activeView === "tickets" && "bg-accent text-accent-foreground"
          )}
        >
          Tickets
        </Button>
        <Button
          onClick={() => onViewChange("answered")}
          size="md"
          color="muted"
          className={cn(
            "rounded-l-none border-l",
            activeView === "answered" && "bg-accent text-accent-foreground"
          )}
        >
          Answered
        </Button>
      </div>
      <div className="flex gap-2">
        <div className="relative group inline-block">
          <Button
            onClick={() => fileInputRef.current?.click()}
            size="md"
            color="accent"
          >
            Upload Context
          </Button>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/80 text-white rounded text-xs w-[400px] text-center z-50 pointer-events-none">
            Upload a document with your company's information or guidelines to
            help improve the accuracy of responses
          </span>
        </div>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) {
              return;
            }
            sendContextFile(file);
          }}
        />
        <div className="relative group inline-block">
          <Button
            onClick={() => setIsConfigModalOpen(true)}
            size="md"
            color="accent"
          >
            Config
          </Button>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/80 text-white rounded text-xs w-[190px] text-center z-50 pointer-events-none">
            Set your strategy config
          </span>
        </div>
        {isConfigModalOpen && (
          <Modal onClose={() => setIsConfigModalOpen(false)} className="border">
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Strategy Rules Configuration
              </h2>

              <div className="flex gap-2 mb-6">
                {Object.keys(propertyOptions).map((prop) => (
                  <Button
                    key={prop}
                    onClick={() => setSelectedProperty(prop as Property)}
                    size="md"
                    color={selectedProperty === prop ? "accent" : "none"}
                  >
                    {prop}
                  </Button>
                ))}
              </div>

              {selectedProperty && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">
                    Select value for {selectedProperty}:
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {propertyOptions[selectedProperty].map((value) => (
                      <Button
                        key={value}
                        onClick={() => handleAddRule(value)}
                        size="md"
                        color="none"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {rules.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Active Rules:</h3>
                  <div className="space-y-2">
                    {rules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-background p-2 rounded"
                      >
                        <span>
                          {rule.property} = {rule.value} → {rule.strategy}
                        </span>
                        <Button
                          size="md"
                          color="none"
                          onClick={() => removeRule(rule)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
