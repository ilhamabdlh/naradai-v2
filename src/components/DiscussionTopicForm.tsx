import React from "react";
import { useForm, Controller } from "react-hook-form";
import { DiscussionTopic, DiscussionTopicFormData } from "../types/discussionTopic";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { X } from "lucide-react";

interface DiscussionTopicFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DiscussionTopicFormData) => void;
  initialData?: DiscussionTopic | null;
  loading?: boolean;
}

const colorPresets = [
  { label: "Violet to Cyan", value: "linear-gradient(to right, #8b5cf6, #06b6d4)" },
  { label: "Purple to Blue", value: "linear-gradient(to right, #a855f7, #3b82f6)" },
  { label: "Blue to Cyan", value: "linear-gradient(to right, #3b82f6, #06b6d4)" },
  { label: "Green to Emerald", value: "linear-gradient(to right, #22c55e, #10b981)" },
  { label: "Orange to Red", value: "linear-gradient(to right, #f97316, #ef4444)" },
];

export function DiscussionTopicForm({ open, onOpenChange, onSubmit, initialData, loading }: DiscussionTopicFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<DiscussionTopicFormData>({
    defaultValues: initialData || {
      name: "",
      volume: 0,
      sentiment_score: 0,
      color: "linear-gradient(to right, #8b5cf6, #06b6d4)",
      is_active: true,
      order: 0,
    },
    mode: "onBlur",
  });

  const selectedColor = watch("color");

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        volume: initialData.volume,
        sentiment_score: initialData.sentiment_score,
        color: initialData.color || "linear-gradient(to right, #8b5cf6, #06b6d4)",
        is_active: initialData.is_active,
        order: initialData.order,
      });
    } else {
      reset({
        name: "",
        volume: 0,
        sentiment_score: 0,
        color: "linear-gradient(to right, #8b5cf6, #06b6d4)",
        is_active: true,
        order: 0,
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: DiscussionTopicFormData) => {
    onSubmit(data);
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false);
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {initialData ? "Edit Discussion Topic" : "Create Discussion Topic"}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? "Update the details below." : "Fill in the details to create a new topic."}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="p-4 space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Topic Name *</Label>
            <Input
              className="h-9"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Min 2 characters" },
              })}
              placeholder="e.g. Packaging, Customer Service"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Volume */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Volume (mentions) *</Label>
            <Input
              type="number"
              className="h-9"
              {...register("volume", {
                required: "Volume is required",
                min: { value: 0, message: "Min 0" },
                valueAsNumber: true,
              })}
              placeholder="e.g. 2500"
            />
            {errors.volume && <p className="text-xs text-red-500">{errors.volume.message}</p>}
          </div>

          {/* Sentiment Score */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Sentiment Score</Label>
            <Input
              type="number"
              step="0.01"
              className="h-9"
              {...register("sentiment_score", { valueAsNumber: true })}
              placeholder="e.g. -0.68 or +0.71"
            />
            <p className="text-xs text-slate-500">Range: -1.0 (negative) to +1.0 (positive)</p>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-700">Bar Color</Label>
            <div className="grid grid-cols-5 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setValue("color", preset.value)}
                  className={`h-8 rounded-lg border-2 transition-all ${
                    selectedColor === preset.value 
                      ? "border-violet-500 ring-2 ring-violet-200" 
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                  style={{ background: preset.value }}
                  title={preset.label}
                />
              ))}
            </div>
            <Input
              className="h-9 text-xs font-mono"
              {...register("color")}
              placeholder="Custom CSS gradient"
            />
          </div>

          {/* Order & Active */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Display Order</Label>
              <Input
                type="number"
                className="h-9"
                {...register("order", { min: 0, valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Active</Label>
              <div className="flex items-center h-9">
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
                <span className="ml-2 text-sm text-slate-600">
                  {watch("is_active") ? "Visible" : "Hidden"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-sm font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

