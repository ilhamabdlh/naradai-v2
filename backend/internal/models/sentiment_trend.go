package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// SentimentDataPoint represents a single data point in the trend chart
type SentimentDataPoint struct {
	Date     string  `json:"date" bson:"date"`
	Positive float64 `json:"positive" bson:"positive"`
	Negative float64 `json:"negative" bson:"negative"`
}

// SentimentTrend represents sentiment analysis data for the dashboard
type SentimentTrend struct {
	ID                primitive.ObjectID   `json:"id" bson:"_id,omitempty"`
	Title             string               `json:"title" bson:"title" validate:"required"`
	Period            string               `json:"period" bson:"period" validate:"required"` // e.g., "Last 30 days"
	PositivePercent   float64              `json:"positive_percent" bson:"positive_percent" validate:"required,min=0,max=100"`
	NegativePercent   float64              `json:"negative_percent" bson:"negative_percent" validate:"required,min=0,max=100"`
	NeutralPercent    float64              `json:"neutral_percent" bson:"neutral_percent" validate:"required,min=0,max=100"`
	TrendData         []SentimentDataPoint `json:"trend_data" bson:"trend_data"`
	IsActive          bool                 `json:"is_active" bson:"is_active"`
	Order             int                  `json:"order" bson:"order"`
	CreatedAt         time.Time            `json:"created_at" bson:"created_at"`
	UpdatedAt         time.Time            `json:"updated_at" bson:"updated_at"`
}

func (s *SentimentTrend) ToResponse() map[string]interface{} {
	return map[string]interface{}{
		"id":               s.ID.Hex(),
		"title":            s.Title,
		"period":           s.Period,
		"positive_percent": s.PositivePercent,
		"negative_percent": s.NegativePercent,
		"neutral_percent":  s.NeutralPercent,
		"trend_data":       s.TrendData,
		"is_active":        s.IsActive,
		"order":            s.Order,
		"created_at":       s.CreatedAt.Format(time.RFC3339),
		"updated_at":       s.UpdatedAt.Format(time.RFC3339),
	}
}

