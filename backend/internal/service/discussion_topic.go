package service

import (
	"context"
	"fmt"

	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"naradai-backend/internal/models"
	"naradai-backend/internal/repository"
)

type DiscussionTopicService struct {
	repo      *repository.DiscussionTopicRepository
	validator *validator.Validate
}

func NewDiscussionTopicService(repo *repository.DiscussionTopicRepository) *DiscussionTopicService {
	return &DiscussionTopicService{
		repo:      repo,
		validator: validator.New(),
	}
}

func (s *DiscussionTopicService) Validate(topic *models.DiscussionTopic) error {
	return s.validator.Struct(topic)
}

func (s *DiscussionTopicService) Create(ctx context.Context, topic *models.DiscussionTopic) error {
	if err := s.Validate(topic); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	return s.repo.Create(ctx, topic)
}

func (s *DiscussionTopicService) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.DiscussionTopic, int64, error) {
	return s.repo.GetAll(ctx, filter, limit, offset)
}

func (s *DiscussionTopicService) GetByID(ctx context.Context, id string) (*models.DiscussionTopic, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *DiscussionTopicService) Update(ctx context.Context, id string, topic *models.DiscussionTopic) error {
	if err := s.Validate(topic); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("discussion topic not found")
		}
		return err
	}

	return s.repo.Update(ctx, id, topic)
}

func (s *DiscussionTopicService) Delete(ctx context.Context, id string) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("discussion topic not found")
		}
		return err
	}

	return s.repo.Delete(ctx, id)
}

