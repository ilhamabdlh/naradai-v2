package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// DiscussionTopic represents a topic in the top discussion topics chart
type DiscussionTopic struct {
	ID             primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name           string             `json:"name" bson:"name" validate:"required,min=2,max=100"`
	Volume         int                `json:"volume" bson:"volume" validate:"required,min=0"`
	SentimentScore float64            `json:"sentiment_score" bson:"sentiment_score"` // e.g., -0.68, +0.71
	Color          string             `json:"color" bson:"color"`                     // Gradient color for the bar
	IsActive       bool               `json:"is_active" bson:"is_active"`
	Order          int                `json:"order" bson:"order"`
	CreatedAt      time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt      time.Time          `json:"updated_at" bson:"updated_at"`
}

func (d *DiscussionTopic) ToResponse() map[string]interface{} {
	return map[string]interface{}{
		"id":              d.ID.Hex(),
		"name":            d.Name,
		"volume":          d.Volume,
		"sentiment_score": d.SentimentScore,
		"color":           d.Color,
		"is_active":       d.IsActive,
		"order":           d.Order,
		"created_at":      d.CreatedAt.Format(time.RFC3339),
		"updated_at":      d.UpdatedAt.Format(time.RFC3339),
	}
}

