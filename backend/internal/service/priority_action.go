package service

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"github.com/go-playground/validator/v10"
	"naradai-backend/internal/models"
	"naradai-backend/internal/repository"
)

type PriorityActionService struct {
	repo      *repository.PriorityActionRepository
	validator *validator.Validate
}

func NewPriorityActionService(repo *repository.PriorityActionRepository) *PriorityActionService {
	return &PriorityActionService{
		repo:      repo,
		validator: validator.New(),
	}
}

func (s *PriorityActionService) Validate(action *models.PriorityAction) error {
	return s.validator.Struct(action)
}

func (s *PriorityActionService) Create(ctx context.Context, action *models.PriorityAction) error {
	if err := s.Validate(action); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	return s.repo.Create(ctx, action)
}

func (s *PriorityActionService) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.PriorityAction, int64, error) {
	return s.repo.GetAll(ctx, filter, limit, offset)
}

func (s *PriorityActionService) GetByID(ctx context.Context, id string) (*models.PriorityAction, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PriorityActionService) Update(ctx context.Context, id string, action *models.PriorityAction) error {
	if err := s.Validate(action); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	// Check if exists
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("priority action not found")
		}
		return err
	}

	return s.repo.Update(ctx, id, action)
}

func (s *PriorityActionService) Delete(ctx context.Context, id string) error {
	// Check if exists
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("priority action not found")
		}
		return err
	}

	return s.repo.Delete(ctx, id)
}

