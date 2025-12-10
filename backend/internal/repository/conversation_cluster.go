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

type ConversationClusterRepository struct {
	collection *mongo.Collection
}

func NewConversationClusterRepository(db *mongo.Database) *ConversationClusterRepository {
	return &ConversationClusterRepository{
		collection: db.Collection("conversation_clusters"),
	}
}

func (r *ConversationClusterRepository) Create(ctx context.Context, cluster *models.ConversationCluster) error {
	cluster.ID = primitive.NewObjectID()
	cluster.CreatedAt = time.Now()
	cluster.UpdatedAt = time.Now()
	if !cluster.IsActive {
		cluster.IsActive = true
	}
	if cluster.Trend == "" {
		cluster.Trend = "stable"
	}

	_, err := r.collection.InsertOne(ctx, cluster)
	return err
}

func (r *ConversationClusterRepository) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.ConversationCluster, int64, error) {
	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	opts := options.Find().
		SetLimit(limit).
		SetSkip(offset).
		SetSort(bson.D{{Key: "order", Value: 1}, {Key: "size", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var clusters []models.ConversationCluster
	if err = cursor.All(ctx, &clusters); err != nil {
		return nil, 0, err
	}

	return clusters, total, nil
}

func (r *ConversationClusterRepository) GetByID(ctx context.Context, id string) (*models.ConversationCluster, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var cluster models.ConversationCluster
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&cluster)
	if err != nil {
		return nil, err
	}

	return &cluster, nil
}

func (r *ConversationClusterRepository) Update(ctx context.Context, id string, cluster *models.ConversationCluster) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	cluster.UpdatedAt = time.Now()
	if cluster.Trend == "" {
		cluster.Trend = "stable"
	}

	update := bson.M{
		"$set": bson.M{
			"theme":     cluster.Theme,
			"size":      cluster.Size,
			"sentiment": cluster.Sentiment,
			"trend":     cluster.Trend,
			"keywords":  cluster.Keywords,
			"is_active": cluster.IsActive,
			"order":     cluster.Order,
			"updated_at": cluster.UpdatedAt,
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

func (r *ConversationClusterRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}

