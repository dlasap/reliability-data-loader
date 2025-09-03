"use client";
import React, { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function SupportProvider({ children }) {
  const [supportText, setSupportText] = useState(null);
  return (
    <Ctx.Provider value={{ supportText, setSupportText }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSupport() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSupport must be used within <SupportProvider>");
  return ctx;
}
