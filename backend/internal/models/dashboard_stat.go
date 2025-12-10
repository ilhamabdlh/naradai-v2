package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type StatTrend string

const (
	StatTrendUp   StatTrend = "up"
	StatTrendDown StatTrend = "down"
)

type DashboardStat struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Label     string             `json:"label" bson:"label" validate:"required,min=3,max=100"`
	Value     string             `json:"value" bson:"value" validate:"required,min=1,max=50"`
	Change    string             `json:"change" bson:"change" validate:"required,min=1,max=20"`
	Trend     StatTrend          `json:"trend" bson:"trend" validate:"required,oneof=up down"`
	Icon      string             `json:"icon" bson:"icon" validate:"required"`
	Order     int                `json:"order" bson:"order" validate:"min=0"`
	IsActive  bool               `json:"is_active" bson:"is_active"`
	CreatedAt time.Time          `json:"created_at" bson:"created_at"`
	UpdatedAt time.Time          `json:"updated_at" bson:"updated_at"`
}

// ToResponse converts ObjectID to string for JSON response
func (ds *DashboardStat) ToResponse() map[string]interface{} {
	return map[string]interface{}{
		"id":         ds.ID.Hex(),
		"label":      ds.Label,
		"value":      ds.Value,
		"change":     ds.Change,
		"trend":      ds.Trend,
		"icon":       ds.Icon,
		"order":      ds.Order,
		"is_active":  ds.IsActive,
		"created_at": ds.CreatedAt.Format(time.RFC3339),
		"updated_at": ds.UpdatedAt.Format(time.RFC3339),
	}
}



