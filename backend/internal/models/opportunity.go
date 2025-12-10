package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OpportunityPotential string

const (
	OpportunityPotentialHigh   OpportunityPotential = "high"
	OpportunityPotentialMedium OpportunityPotential = "medium"
	OpportunityPotentialLow    OpportunityPotential = "low"
)

type OpportunityTrend string

const (
	OpportunityTrendIncreasing OpportunityTrend = "increasing"
	OpportunityTrendStable     OpportunityTrend = "stable"
	OpportunityTrendDecreasing OpportunityTrend = "decreasing"
)

type OpportunityTimeframe string

const (
	OpportunityTimeframeShort  OpportunityTimeframe = "Short-term"
	OpportunityTimeframeMedium OpportunityTimeframe = "Medium-term"
	OpportunityTimeframeLong   OpportunityTimeframe = "Long-term"
)

type KeyMetric struct {
	Label string `json:"label" bson:"label"`
	Value string `json:"value" bson:"value"`
}

type Opportunity struct {
	ID                 primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Title              string               `json:"title" bson:"title" validate:"required,min=3,max=255"`
	Description        string               `json:"description" bson:"description" validate:"required,min=10"`
	Potential          OpportunityPotential `json:"potential" bson:"potential" validate:"required,oneof=high medium low"`
	ConfidenceScore    int                  `json:"confidence_score" bson:"confidence_score" validate:"required,min=0,max=100"`
	Timeframe          OpportunityTimeframe `json:"timeframe" bson:"timeframe" validate:"required,oneof=Short-term Medium-term Long-term"`
	Category           string               `json:"category" bson:"category" validate:"required"`
	Trend              OpportunityTrend     `json:"trend" bson:"trend" validate:"required,oneof=increasing stable decreasing"`
	KeyMetrics         []KeyMetric          `json:"key_metrics" bson:"key_metrics"`
	RecommendedActions []string             `json:"recommended_actions" bson:"recommended_actions"`
	IsActive           bool                 `json:"is_active" bson:"is_active"`
	Order              int                  `json:"order" bson:"order"`
	CreatedAt          time.Time            `json:"created_at" bson:"created_at"`
	UpdatedAt          time.Time            `json:"updated_at" bson:"updated_at"`
}

func (o *Opportunity) ToResponse() map[string]interface{} {
	return map[string]interface{}{
		"id":                  o.ID.Hex(),
		"title":               o.Title,
		"description":         o.Description,
		"potential":           o.Potential,
		"confidence_score":    o.ConfidenceScore,
		"timeframe":           o.Timeframe,
		"category":            o.Category,
		"trend":               o.Trend,
		"key_metrics":         o.KeyMetrics,
		"recommended_actions": o.RecommendedActions,
		"is_active":           o.IsActive,
		"order":               o.Order,
		"created_at":          o.CreatedAt.Format(time.RFC3339),
		"updated_at":          o.UpdatedAt.Format(time.RFC3339),
	}
}



