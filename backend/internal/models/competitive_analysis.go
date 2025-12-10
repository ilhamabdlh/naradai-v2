package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CompetitiveAnalysis represents a competitor in the competitive analysis chart
type CompetitiveAnalysis struct {
	ID            primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name          string             `json:"name" bson:"name" validate:"required,min=2,max=100"`
	ShareOfVoice  float64            `json:"share_of_voice" bson:"share_of_voice" validate:"required,min=0,max=100"`
	Sentiment     float64            `json:"sentiment" bson:"sentiment" validate:"required,min=0,max=100"`
	Engagement    float64            `json:"engagement" bson:"engagement" validate:"min=0"`
	Position      string             `json:"position" bson:"position"`       // e.g., "#1 in Share of Voice"
	GapToLeader   string             `json:"gap_to_leader" bson:"gap_to_leader"` // e.g., "Leading by 4%"
	IsActive      bool               `json:"is_active" bson:"is_active"`
	Order         int                `json:"order" bson:"order"`
	CreatedAt     time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt     time.Time          `json:"updated_at" bson:"updated_at"`
}

func (c *CompetitiveAnalysis) ToResponse() map[string]interface{} {
	return map[string]interface{}{
		"id":             c.ID.Hex(),
		"name":           c.Name,
		"share_of_voice": c.ShareOfVoice,
		"sentiment":      c.Sentiment,
		"engagement":     c.Engagement,
		"position":       c.Position,
		"gap_to_leader":  c.GapToLeader,
		"is_active":      c.IsActive,
		"order":          c.Order,
		"created_at":     c.CreatedAt.Format(time.RFC3339),
		"updated_at":     c.UpdatedAt.Format(time.RFC3339),
	}
}

