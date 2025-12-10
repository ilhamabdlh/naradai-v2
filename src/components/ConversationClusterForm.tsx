import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ConversationCluster, ConversationClusterFormData } from "../types/conversationCluster";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { X, Plus, Trash2 } from "lucide-react";

interface ConversationClusterFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ConversationClusterFormData) => void;
  onSubmitAndAddNew?: (data: ConversationClusterFormData) => void;
  initialData?: ConversationCluster | null;
  loading?: boolean;
}

export function ConversationClusterForm({ open, onOpenChange, onSubmit, onSubmitAndAddNew, initialData, loading }: ConversationClusterFormProps) {
  const [keywordInput, setKeywordInput] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ConversationClusterFormData>({
    defaultValues: initialData || {
      theme: "",
      size: 0,
      sentiment: 0,
      trend: "stable",
      keywords: [],
      is_active: true,
      order: 0,
    },
    mode: "onBlur",
  });

  const keywords = watch("keywords") || [];

  React.useEffect(() => {
    if (initialData) {
      reset({
        theme: initialData.theme,
        size: initialData.size,
        sentiment: initialData.sentiment,
        trend: initialData.trend,
        keywords: initialData.keywords || [],
        is_active: initialData.is_active,
        order: initialData.order,
      });
    } else {
      reset({
        theme: "",
        size: 0,
        sentiment: 0,
        trend: "stable",
        keywords: [],
        is_active: true,
        order: 0,
      });
    }
  }, [initialData, reset, open]);

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setValue("keywords", [...keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    setValue("keywords", newKeywords);
  };

  const onFormSubmit = (data: ConversationClusterFormData) => {
    onSubmit(data);
  };

  const onFormSubmitAndAddNew = (data: ConversationClusterFormData) => {
    if (onSubmitAndAddNew) {
      onSubmitAndAddNew(data);
    } else {
      onSubmit(data);
    }
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
              {initialData ? "Edit Conversation Cluster" : "Create Conversation Cluster"}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? "Update the details below." : "Fill in the details to create a new cluster."}
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
          {/* Theme */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Theme *</Label>
            <Input
              className="h-9"
              {...register("theme", {
                required: "Theme is required",
                minLength: { value: 2, message: "Min 2 characters" },
              })}
              placeholder="e.g. Packaging Damage Issues"
            />
            {errors.theme && <p className="text-xs text-red-500">{errors.theme.message}</p>}
          </div>

          {/* Size (Mentions) */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Mentions (Size) *</Label>
            <Input
              type="number"
              className="h-9"
              {...register("size", {
                required: "Size is required",
                min: { value: 0, message: "Min 0" },
                valueAsNumber: true,
              })}
              placeholder="e.g. 2847"
            />
            {errors.size && <p className="text-xs text-red-500">{errors.size.message}</p>}
          </div>

          {/* Sentiment */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Sentiment Score</Label>
            <Input
              type="number"
              step="0.01"
              className="h-9"
              {...register("sentiment", { valueAsNumber: true })}
              placeholder="e.g. -0.68 or +0.71"
            />
            <p className="text-xs text-slate-500">Range: -1.0 (negative) to +1.0 (positive)</p>
          </div>

          {/* Trend */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Trend</Label>
            <Controller
              name="trend"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select trend" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="up">Up</SelectItem>
                    <SelectItem value="down">Down</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-700">Keywords</Label>
            <div className="flex gap-2">
              <Input
                className="h-9 flex-1"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
                placeholder="Enter keyword and press Enter"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-3 py-2 h-9 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200 min-h-[60px]">
                {keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2.5 py-1 bg-violet-100 border border-violet-200 rounded-md text-xs text-violet-700"
                  >
                    <span>{keyword}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="ml-1 hover:text-violet-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
          <div className="flex flex-col gap-2 pt-2">
            {!initialData && onSubmitAndAddNew && (
              <button
                type="button"
                onClick={handleSubmit(onFormSubmitAndAddNew)}
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:opacity-90 transition-opacity text-sm font-medium disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Saving..." : "Save and Add New Cluster"}
              </button>
            )}
            <div className="flex gap-3">
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
                {loading ? "Saving..." : initialData ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

