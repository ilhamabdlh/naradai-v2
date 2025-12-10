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

type CompetitiveAnalysisRepository struct {
	collection *mongo.Collection
}

func NewCompetitiveAnalysisRepository(db *mongo.Database) *CompetitiveAnalysisRepository {
	return &CompetitiveAnalysisRepository{
		collection: db.Collection("competitive_analyses"),
	}
}

func (r *CompetitiveAnalysisRepository) Create(ctx context.Context, analysis *models.CompetitiveAnalysis) error {
	analysis.ID = primitive.NewObjectID()
	analysis.CreatedAt = time.Now()
	analysis.UpdatedAt = time.Now()
	if !analysis.IsActive {
		analysis.IsActive = true
	}

	_, err := r.collection.InsertOne(ctx, analysis)
	return err
}

func (r *CompetitiveAnalysisRepository) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.CompetitiveAnalysis, int64, error) {
	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	opts := options.Find().
		SetLimit(limit).
		SetSkip(offset).
		SetSort(bson.D{{Key: "order", Value: 1}, {Key: "share_of_voice", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var analyses []models.CompetitiveAnalysis
	if err = cursor.All(ctx, &analyses); err != nil {
		return nil, 0, err
	}

	return analyses, total, nil
}

func (r *CompetitiveAnalysisRepository) GetByID(ctx context.Context, id string) (*models.CompetitiveAnalysis, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var analysis models.CompetitiveAnalysis
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&analysis)
	if err != nil {
		return nil, err
	}

	return &analysis, nil
}

func (r *CompetitiveAnalysisRepository) Update(ctx context.Context, id string, analysis *models.CompetitiveAnalysis) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	analysis.UpdatedAt = time.Now()
	update := bson.M{
		"$set": bson.M{
			"name":            analysis.Name,
			"share_of_voice":  analysis.ShareOfVoice,
			"sentiment":       analysis.Sentiment,
			"engagement":      analysis.Engagement,
			"position":        analysis.Position,
			"gap_to_leader":   analysis.GapToLeader,
			"is_active":       analysis.IsActive,
			"order":           analysis.Order,
			"updated_at":      analysis.UpdatedAt,
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

func (r *CompetitiveAnalysisRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}

