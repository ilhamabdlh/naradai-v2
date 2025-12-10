import React from "react";
import { useForm, Controller } from "react-hook-form";
import { PriorityAction, PriorityActionFormData } from "../types/priorityAction";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Package, MessageSquare, Zap, AlertTriangle, Target, X } from "lucide-react";

interface PriorityActionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PriorityActionFormData) => void;
  initialData?: PriorityAction | null;
  loading?: boolean;
}

const iconOptions = [
  { value: "Package", label: "Package", icon: Package },
  { value: "MessageSquare", label: "Message Square", icon: MessageSquare },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "AlertTriangle", label: "Alert Triangle", icon: AlertTriangle },
  { value: "Target", label: "Target", icon: Target },
];

export function PriorityActionForm({ open, onOpenChange, onSubmit, initialData, loading }: PriorityActionFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PriorityActionFormData>({
    defaultValues: initialData || {
      priority: "medium",
      title: "",
      description: "",
      impact: "Medium",
      effort: "Medium",
      recommendation: "",
      mentions: 0,
      sentiment: 0,
      trend: "stable",
      icon: "Package",
      status: "not-started",
    },
    mode: "onBlur",
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      reset({
        priority: initialData.priority,
        title: initialData.title,
        description: initialData.description,
        impact: initialData.impact,
        effort: initialData.effort,
        recommendation: initialData.recommendation,
        mentions: initialData.mentions,
        sentiment: initialData.sentiment,
        trend: initialData.trend,
        icon: initialData.icon,
        status: initialData.status || "not-started",
      });
    } else {
      reset({
        priority: "medium",
        title: "",
        description: "",
        impact: "Medium",
        effort: "Medium",
        recommendation: "",
        mentions: 0,
        sentiment: 0,
        trend: "stable",
        icon: "Package",
        status: "not-started",
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: PriorityActionFormData) => {
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
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {initialData ? "Edit Priority Action" : "Create New Priority Action"}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? "Update the details below." : "Fill in the details to create a new action."}
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
          {/* Icon */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Icon *</Label>
            <Controller
              name="icon"
              control={control}
              rules={{ required: "Icon is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.icon && <p className="text-xs text-red-500">{errors.icon.message}</p>}
          </div>

          {/* Title */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Title *</Label>
            <Input
              className="h-9"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
              placeholder="Enter action title"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Description *</Label>
            <Textarea
              {...register("description", {
                required: "Description is required",
                minLength: { value: 10, message: "Min 10 characters" },
              })}
              placeholder="Enter action description"
              rows={2}
              className="text-sm"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Priority */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Priority *</Label>
            <Controller
              name="priority"
              control={control}
              rules={{ required: "Priority is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Impact & Effort */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Impact *</Label>
              <Controller
                name="impact"
                control={control}
                rules={{ required: "Impact is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Effort *</Label>
              <Controller
                name="effort"
                control={control}
                rules={{ required: "Effort is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Mentions *</Label>
              <Input
                type="number"
                className="h-9"
                {...register("mentions", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  valueAsNumber: true,
                })}
                placeholder="0"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Sentiment *</Label>
              <Input
                type="number"
                step="0.01"
                className="h-9"
                {...register("sentiment", {
                  required: "Required",
                  valueAsNumber: true,
                })}
                placeholder="0.00"
              />
              {errors.sentiment && <p className="text-xs text-red-500">{errors.sentiment.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Trend *</Label>
              <Controller
                name="trend"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increasing">Increasing</SelectItem>
                      <SelectItem value="decreasing">Decreasing</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">AI Recommendation *</Label>
            <Textarea
              {...register("recommendation", {
                required: "Recommendation is required",
                minLength: { value: 10, message: "Min 10 characters" },
              })}
              placeholder="Enter AI recommendation"
              rows={2}
              className="text-sm"
            />
            {errors.recommendation && <p className="text-xs text-red-500">{errors.recommendation.message}</p>}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2 relative z-10">
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
