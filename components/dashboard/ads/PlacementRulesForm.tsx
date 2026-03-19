"use client";

import { Plus, Trash2 } from "lucide-react";
import type { CreatePlacementRulePayload, PlacementType } from "../../../src/types/reach_ads.types";
import { PLACEMENT_TYPES } from "../../../src/types/reach_ads.types";

interface PlacementRulesFormProps {
  rules: CreatePlacementRulePayload[];
  onChange: (rules: CreatePlacementRulePayload[]) => void;
}

const placementLabels: Record<PlacementType, string> = {
  welcome: "Welcome",
  mid_conversation: "Mid Conversation",
  post_response: "Post Response",
  fallback: "Fallback",
};

function emptyRule(): CreatePlacementRulePayload {
  return {
    placementType: "mid_conversation",
    priority: 0,
    maxImpressionsPerSession: 2,
    cooldownMinutes: 10,
    enabled: true,
  };
}

export default function PlacementRulesForm({ rules, onChange }: PlacementRulesFormProps) {
  const addRule = () => onChange([...rules, emptyRule()]);

  const removeRule = (index: number) =>
    onChange(rules.filter((_, i) => i !== index));

  const updateRule = (index: number, field: string, value: unknown) => {
    const updated = rules.map((rule, i) =>
      i === index ? { ...rule, [field]: value } : rule
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Placement Rules</h3>
        <button
          type="button"
          onClick={addRule}
          className="inline-flex items-center gap-1.5 text-sm text-purple-800 hover:text-purple-800 font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      {rules.length === 0 && (
        <p className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-200 rounded-lg">
          No placement rules configured. Add one to control where the ad appears.
        </p>
      )}

      {rules.map((rule, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Rule {index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeRule(index)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Placement Type
              </label>
              <select
                value={rule.placementType}
                onChange={(e) =>
                  updateRule(index, "placementType", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              >
                {PLACEMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {placementLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Priority
              </label>
              <input
                type="number"
                min={0}
                value={rule.priority ?? 0}
                onChange={(e) =>
                  updateRule(index, "priority", parseInt(e.target.value) || 0)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-pruple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Max Impressions / Session
              </label>
              <input
                type="number"
                min={1}
                value={rule.maxImpressionsPerSession ?? ""}
                onChange={(e) =>
                  updateRule(
                    index,
                    "maxImpressionsPerSession",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                placeholder="Unlimited"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Cooldown (minutes)
              </label>
              <input
                type="number"
                min={0}
                value={rule.cooldownMinutes ?? ""}
                onChange={(e) =>
                  updateRule(
                    index,
                    "cooldownMinutes",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                placeholder="None"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rule.enabled !== false}
              onChange={(e) => updateRule(index, "enabled", e.target.checked)}
              className="rounded border-gray-300 text-purple-800 focus:ring-purple-600"
            />
            <span className="text-sm text-gray-600">Enabled</span>
          </label>
        </div>
      ))}
    </div>
  );
}
