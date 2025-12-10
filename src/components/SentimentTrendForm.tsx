import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { SentimentTrend, SentimentTrendFormData, SentimentDataPoint } from "../types/sentimentTrend";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { X, Plus, Trash2 } from "lucide-react";

interface SentimentTrendFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SentimentTrendFormData) => void;
  initialData?: SentimentTrend | null;
  loading?: boolean;
}

export function SentimentTrendForm({ open, onOpenChange, onSubmit, initialData, loading }: SentimentTrendFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<SentimentTrendFormData>({
    defaultValues: initialData || {
      title: "Sentiment Trends",
      period: "Last 30 days",
      positive_percent: 58,
      negative_percent: 32,
      neutral_percent: 10,
      trend_data: [
        { date: "Nov 1", positive: 68, negative: 22 },
        { date: "Nov 5", positive: 72, negative: 18 },
        { date: "Nov 9", positive: 75, negative: 15 },
        { date: "Nov 13", positive: 71, negative: 19 },
        { date: "Nov 17", positive: 65, negative: 25 },
        { date: "Nov 21", positive: 62, negative: 28 },
        { date: "Nov 25", positive: 58, negative: 32 },
      ],
      is_active: true,
      order: 0,
    },
    mode: "onBlur",
  });

  const { fields: dataPointFields, append: appendDataPoint, remove: removeDataPoint } = useFieldArray({
    control,
    name: "trend_data",
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        period: initialData.period,
        positive_percent: initialData.positive_percent,
        negative_percent: initialData.negative_percent,
        neutral_percent: initialData.neutral_percent,
        trend_data: initialData.trend_data || [],
        is_active: initialData.is_active,
        order: initialData.order,
      });
    } else {
      reset({
        title: "Sentiment Trends",
        period: "Last 30 days",
        positive_percent: 58,
        negative_percent: 32,
        neutral_percent: 10,
        trend_data: [
          { date: "Nov 1", positive: 68, negative: 22 },
          { date: "Nov 5", positive: 72, negative: 18 },
          { date: "Nov 9", positive: 75, negative: 15 },
          { date: "Nov 13", positive: 71, negative: 19 },
          { date: "Nov 17", positive: 65, negative: 25 },
          { date: "Nov 21", positive: 62, negative: 28 },
          { date: "Nov 25", positive: 58, negative: 32 },
        ],
        is_active: true,
        order: 0,
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: SentimentTrendFormData) => {
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
              {initialData ? "Edit Sentiment Trend" : "Create New Sentiment Trend"}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? "Update sentiment trend details below." : "Fill in the details to create a new sentiment trend."}
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
              placeholder="e.g. Sentiment Trends"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          {/* Period */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Period *</Label>
            <Input
              className="h-9"
              {...register("period", { required: "Period is required" })}
              placeholder="e.g. Last 30 days"
            />
            {errors.period && <p className="text-xs text-red-500">{errors.period.message}</p>}
          </div>

          {/* Percentages */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Positive % *</Label>
              <Input
                type="number"
                step="0.01"
                className="h-9"
                {...register("positive_percent", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 100, message: "Max 100" },
                  valueAsNumber: true,
                })}
                placeholder="0-100"
              />
              {errors.positive_percent && <p className="text-xs text-red-500">{errors.positive_percent.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Negative % *</Label>
              <Input
                type="number"
                step="0.01"
                className="h-9"
                {...register("negative_percent", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 100, message: "Max 100" },
                  valueAsNumber: true,
                })}
                placeholder="0-100"
              />
              {errors.negative_percent && <p className="text-xs text-red-500">{errors.negative_percent.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Neutral % *</Label>
              <Input
                type="number"
                step="0.01"
                className="h-9"
                {...register("neutral_percent", {
                  required: "Required",
                  min: { value: 0, message: "Min 0" },
                  max: { value: 100, message: "Max 100" },
                  valueAsNumber: true,
                })}
                placeholder="0-100"
              />
              {errors.neutral_percent && <p className="text-xs text-red-500">{errors.neutral_percent.message}</p>}
            </div>
          </div>

          {/* Trend Data Points */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-slate-700">Trend Data Points</Label>
              <button
                type="button"
                onClick={() => appendDataPoint({ date: "", positive: 0, negative: 0 })}
                className="text-xs text-violet-600 hover:text-violet-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Data Point
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dataPointFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start p-2 bg-slate-50 rounded-lg">
                  <Input
                    className="h-8 text-sm flex-1"
                    placeholder="Date (e.g. Nov 1)"
                    {...register(`trend_data.${index}.date`)}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 text-sm w-24"
                    placeholder="Positive"
                    {...register(`trend_data.${index}.positive`, { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    step="0.01"
                    className="h-8 text-sm w-24"
                    placeholder="Negative"
                    {...register(`trend_data.${index}.negative`, { valueAsNumber: true })}
                  />
                  <button
                    type="button"
                    onClick={() => removeDataPoint(index)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
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
