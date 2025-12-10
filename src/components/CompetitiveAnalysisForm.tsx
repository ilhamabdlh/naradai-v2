import React from "react";
import { useForm, Controller } from "react-hook-form";
import { CompetitiveAnalysis, CompetitiveAnalysisFormData } from "../types/competitiveAnalysis";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { X } from "lucide-react";

interface CompetitiveAnalysisFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CompetitiveAnalysisFormData) => void;
  onSubmitAndAddNew?: (data: CompetitiveAnalysisFormData) => void;
  initialData?: CompetitiveAnalysis | null;
  loading?: boolean;
}

export function CompetitiveAnalysisForm({ open, onOpenChange, onSubmit, onSubmitAndAddNew, initialData, loading }: CompetitiveAnalysisFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CompetitiveAnalysisFormData>({
    defaultValues: initialData || {
      name: "",
      share_of_voice: 0,
      sentiment: 0,
      engagement: 0,
      position: "",
      gap_to_leader: "",
      is_active: true,
      order: 0,
    },
    mode: "onBlur",
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        share_of_voice: initialData.share_of_voice,
        sentiment: initialData.sentiment,
        engagement: initialData.engagement,
        position: initialData.position || "",
        gap_to_leader: initialData.gap_to_leader || "",
        is_active: initialData.is_active,
        order: initialData.order,
      });
    } else {
      reset({
        name: "",
        share_of_voice: 0,
        sentiment: 0,
        engagement: 0,
        position: "",
        gap_to_leader: "",
        is_active: true,
        order: 0,
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: CompetitiveAnalysisFormData) => {
    onSubmit(data);
  };

  const onFormSubmitAndAddNew = (data: CompetitiveAnalysisFormData) => {
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
              {initialData ? "Edit Competitive Analysis" : "Create Competitive Analysis"}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? "Update the details below." : "Fill in the details to create a new analysis."}
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
            <Label className="text-xs font-medium text-slate-700">Brand/Competitor Name *</Label>
            <Input
              className="h-9"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Min 2 characters" },
              })}
              placeholder="e.g. Your Brand, Competitor A"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          {/* Share of Voice */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Share of Voice % *</Label>
            <Input
              type="number"
              step="0.1"
              className="h-9"
              {...register("share_of_voice", {
                required: "Share of Voice is required",
                min: { value: 0, message: "Min 0" },
                max: { value: 100, message: "Max 100" },
                valueAsNumber: true,
              })}
              placeholder="e.g. 32.0"
            />
            {errors.share_of_voice && <p className="text-xs text-red-500">{errors.share_of_voice.message}</p>}
          </div>

          {/* Sentiment */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Sentiment Score *</Label>
            <Input
              type="number"
              step="0.1"
              className="h-9"
              {...register("sentiment", {
                required: "Sentiment is required",
                min: { value: 0, message: "Min 0" },
                max: { value: 100, message: "Max 100" },
                valueAsNumber: true,
              })}
              placeholder="e.g. 72.0"
            />
            {errors.sentiment && <p className="text-xs text-red-500">{errors.sentiment.message}</p>}
          </div>

          {/* Engagement */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Engagement</Label>
            <Input
              type="number"
              step="0.1"
              className="h-9"
              {...register("engagement", {
                min: { value: 0, message: "Min 0" },
                valueAsNumber: true,
              })}
              placeholder="e.g. 8.4"
            />
            {errors.engagement && <p className="text-xs text-red-500">{errors.engagement.message}</p>}
          </div>

          {/* Position */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Position</Label>
            <Input
              className="h-9"
              {...register("position")}
              placeholder="e.g. #1 in Share of Voice"
            />
            <p className="text-xs text-slate-500">Summary card position text</p>
          </div>

          {/* Gap to Leader */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Gap to Leader</Label>
            <Input
              className="h-9"
              {...register("gap_to_leader")}
              placeholder="e.g. Leading by 4%"
            />
            <p className="text-xs text-slate-500">Summary card gap text</p>
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
                {loading ? "Saving..." : "Save and Add New Brand"}
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

