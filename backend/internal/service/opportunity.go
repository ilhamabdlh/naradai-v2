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

type OpportunityService struct {
	repo      *repository.OpportunityRepository
	validator *validator.Validate
}

func NewOpportunityService(repo *repository.OpportunityRepository) *OpportunityService {
	return &OpportunityService{
		repo:      repo,
		validator: validator.New(),
	}
}

func (s *OpportunityService) Validate(opp *models.Opportunity) error {
	return s.validator.Struct(opp)
}

func (s *OpportunityService) Create(ctx context.Context, opp *models.Opportunity) error {
	if err := s.Validate(opp); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	return s.repo.Create(ctx, opp)
}

func (s *OpportunityService) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.Opportunity, int64, error) {
	return s.repo.GetAll(ctx, filter, limit, offset)
}

func (s *OpportunityService) GetByID(ctx context.Context, id string) (*models.Opportunity, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *OpportunityService) Update(ctx context.Context, id string, opp *models.Opportunity) error {
	if err := s.Validate(opp); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("opportunity not found")
		}
		return err
	}

	return s.repo.Update(ctx, id, opp)
}

func (s *OpportunityService) Delete(ctx context.Context, id string) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("opportunity not found")
		}
		return err
	}

	return s.repo.Delete(ctx, id)
}



