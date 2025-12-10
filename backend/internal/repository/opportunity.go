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

type OpportunityRepository struct {
	collection *mongo.Collection
}

func NewOpportunityRepository(db *mongo.Database) *OpportunityRepository {
	return &OpportunityRepository{
		collection: db.Collection("opportunities"),
	}
}

func (r *OpportunityRepository) Create(ctx context.Context, opp *models.Opportunity) error {
	opp.ID = primitive.NewObjectID()
	opp.CreatedAt = time.Now()
	opp.UpdatedAt = time.Now()
	if !opp.IsActive {
		opp.IsActive = true
	}

	_, err := r.collection.InsertOne(ctx, opp)
	return err
}

func (r *OpportunityRepository) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.Opportunity, int64, error) {
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

	var opportunities []models.Opportunity
	if err = cursor.All(ctx, &opportunities); err != nil {
		return nil, 0, err
	}

	return opportunities, total, nil
}

func (r *OpportunityRepository) GetByID(ctx context.Context, id string) (*models.Opportunity, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var opp models.Opportunity
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&opp)
	if err != nil {
		return nil, err
	}

	return &opp, nil
}

func (r *OpportunityRepository) Update(ctx context.Context, id string, opp *models.Opportunity) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	opp.UpdatedAt = time.Now()
	update := bson.M{
		"$set": bson.M{
			"title":               opp.Title,
			"description":         opp.Description,
			"potential":           opp.Potential,
			"confidence_score":    opp.ConfidenceScore,
			"timeframe":           opp.Timeframe,
			"category":            opp.Category,
			"trend":               opp.Trend,
			"key_metrics":         opp.KeyMetrics,
			"recommended_actions": opp.RecommendedActions,
			"is_active":           opp.IsActive,
			"order":               opp.Order,
			"updated_at":          opp.UpdatedAt,
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

func (r *OpportunityRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}



