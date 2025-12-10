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

type RiskRepository struct {
	collection *mongo.Collection
}

func NewRiskRepository(db *mongo.Database) *RiskRepository {
	return &RiskRepository{
		collection: db.Collection("risks"),
	}
}

func (r *RiskRepository) Create(ctx context.Context, risk *models.Risk) error {
	risk.ID = primitive.NewObjectID()
	risk.CreatedAt = time.Now()
	risk.UpdatedAt = time.Now()
	if !risk.IsActive {
		risk.IsActive = true
	}

	_, err := r.collection.InsertOne(ctx, risk)
	return err
}

func (r *RiskRepository) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.Risk, int64, error) {
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

	var risks []models.Risk
	if err = cursor.All(ctx, &risks); err != nil {
		return nil, 0, err
	}

	return risks, total, nil
}

func (r *RiskRepository) GetByID(ctx context.Context, id string) (*models.Risk, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var risk models.Risk
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&risk)
	if err != nil {
		return nil, err
	}

	return &risk, nil
}

func (r *RiskRepository) Update(ctx context.Context, id string, risk *models.Risk) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	risk.UpdatedAt = time.Now()
	update := bson.M{
		"$set": bson.M{
			"title":               risk.Title,
			"description":         risk.Description,
			"severity":            risk.Severity,
			"probability":         risk.Probability,
			"impact_assessment":   risk.ImpactAssessment,
			"trend":               risk.Trend,
			"indicators":          risk.Indicators,
			"mitigation_strategy": risk.MitigationStrategy,
			"is_active":           risk.IsActive,
			"order":               risk.Order,
			"updated_at":          risk.UpdatedAt,
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

func (r *RiskRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}



