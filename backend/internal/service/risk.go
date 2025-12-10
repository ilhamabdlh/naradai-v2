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

type RiskService struct {
	repo      *repository.RiskRepository
	validator *validator.Validate
}

func NewRiskService(repo *repository.RiskRepository) *RiskService {
	return &RiskService{
		repo:      repo,
		validator: validator.New(),
	}
}

func (s *RiskService) Validate(risk *models.Risk) error {
	return s.validator.Struct(risk)
}

func (s *RiskService) Create(ctx context.Context, risk *models.Risk) error {
	if err := s.Validate(risk); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	return s.repo.Create(ctx, risk)
}

func (s *RiskService) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.Risk, int64, error) {
	return s.repo.GetAll(ctx, filter, limit, offset)
}

func (s *RiskService) GetByID(ctx context.Context, id string) (*models.Risk, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *RiskService) Update(ctx context.Context, id string, risk *models.Risk) error {
	if err := s.Validate(risk); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("risk not found")
		}
		return err
	}

	return s.repo.Update(ctx, id, risk)
}

func (s *RiskService) Delete(ctx context.Context, id string) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("risk not found")
		}
		return err
	}

	return s.repo.Delete(ctx, id)
}



