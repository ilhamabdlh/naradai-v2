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

type SentimentTrendRepository struct {
	collection *mongo.Collection
}

func NewSentimentTrendRepository(db *mongo.Database) *SentimentTrendRepository {
	return &SentimentTrendRepository{
		collection: db.Collection("sentiment_trends"),
	}
}

func (r *SentimentTrendRepository) Create(ctx context.Context, trend *models.SentimentTrend) error {
	trend.ID = primitive.NewObjectID()
	trend.CreatedAt = time.Now()
	trend.UpdatedAt = time.Now()
	if !trend.IsActive {
		trend.IsActive = true
	}

	_, err := r.collection.InsertOne(ctx, trend)
	return err
}

func (r *SentimentTrendRepository) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.SentimentTrend, int64, error) {
	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	opts := options.Find().
		SetLimit(limit).
		SetSkip(offset).
		SetSort(bson.D{{Key: "order", Value: 1}, {Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var trends []models.SentimentTrend
	if err = cursor.All(ctx, &trends); err != nil {
		return nil, 0, err
	}

	return trends, total, nil
}

func (r *SentimentTrendRepository) GetByID(ctx context.Context, id string) (*models.SentimentTrend, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var trend models.SentimentTrend
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&trend)
	if err != nil {
		return nil, err
	}

	return &trend, nil
}

func (r *SentimentTrendRepository) Update(ctx context.Context, id string, trend *models.SentimentTrend) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	trend.UpdatedAt = time.Now()
	update := bson.M{
		"$set": bson.M{
			"title":             trend.Title,
			"period":            trend.Period,
			"positive_percent":  trend.PositivePercent,
			"negative_percent":  trend.NegativePercent,
			"neutral_percent":   trend.NeutralPercent,
			"trend_data":        trend.TrendData,
			"is_active":         trend.IsActive,
			"order":             trend.Order,
			"updated_at":        trend.UpdatedAt,
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

func (r *SentimentTrendRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}
