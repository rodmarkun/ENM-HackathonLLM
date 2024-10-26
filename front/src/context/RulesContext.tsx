"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Property = "category" | "sentiment" | "priority";
export type Strategy = "template" | "autoAnswer";

export interface Rule {
  property: Property;
  value: string;
  strategy: Strategy;
}

interface RulesContextType {
  rules: Rule[];
  addRule: (rule: Rule) => void;
  removeRule: (rule: Rule) => void;
}

const RulesContext = createContext<RulesContextType | undefined>(undefined);

export const RulesProvider = ({ children }: { children: ReactNode }) => {
  const [rules, setRules] = useState<Rule[]>([]);

  const addRule = (rule: Rule) => {
    setRules((prevRules) => {
      const filteredRules = prevRules.filter(
        (r) => !(r.property === rule.property && r.value === rule.value)
      );
      return [...filteredRules, rule];
    });
  };

  const removeRule = (ruleToRemove: Rule) => {
    setRules((prevRules) =>
      prevRules.filter(
        (rule) =>
          !(
            rule.property === ruleToRemove.property &&
            rule.value === ruleToRemove.value
          )
      )
    );
  };

  return (
    <RulesContext.Provider value={{ rules, addRule, removeRule }}>
      {children}
    </RulesContext.Provider>
  );
};

export const useRules = () => {
  const context = useContext(RulesContext);
  if (!context) {
    throw new Error("useRules must be used within a RulesProvider");
  }
  return context;
};
