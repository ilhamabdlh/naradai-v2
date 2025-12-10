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

type CompetitiveAnalysisService struct {
	repo      *repository.CompetitiveAnalysisRepository
	validator *validator.Validate
}

func NewCompetitiveAnalysisService(repo *repository.CompetitiveAnalysisRepository) *CompetitiveAnalysisService {
	return &CompetitiveAnalysisService{
		repo:      repo,
		validator: validator.New(),
	}
}

func (s *CompetitiveAnalysisService) Validate(analysis *models.CompetitiveAnalysis) error {
	return s.validator.Struct(analysis)
}

func (s *CompetitiveAnalysisService) Create(ctx context.Context, analysis *models.CompetitiveAnalysis) error {
	if err := s.Validate(analysis); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	return s.repo.Create(ctx, analysis)
}

func (s *CompetitiveAnalysisService) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.CompetitiveAnalysis, int64, error) {
	return s.repo.GetAll(ctx, filter, limit, offset)
}

func (s *CompetitiveAnalysisService) GetByID(ctx context.Context, id string) (*models.CompetitiveAnalysis, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *CompetitiveAnalysisService) Update(ctx context.Context, id string, analysis *models.CompetitiveAnalysis) error {
	if err := s.Validate(analysis); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("competitive analysis not found")
		}
		return err
	}

	return s.repo.Update(ctx, id, analysis)
}

func (s *CompetitiveAnalysisService) Delete(ctx context.Context, id string) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("competitive analysis not found")
		}
		return err
	}

	return s.repo.Delete(ctx, id)
}

