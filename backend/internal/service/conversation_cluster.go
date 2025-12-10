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

type ConversationClusterService struct {
	repo      *repository.ConversationClusterRepository
	validator *validator.Validate
}

func NewConversationClusterService(repo *repository.ConversationClusterRepository) *ConversationClusterService {
	return &ConversationClusterService{
		repo:      repo,
		validator: validator.New(),
	}
}

func (s *ConversationClusterService) Validate(cluster *models.ConversationCluster) error {
	return s.validator.Struct(cluster)
}

func (s *ConversationClusterService) Create(ctx context.Context, cluster *models.ConversationCluster) error {
	if err := s.Validate(cluster); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	return s.repo.Create(ctx, cluster)
}

func (s *ConversationClusterService) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.ConversationCluster, int64, error) {
	return s.repo.GetAll(ctx, filter, limit, offset)
}

func (s *ConversationClusterService) GetByID(ctx context.Context, id string) (*models.ConversationCluster, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *ConversationClusterService) Update(ctx context.Context, id string, cluster *models.ConversationCluster) error {
	if err := s.Validate(cluster); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("conversation cluster not found")
		}
		return err
	}

	return s.repo.Update(ctx, id, cluster)
}

func (s *ConversationClusterService) Delete(ctx context.Context, id string) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("conversation cluster not found")
		}
		return err
	}

	return s.repo.Delete(ctx, id)
}

