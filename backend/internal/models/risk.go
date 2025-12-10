package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RiskSeverity string

const (
	RiskSeverityCritical RiskSeverity = "critical"
	RiskSeverityHigh     RiskSeverity = "high"
	RiskSeverityMedium   RiskSeverity = "medium"
	RiskSeverityLow      RiskSeverity = "low"
)

type RiskTrend string

const (
	RiskTrendIncreasing RiskTrend = "increasing"
	RiskTrendStable     RiskTrend = "stable"
	RiskTrendDecreasing RiskTrend = "decreasing"
)

type RiskIndicator struct {
	Label  string  `json:"label" bson:"label"`
	Value  float64 `json:"value" bson:"value"`
	Change float64 `json:"change" bson:"change"`
}

type Risk struct {
	ID                 primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Title              string             `json:"title" bson:"title" validate:"required,min=3,max=255"`
	Description        string             `json:"description" bson:"description" validate:"required,min=10"`
	Severity           RiskSeverity       `json:"severity" bson:"severity" validate:"required,oneof=critical high medium low"`
	Probability        int                `json:"probability" bson:"probability" validate:"required,min=0,max=100"`
	ImpactAssessment   string             `json:"impact_assessment" bson:"impact_assessment" validate:"required"`
	Trend              RiskTrend          `json:"trend" bson:"trend" validate:"required,oneof=increasing stable decreasing"`
	Indicators         []RiskIndicator    `json:"indicators" bson:"indicators"`
	MitigationStrategy []string           `json:"mitigation_strategy" bson:"mitigation_strategy"`
	IsActive           bool               `json:"is_active" bson:"is_active"`
	Order              int                `json:"order" bson:"order"`
	CreatedAt          time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt          time.Time          `json:"updated_at" bson:"updated_at"`
}

func (r *Risk) ToResponse() map[string]interface{} {
	return map[string]interface{}{
		"id":                  r.ID.Hex(),
		"title":               r.Title,
		"description":         r.Description,
		"severity":            r.Severity,
		"probability":         r.Probability,
		"impact_assessment":   r.ImpactAssessment,
		"trend":               r.Trend,
		"indicators":          r.Indicators,
		"mitigation_strategy": r.MitigationStrategy,
		"is_active":           r.IsActive,
		"order":               r.Order,
		"created_at":          r.CreatedAt.Format(time.RFC3339),
		"updated_at":          r.UpdatedAt.Format(time.RFC3339),
	}
}



