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

type PriorityActionRepository struct {
	collection *mongo.Collection
}

func NewPriorityActionRepository(db *mongo.Database) *PriorityActionRepository {
	return &PriorityActionRepository{
		collection: db.Collection("priority_actions"),
	}
}

func (r *PriorityActionRepository) Create(ctx context.Context, action *models.PriorityAction) error {
	action.ID = primitive.NewObjectID()
	action.CreatedAt = time.Now()
	action.UpdatedAt = time.Now()
	if action.Status == "" {
		action.Status = models.StatusNotStarted
	}

	_, err := r.collection.InsertOne(ctx, action)
	return err
}

func (r *PriorityActionRepository) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.PriorityAction, int64, error) {
	// Get total count
	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	// Get documents with pagination
	opts := options.Find().
		SetLimit(limit).
		SetSkip(offset).
		SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var actions []models.PriorityAction
	if err = cursor.All(ctx, &actions); err != nil {
		return nil, 0, err
	}

	return actions, total, nil
}

func (r *PriorityActionRepository) GetByID(ctx context.Context, id string) (*models.PriorityAction, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var action models.PriorityAction
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&action)
	if err != nil {
		return nil, err
	}

	return &action, nil
}

func (r *PriorityActionRepository) Update(ctx context.Context, id string, action *models.PriorityAction) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	action.UpdatedAt = time.Now()
	update := bson.M{
		"$set": bson.M{
			"priority":      action.Priority,
			"title":         action.Title,
			"description":   action.Description,
			"impact":        action.Impact,
			"effort":        action.Effort,
			"recommendation": action.Recommendation,
			"mentions":      action.Mentions,
			"sentiment":     action.Sentiment,
			"trend":         action.Trend,
			"icon":          action.Icon,
			"status":        action.Status,
			"updated_at":    action.UpdatedAt,
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

func (r *PriorityActionRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}

