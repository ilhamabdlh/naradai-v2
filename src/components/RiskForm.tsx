import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Risk, RiskFormData, RiskIndicator } from "../types/risk";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { X, Plus, Trash2 } from "lucide-react";

interface RiskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RiskFormData) => void;
  initialData?: Risk | null;
  loading?: boolean;
}

export function RiskForm({ open, onOpenChange, onSubmit, initialData, loading }: RiskFormProps) {
  const [mitigationInput, setMitigationInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<RiskFormData>({
    defaultValues: initialData || {
      title: "",
      description: "",
      severity: "medium",
      probability: 50,
      impact_assessment: "",
      trend: "stable",
      indicators: [],
      mitigation_strategy: [],
      is_active: true,
      order: 0,
    },
    mode: "onBlur",
  });

  const { fields: indicatorFields, append: appendIndicator, remove: removeIndicator } = useFieldArray({
    control,
    name: "indicators",
  });

  const mitigationStrategies = watch("mitigation_strategy") || [];

  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        severity: initialData.severity,
        probability: initialData.probability,
        impact_assessment: initialData.impact_assessment,
        trend: initialData.trend,
        indicators: initialData.indicators || [],
        mitigation_strategy: initialData.mitigation_strategy || [],
        is_active: initialData.is_active,
        order: initialData.order,
      });
    } else {
      reset({
        title: "",
        description: "",
        severity: "medium",
        probability: 50,
        impact_assessment: "",
        trend: "stable",
        indicators: [],
        mitigation_strategy: [],
        is_active: true,
        order: 0,
      });
    }
  }, [initialData, reset, open]);

  const addMitigation = () => {
    if (mitigationInput.trim()) {
      setValue("mitigation_strategy", [...mitigationStrategies, mitigationInput.trim()]);
      setMitigationInput("");
    }
  };

  const removeMitigation = (index: number) => {
    setValue("mitigation_strategy", mitigationStrategies.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data: RiskFormData) => {
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
              {initialData ? "Edit Risk" : "Create New Risk"}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? "Update risk details below." : "Fill in the details to create a new risk."}
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
              placeholder="e.g. Declining Brand Sentiment"
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
              placeholder="Describe the risk..."
              rows={2}
              className="text-sm"
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          {/* Severity & Trend */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Severity *</Label>
              <Controller
                name="severity"
                control={control}
                rules={{ required: "Severity is required" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
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

          {/* Probability */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Probability (%) *</Label>
            <Input
              type="number"
              className="h-9"
              {...register("probability", {
                required: "Probability is required",
                min: { value: 0, message: "Min 0" },
                max: { value: 100, message: "Max 100" },
                valueAsNumber: true,
              })}
              placeholder="0-100"
            />
            {errors.probability && <p className="text-xs text-red-500">{errors.probability.message}</p>}
          </div>

          {/* Impact Assessment */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Impact Assessment *</Label>
            <Input
              className="h-9"
              {...register("impact_assessment", { required: "Impact assessment is required" })}
              placeholder="e.g. Brand reputation"
            />
            {errors.impact_assessment && <p className="text-xs text-red-500">{errors.impact_assessment.message}</p>}
          </div>

          {/* Indicators */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-slate-700">Indicators</Label>
              <button
                type="button"
                onClick={() => appendIndicator({ label: "", value: 0, change: 0 })}
                className="text-xs text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Indicator
              </button>
            </div>
            {indicatorFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start p-2 bg-slate-50 rounded-lg">
                <Input
                  className="h-8 text-sm flex-1"
                  placeholder="Label"
                  {...register(`indicators.${index}.label`)}
                />
                <Input
                  type="number"
                  step="0.01"
                  className="h-8 text-sm w-20"
                  placeholder="Value"
                  {...register(`indicators.${index}.value`, { valueAsNumber: true })}
                />
                <Input
                  type="number"
                  className="h-8 text-sm w-20"
                  placeholder="Change %"
                  {...register(`indicators.${index}.change`, { valueAsNumber: true })}
                />
                <button
                  type="button"
                  onClick={() => removeIndicator(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Mitigation Strategy */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-700">Mitigation Strategy</Label>
            <div className="flex gap-2">
              <Input
                className="h-9 flex-1"
                value={mitigationInput}
                onChange={(e) => setMitigationInput(e.target.value)}
                placeholder="Add a mitigation step..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addMitigation();
                  }
                }}
              />
              <button
                type="button"
                onClick={addMitigation}
                className="px-3 py-2 bg-violet-100 text-violet-700 rounded-lg text-sm hover:bg-violet-200"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {mitigationStrategies.map((strategy, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg text-sm">
                  <span className="flex-1">{strategy}</span>
                  <button
                    type="button"
                    onClick={() => removeMitigation(index)}
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
              className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Saving..." : initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



