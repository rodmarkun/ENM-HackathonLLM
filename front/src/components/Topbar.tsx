"use client";

import { useRules, Rule, Property } from "../context/RulesContext";
import { useRef, useState } from "react";
import { Button } from "./ui/Button";
import { Modal } from "./ui/Modal";
import { sendContextFile } from "@/services/s3";

const propertyOptions: Record<Property, string[]> = {
  category: ["technical", "billing", "support"],
  sentiment: ["positive", "neutral", "negative"],
  priority: ["low", "mid", "high"],
};

export default function Topbar() {
  const { rules, addRule, removeRule } = useRules();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <Button onClick={() => setIsModalOpen(true)} size="md" color="accent">
        Config
      </Button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} className="border">
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
  );
}
