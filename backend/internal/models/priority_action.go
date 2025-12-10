package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Priority string

const (
	PriorityCritical Priority = "critical"
	PriorityHigh     Priority = "high"
	PriorityMedium   Priority = "medium"
)

type Impact string

const (
	ImpactCritical Impact = "Critical"
	ImpactHigh     Impact = "High"
	ImpactMedium   Impact = "Medium"
	ImpactLow      Impact = "Low"
)

type Effort string

const (
	EffortLow    Effort = "Low"
	EffortMedium Effort = "Medium"
	EffortHigh   Effort = "High"
)

type Trend string

const (
	TrendIncreasing Trend = "increasing"
	TrendDecreasing Trend = "decreasing"
	TrendStable     Trend = "stable"
)

type Status string

const (
	StatusNotStarted Status = "not-started"
	StatusInProgress Status = "in-progress"
	StatusCompleted  Status = "completed"
)

type PriorityAction struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Priority       Priority           `json:"priority" bson:"priority" validate:"required,oneof=critical high medium"`
	Title          string             `json:"title" bson:"title" validate:"required,min=3,max=255"`
	Description    string             `json:"description" bson:"description" validate:"required,min=10"`
	Impact         Impact             `json:"impact" bson:"impact" validate:"required,oneof=Critical High Medium Low"`
	Effort         Effort             `json:"effort" bson:"effort" validate:"required,oneof=Low Medium High"`
	Recommendation string             `json:"recommendation" bson:"recommendation" validate:"required,min=10"`
	Mentions       int                `json:"mentions" bson:"mentions" validate:"required,min=0"`
	Sentiment      float64            `json:"sentiment" bson:"sentiment" validate:"required"`
	Trend          Trend              `json:"trend" bson:"trend" validate:"required,oneof=increasing decreasing stable"`
	Icon           string             `json:"icon" bson:"icon" validate:"required"`
	Status         Status             `json:"status" bson:"status" validate:"omitempty,oneof=not-started in-progress completed"`
	CreatedAt      time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt      time.Time          `json:"updated_at" bson:"updated_at"`
}

// ToResponse converts ObjectID to string for JSON response
func (pa *PriorityAction) ToResponse() map[string]interface{} {
	return map[string]interface{}{
		"id":             pa.ID.Hex(),
		"priority":       pa.Priority,
		"title":          pa.Title,
		"description":    pa.Description,
		"impact":         pa.Impact,
		"effort":         pa.Effort,
		"recommendation": pa.Recommendation,
		"mentions":       pa.Mentions,
		"sentiment":      pa.Sentiment,
		"trend":          pa.Trend,
		"icon":           pa.Icon,
		"status":         pa.Status,
		"created_at":     pa.CreatedAt.Format(time.RFC3339),
		"updated_at":     pa.UpdatedAt.Format(time.RFC3339),
	}
}
