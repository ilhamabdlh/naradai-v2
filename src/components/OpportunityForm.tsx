import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Opportunity, OpportunityFormData, KeyMetric } from "../types/opportunity";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { X, Plus, Trash2 } from "lucide-react";

interface OpportunityFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: OpportunityFormData) => void;
  initialData?: Opportunity | null;
  loading?: boolean;
}

const categoryOptions = [
  "Product positioning",
  "Market expansion",
  "Brand awareness",
  "Customer engagement",
  "Revenue growth",
  "Cost optimization",
];

export function OpportunityForm({ open, onOpenChange, onSubmit, initialData, loading }: OpportunityFormProps) {
  const [actionInput, setActionInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<OpportunityFormData>({
    defaultValues: initialData || {
      title: "",
      description: "",
      potential: "medium",
      confidence_score: 50,
      timeframe: "Medium-term",
      category: "Product positioning",
      trend: "stable",
      key_metrics: [],
      recommended_actions: [],
      is_active: true,
      order: 0,
    },
    mode: "onBlur",
  });

  const { fields: metricFields, append: appendMetric, remove: removeMetric } = useFieldArray({
    control,
    name: "key_metrics",
  });

  const recommendedActions = watch("recommended_actions") || [];

  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        potential: initialData.potential,
        confidence_score: initialData.confidence_score,
        timeframe: initialData.timeframe,
        category: initialData.category,
        trend: initialData.trend,
        key_metrics: initialData.key_metrics || [],
        recommended_actions: initialData.recommended_actions || [],
        is_active: initialData.is_active,
        order: initialData.order,
      });
    } else {
      reset({
        title: "",
        description: "",
        potential: "medium",
        confidence_score: 50,
        timeframe: "Medium-term",
        category: "Product positioning",
        trend: "stable",
        key_metrics: [],
        recommended_actions: [],
        is_active: true,
        order: 0,
      });
    }
  }, [initialData, reset, open]);

  const addAction = () => {
    if (actionInput.trim()) {
      setValue("recommended_actions", [...recommendedActions, actionInput.trim()]);
      setActionInput("");
    }
  };

  const removeAction = (index: number) => {
    setValue("recommended_actions", recommendedActions.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data: OpportunityFormData) => {
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
              {initialData ? "Edit Opportunity" : "Create New Opportunity"}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? "Update opportunity details below." : "Fill in the details to create a new opportunity."}
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
          {/* Title */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Title *</Label>
            <Input
              className="h-9"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
              placeholder="e.g. Sustainability Movement Alignment"
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
              placeholder="Describe the opportunity..."
              rows={2}
              className="text-sm"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Potential & Trend */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Potential *</Label>
              <Controller
                name="potential"
                control={control}
                rules={{ required: "Potential is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select potential" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Potential</SelectItem>
                      <SelectItem value="medium">Medium Potential</SelectItem>
                      <SelectItem value="low">Low Potential</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Trend *</Label>
              <Controller
                name="trend"
                control={control}
                rules={{ required: "Trend is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select trend" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increasing">Increasing</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="decreasing">Decreasing</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Confidence Score */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Confidence Score (%) *</Label>
            <Input
              type="number"
              className="h-9"
              {...register("confidence_score", {
                required: "Confidence score is required",
                min: { value: 0, message: "Min 0" },
                max: { value: 100, message: "Max 100" },
                valueAsNumber: true,
              })}
              placeholder="0-100"
            />
            {errors.confidence_score && <p className="text-xs text-red-500">{errors.confidence_score.message}</p>}
          </div>

          {/* Timeframe & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Timeframe *</Label>
              <Controller
                name="timeframe"
                control={control}
                rules={{ required: "Timeframe is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Short-term">Short-term</SelectItem>
                      <SelectItem value="Medium-term">Medium-term</SelectItem>
                      <SelectItem value="Long-term">Long-term</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Category *</Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-slate-700">Key Metrics</Label>
              <button
                type="button"
                onClick={() => appendMetric({ label: "", value: "" })}
                className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Metric
              </button>
            </div>
            {metricFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start p-2 bg-slate-50 rounded-lg">
                <Input
                  className="h-8 text-sm flex-1"
                  placeholder="Label (e.g. Segment Size)"
                  {...register(`key_metrics.${index}.label`)}
                />
                <Input
                  className="h-8 text-sm flex-1"
                  placeholder="Value (e.g. 156,000)"
                  {...register(`key_metrics.${index}.value`)}
                />
                <button
                  type="button"
                  onClick={() => removeMetric(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Recommended Actions */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-700">Recommended Actions</Label>
            <div className="flex gap-2">
              <Input
                className="h-9 flex-1"
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                placeholder="Add a recommended action..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAction();
                  }
                }}
              />
              <button
                type="button"
                onClick={addAction}
                className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {recommendedActions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-sm">
                  <span className="flex-1">{action}</span>
                  <button
                    type="button"
                    onClick={() => removeAction(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
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
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



