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

type DashboardStatHandler struct {
	service *service.DashboardStatService
}

func NewDashboardStatHandler(svc *service.DashboardStatService) *DashboardStatHandler {
	return &DashboardStatHandler{service: svc}
}

// GetAll handles GET /api/v1/dashboard-stats
func (h *DashboardStatHandler) GetAll(c *gin.Context) {
	// Parse query parameters
	isActive := c.Query("is_active")
	limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "100"), 10, 64)
	offset, _ := strconv.ParseInt(c.DefaultQuery("offset", "0"), 10, 64)

	// Build filter
	filter := bson.M{}
	if isActive == "true" {
		filter["is_active"] = true
	} else if isActive == "false" {
		filter["is_active"] = false
	}

	stats, total, err := h.service.GetAll(c.Request.Context(), filter, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch dashboard stats",
		})
		return
	}

	// Convert to response format
	data := make([]map[string]interface{}, len(stats))
	for i, stat := range stats {
		data[i] = stat.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"total":   total,
	})
}

// GetByID handles GET /api/v1/dashboard-stats/:id
func (h *DashboardStatHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	stat, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Dashboard stat not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch dashboard stat",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stat.ToResponse(),
	})
}

// Create handles POST /api/v1/dashboard-stats
func (h *DashboardStatHandler) Create(c *gin.Context) {
	var stat models.DashboardStat
	if err := c.ShouldBindJSON(&stat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	// Validate
	if err := h.service.Validate(&stat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Create(c.Request.Context(), &stat); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create dashboard stat",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Dashboard stat created successfully",
		"data":    stat.ToResponse(),
	})
}

// Update handles PUT /api/v1/dashboard-stats/:id
func (h *DashboardStatHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var stat models.DashboardStat
	if err := c.ShouldBindJSON(&stat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	// Validate
	if err := h.service.Validate(&stat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Update(c.Request.Context(), id, &stat); err != nil {
		if err.Error() == "dashboard stat not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Dashboard stat not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update dashboard stat",
		})
		return
	}

	// Fetch updated stat
	updatedStat, _ := h.service.GetByID(c.Request.Context(), id)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Dashboard stat updated successfully",
		"data":    updatedStat.ToResponse(),
	})
}

// Delete handles DELETE /api/v1/dashboard-stats/:id
func (h *DashboardStatHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err.Error() == "dashboard stat not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Dashboard stat not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete dashboard stat",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Dashboard stat deleted successfully",
	})
}



