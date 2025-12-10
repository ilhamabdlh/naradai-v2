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

type SentimentTrendService struct {
	repo      *repository.SentimentTrendRepository
	validator *validator.Validate
}

func NewSentimentTrendService(repo *repository.SentimentTrendRepository) *SentimentTrendService {
	return &SentimentTrendService{
		repo:      repo,
		validator: validator.New(),
	}
}

func (s *SentimentTrendService) Validate(trend *models.SentimentTrend) error {
	return s.validator.Struct(trend)
}

func (s *SentimentTrendService) Create(ctx context.Context, trend *models.SentimentTrend) error {
	if err := s.Validate(trend); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	return s.repo.Create(ctx, trend)
}

func (s *SentimentTrendService) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.SentimentTrend, int64, error) {
	return s.repo.GetAll(ctx, filter, limit, offset)
}

func (s *SentimentTrendService) GetByID(ctx context.Context, id string) (*models.SentimentTrend, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *SentimentTrendService) Update(ctx context.Context, id string, trend *models.SentimentTrend) error {
	if err := s.Validate(trend); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("sentiment trend not found")
		}
		return err
	}

	return s.repo.Update(ctx, id, trend)
}

func (s *SentimentTrendService) Delete(ctx context.Context, id string) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("sentiment trend not found")
		}
		return err
	}

	return s.repo.Delete(ctx, id)
}
