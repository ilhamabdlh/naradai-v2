package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"naradai-backend/internal/models"
	"naradai-backend/internal/service"
)

type SentimentTrendHandler struct {
	service *service.SentimentTrendService
}

func NewSentimentTrendHandler(svc *service.SentimentTrendService) *SentimentTrendHandler {
	return &SentimentTrendHandler{service: svc}
}

func (h *SentimentTrendHandler) GetAll(c *gin.Context) {
	isActive := c.Query("is_active")
	limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "100"), 10, 64)
	offset, _ := strconv.ParseInt(c.DefaultQuery("offset", "0"), 10, 64)

	filter := bson.M{}
	if isActive == "true" {
		filter["is_active"] = true
	} else if isActive == "false" {
		filter["is_active"] = false
	}

	trends, total, err := h.service.GetAll(c.Request.Context(), filter, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch sentiment trends",
		})
		return
	}

	data := make([]map[string]interface{}, len(trends))
	for i, trend := range trends {
		data[i] = trend.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"total":   total,
	})
}

func (h *SentimentTrendHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	trend, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Sentiment trend not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch sentiment trend",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    trend.ToResponse(),
	})
}

func (h *SentimentTrendHandler) Create(c *gin.Context) {
	var trend models.SentimentTrend
	if err := c.ShouldBindJSON(&trend); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Validate(&trend); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Create(c.Request.Context(), &trend); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create sentiment trend",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Sentiment trend created successfully",
		"data":    trend.ToResponse(),
	})
}

func (h *SentimentTrendHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var trend models.SentimentTrend
	if err := c.ShouldBindJSON(&trend); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Validate(&trend); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Update(c.Request.Context(), id, &trend); err != nil {
		if err.Error() == "sentiment trend not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Sentiment trend not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update sentiment trend",
		})
		return
	}

	updatedTrend, _ := h.service.GetByID(c.Request.Context(), id)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Sentiment trend updated successfully",
		"data":    updatedTrend.ToResponse(),
	})
}

func (h *SentimentTrendHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err.Error() == "sentiment trend not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Sentiment trend not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete sentiment trend",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Sentiment trend deleted successfully",
	})
}
