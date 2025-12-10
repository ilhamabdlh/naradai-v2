import React from "react";
import { useForm, Controller } from "react-hook-form";
import { DashboardStat, DashboardStatFormData } from "../types/dashboardStat";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Users, TrendingDown, AlertTriangle, TrendingUp, BarChart3, Activity, Percent, Eye, X } from "lucide-react";

interface DashboardStatFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DashboardStatFormData) => void;
  initialData?: DashboardStat | null;
  loading?: boolean;
}

const iconOptions = [
  { value: "Users", label: "Users", icon: Users },
  { value: "TrendingUp", label: "Trending Up", icon: TrendingUp },
  { value: "TrendingDown", label: "Trending Down", icon: TrendingDown },
  { value: "AlertTriangle", label: "Alert Triangle", icon: AlertTriangle },
  { value: "BarChart3", label: "Bar Chart", icon: BarChart3 },
  { value: "Activity", label: "Activity", icon: Activity },
  { value: "Percent", label: "Percent", icon: Percent },
  { value: "Eye", label: "Eye (Views)", icon: Eye },
];

export function DashboardStatForm({ open, onOpenChange, onSubmit, initialData, loading }: DashboardStatFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<DashboardStatFormData>({
    defaultValues: initialData || {
      label: "",
      value: "",
      change: "",
      trend: "up",
      icon: "BarChart3",
      order: 0,
      is_active: true,
    },
    mode: "onBlur",
  });

  // Reset form when initialData changes
  React.useEffect(() => {
    if (initialData) {
      reset({
        label: initialData.label,
        value: initialData.value,
        change: initialData.change,
        trend: initialData.trend,
        icon: initialData.icon,
        order: initialData.order,
        is_active: initialData.is_active,
      });
    } else {
      reset({
        label: "",
        value: "",
        change: "",
        trend: "up",
        icon: "BarChart3",
        order: 0,
        is_active: true,
      });
    }
  }, [initialData, reset, open]);

  const onFormSubmit = (data: DashboardStatFormData) => {
    onSubmit(data);
  };

  if (!open) return null;

  const selectedIcon = watch("icon");
  const SelectedIconComponent = iconOptions.find(opt => opt.value === selectedIcon)?.icon || BarChart3;

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
              {initialData ? "Edit Dashboard Stat" : "Create New Dashboard Stat"}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData ? "Update the stat card details below." : "Fill in the details to create a new stat card."}
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Preview Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500 mb-2">Preview</p>
          <div className="relative overflow-hidden rounded-2xl bg-white backdrop-blur-sm border border-slate-200 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-cyan-100 flex items-center justify-center">
                <SelectedIconComponent className="w-5 h-5 text-violet-600" />
              </div>
              <span
                className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                  watch("trend") === "up"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {watch("change") || "+0%"}
              </span>
            </div>
            <div>
              <div className="text-2xl text-slate-900 mb-0.5">{watch("value") || "0"}</div>
              <div className="text-xs text-slate-600">{watch("label") || "Label"}</div>
            </div>
          </div>
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

          {/* Label */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Label *</Label>
            <Input
              className="h-9"
              {...register("label", {
                required: "Label is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
              placeholder="e.g. Conversations Analyzed"
            />
            {errors.label && <p className="text-xs text-red-500">{errors.label.message}</p>}
          </div>

          {/* Value */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-700">Value *</Label>
            <Input
              className="h-9"
              {...register("value", {
                required: "Value is required",
              })}
              placeholder="e.g. 847.2K"
            />
            {errors.value && <p className="text-xs text-red-500">{errors.value.message}</p>}
          </div>

          {/* Change & Trend */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Change *</Label>
              <Input
                className="h-9"
                {...register("change", {
                  required: "Change is required",
                })}
                placeholder="e.g. +12.5%"
              />
              {errors.change && <p className="text-xs text-red-500">{errors.change.message}</p>}
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
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="up">Up (Green)</SelectItem>
                      <SelectItem value="down">Down (Red)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Order & Active */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Display Order</Label>
              <Input
                type="number"
                className="h-9"
                {...register("order", {
                  min: { value: 0, message: "Min 0" },
                  valueAsNumber: true,
                })}
                placeholder="0"
              />
              {errors.order && <p className="text-xs text-red-500">{errors.order.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-slate-700">Active</Label>
              <div className="flex items-center h-9">
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
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



