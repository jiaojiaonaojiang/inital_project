"use client";

import { Clock } from "lucide-react";

interface ScheduleFormProps {
  startAt: string;
  endAt: string;
  timezone: string;
  isPrimeTimeEnabled: boolean;
  onChange: (field: string, value: string | boolean) => void;
}

const TIMEZONES = [
  "UTC",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Perth",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Singapore",
];

export default function ScheduleForm({
  startAt,
  endAt,
  timezone,
  isPrimeTimeEnabled,
  onChange,
}: ScheduleFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Schedule &amp; Timing
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => onChange("startAt", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => onChange("endAt", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Timezone
        </label>
        <select
          value={timezone}
          onChange={(e) => onChange("timezone", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50 cursor-pointer">
        <input
          type="checkbox"
          checked={isPrimeTimeEnabled}
          onChange={(e) => onChange("isPrimeTimeEnabled", e.target.checked)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
        />
        <div>
          <span className="text-sm font-medium text-gray-700">
            Enable Prime-Time Visibility
          </span>
          <p className="text-xs text-gray-500 mt-0.5">
            Boost ad visibility during peak hours for maximum engagement.
          </p>
        </div>
      </label>
    </div>
  );
}
