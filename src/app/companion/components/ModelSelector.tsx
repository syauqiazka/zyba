"use client";

import { useState } from "react";
import { AIModelType } from "@/backend/ai/aiModelManager";

interface Props {
  selectedModel: AIModelType;
  setSelectedModel: (model: AIModelType) => void;
}

export default function ModelSelector({ selectedModel, setSelectedModel }: Props) {
  return (
    <div className="flex items-center gap-1.5 bg-white border border-brown-900/10 rounded-full px-3 py-1 shadow-sm">
      <span className="text-xs font-bold text-brown-700">Model:</span>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value as AIModelType)}
        className="bg-transparent text-xs font-bold text-brown-900 focus:outline-none cursor-pointer"
      >
        <option value="gemini-1.5-flash">Gemini 1.5 Flash ⚡</option>
        <option value="gemini-1.5-pro">Gemini 1.5 Pro ✨</option>
        <option value="gpt-4o">OpenAI GPT-4o 🤖</option>
        <option value="llama-3.3-70b">Groq Llama 3.3 🦙</option>
        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet 🎨</option>
      </select>
    </div>
  );
}
