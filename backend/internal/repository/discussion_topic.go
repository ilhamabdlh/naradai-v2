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

type DiscussionTopicRepository struct {
	collection *mongo.Collection
}

func NewDiscussionTopicRepository(db *mongo.Database) *DiscussionTopicRepository {
	return &DiscussionTopicRepository{
		collection: db.Collection("discussion_topics"),
	}
}

func (r *DiscussionTopicRepository) Create(ctx context.Context, topic *models.DiscussionTopic) error {
	topic.ID = primitive.NewObjectID()
	topic.CreatedAt = time.Now()
	topic.UpdatedAt = time.Now()
	if !topic.IsActive {
		topic.IsActive = true
	}

	_, err := r.collection.InsertOne(ctx, topic)
	return err
}

func (r *DiscussionTopicRepository) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.DiscussionTopic, int64, error) {
	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	opts := options.Find().
		SetLimit(limit).
		SetSkip(offset).
		SetSort(bson.D{{Key: "order", Value: 1}, {Key: "volume", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var topics []models.DiscussionTopic
	if err = cursor.All(ctx, &topics); err != nil {
		return nil, 0, err
	}

	return topics, total, nil
}

func (r *DiscussionTopicRepository) GetByID(ctx context.Context, id string) (*models.DiscussionTopic, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}

	var topic models.DiscussionTopic
	err = r.collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&topic)
	if err != nil {
		return nil, err
	}

	return &topic, nil
}

func (r *DiscussionTopicRepository) Update(ctx context.Context, id string, topic *models.DiscussionTopic) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	topic.UpdatedAt = time.Now()
	update := bson.M{
		"$set": bson.M{
			"name":            topic.Name,
			"volume":          topic.Volume,
			"sentiment_score": topic.SentimentScore,
			"color":           topic.Color,
			"is_active":       topic.IsActive,
			"order":           topic.Order,
			"updated_at":      topic.UpdatedAt,
		},
	}

	_, err = r.collection.UpdateOne(ctx, bson.M{"_id": objectID}, update)
	return err
}

func (r *DiscussionTopicRepository) Delete(ctx context.Context, id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return err
	}

	_, err = r.collection.DeleteOne(ctx, bson.M{"_id": objectID})
	return err
}

