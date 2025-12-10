package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// ConversationCluster represents a conversation cluster/theme
type ConversationCluster struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Theme     string             `json:"theme" bson:"theme" validate:"required,min=2,max=200"`
	Size      int                `json:"size" bson:"size" validate:"required,min=0"` // mentions count
	Sentiment float64            `json:"sentiment" bson:"sentiment"`                  // e.g., -0.68, +0.71
	Trend     string             `json:"trend" bson:"trend" validate:"oneof=up down stable"` // "up", "down", or "stable"
	Keywords  []string           `json:"keywords" bson:"keywords"`                  // array of keywords/tags
	IsActive  bool               `json:"is_active" bson:"is_active"`
	Order     int                `json:"order" bson:"order"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at"`
}

func (c *ConversationCluster) ToResponse() map[string]interface{} {
	return map[string]interface{}{
		"id":        c.ID.Hex(),
		"theme":     c.Theme,
		"size":      c.Size,
		"sentiment": c.Sentiment,
		"trend":     c.Trend,
		"keywords":  c.Keywords,
		"is_active": c.IsActive,
		"order":     c.Order,
		"created_at": c.CreatedAt.Format(time.RFC3339),
		"updated_at": c.UpdatedAt.Format(time.RFC3339),
	}
}

