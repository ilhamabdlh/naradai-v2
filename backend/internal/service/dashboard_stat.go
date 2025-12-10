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

type DashboardStatService struct {
	repo      *repository.DashboardStatRepository
	validator *validator.Validate
}

func NewDashboardStatService(repo *repository.DashboardStatRepository) *DashboardStatService {
	return &DashboardStatService{
		repo:      repo,
		validator: validator.New(),
	}
}

func (s *DashboardStatService) Validate(stat *models.DashboardStat) error {
	return s.validator.Struct(stat)
}

func (s *DashboardStatService) Create(ctx context.Context, stat *models.DashboardStat) error {
	if err := s.Validate(stat); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}
	return s.repo.Create(ctx, stat)
}

func (s *DashboardStatService) GetAll(ctx context.Context, filter bson.M, limit, offset int64) ([]models.DashboardStat, int64, error) {
	return s.repo.GetAll(ctx, filter, limit, offset)
}

func (s *DashboardStatService) GetByID(ctx context.Context, id string) (*models.DashboardStat, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *DashboardStatService) Update(ctx context.Context, id string, stat *models.DashboardStat) error {
	if err := s.Validate(stat); err != nil {
		return fmt.Errorf("validation failed: %w", err)
	}

	// Check if exists
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("dashboard stat not found")
		}
		return err
	}

	return s.repo.Update(ctx, id, stat)
}

func (s *DashboardStatService) Delete(ctx context.Context, id string) error {
	// Check if exists
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("dashboard stat not found")
		}
		return err
	}

	return s.repo.Delete(ctx, id)
}



