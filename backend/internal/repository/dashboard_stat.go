package repository

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"naradai-backend/internal/models"
)

type DashboardStatRepository struct {
	collection *mongo.Collection
}

func NewDashboardStatRepository(db *mongo.Database) *DashboardStatRepository {
	return &DashboardStatRepository{
		collection: db.Collection("dashboard_stats"),
	}
}

func (r *DashboardStatRepository) Create(ctx context.Context, stat *models.DashboardStat) error {
	stat.ID = primitive.NewObjectID()
	stat.CreatedAt = time.Now()
	stat.UpdatedAt = time.Now()
	if !stat.IsActive {
		stat.IsActive = true
	}

	_, err := r.collection.InsertOne(ctx, stat)
	return err
}

func (r *DashboardStatRepository) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.DashboardStat, int64, error) {
	// Get total count
	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	// Get documents with pagination, sorted by order
	opts := options.Find().
		SetLimit(limit).
		SetSkip(offset).
		SetSort(bson.D{{Key: "order", Value: 1}, {Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var stats []models.DashboardStat
	if err = cursor.All(ctx, &stats); err != nil {
		return nil, 0, err
	}

	return stats, total, nil
}

func (r *DashboardStatRepository) GetByID(ctx context.Context, id string) (*models.DashboardStat, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var stat models.DashboardStat
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&stat)
	if err != nil {
		return nil, err
	}

	return &stat, nil
}

func (r *DashboardStatRepository) Update(ctx context.Context, id string, stat *models.DashboardStat) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	stat.UpdatedAt = time.Now()
	update := bson.M{
		"$set": bson.M{
			"label":      stat.Label,
			"value":      stat.Value,
			"change":     stat.Change,
			"trend":      stat.Trend,
			"icon":       stat.Icon,
			"order":      stat.Order,
			"is_active":  stat.IsActive,
			"updated_at": stat.UpdatedAt,
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

func (r *DashboardStatRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}



