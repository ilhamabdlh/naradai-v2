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

type PriorityActionHandler struct {
	service *service.PriorityActionService
}

func NewPriorityActionHandler(svc *service.PriorityActionService) *PriorityActionHandler {
	return &PriorityActionHandler{service: svc}
}

// GetAll handles GET /api/v1/priority-actions
func (h *PriorityActionHandler) GetAll(c *gin.Context) {
	// Parse query parameters
	priority := c.Query("priority")
	status := c.Query("status")
	limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "100"), 10, 64)
	offset, _ := strconv.ParseInt(c.DefaultQuery("offset", "0"), 10, 64)

	// Build filter
	filter := bson.M{}
	if priority != "" {
		filter["priority"] = priority
	}
	if status != "" {
		filter["status"] = status
	}

	actions, total, err := h.service.GetAll(c.Request.Context(), filter, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch priority actions",
		})
		return
	}

	// Convert to response format
	data := make([]map[string]interface{}, len(actions))
	for i, action := range actions {
		data[i] = action.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"total":   total,
	})
}

// GetByID handles GET /api/v1/priority-actions/:id
func (h *PriorityActionHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	action, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Priority action not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch priority action",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    action.ToResponse(),
	})
}

// Create handles POST /api/v1/priority-actions
func (h *PriorityActionHandler) Create(c *gin.Context) {
	var action models.PriorityAction
	if err := c.ShouldBindJSON(&action); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	// Validate
	if err := h.service.Validate(&action); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Create(c.Request.Context(), &action); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create priority action",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Priority action created successfully",
		"data":    action.ToResponse(),
	})
}

// Update handles PUT /api/v1/priority-actions/:id
func (h *PriorityActionHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var action models.PriorityAction
	if err := c.ShouldBindJSON(&action); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	// Validate
	if err := h.service.Validate(&action); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Update(c.Request.Context(), id, &action); err != nil {
		if err.Error() == "priority action not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Priority action not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update priority action",
		})
		return
	}

	// Fetch updated action
	updatedAction, _ := h.service.GetByID(c.Request.Context(), id)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Priority action updated successfully",
		"data":    updatedAction.ToResponse(),
	})
}

// Delete handles DELETE /api/v1/priority-actions/:id
func (h *PriorityActionHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err.Error() == "priority action not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Priority action not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete priority action",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Priority action deleted successfully",
	})
}

// UpdateStatus handles PUT /api/v1/priority-actions/:id/status
func (h *PriorityActionHandler) UpdateStatus(c *gin.Context) {
	id := c.Param("id")

	var req struct {
		Status string `json:"status" binding:"required,oneof=not-started in-progress completed"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	// Get existing action
	existingAction, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err.Error() == "priority action not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Priority action not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch priority action",
		})
		return
	}

	// Update only status
	existingAction.Status = models.Status(req.Status)
	if err := h.service.Update(c.Request.Context(), id, existingAction); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update status",
		})
		return
	}

	// Fetch updated action
	updatedAction, _ := h.service.GetByID(c.Request.Context(), id)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Status updated successfully",
		"data":    updatedAction.ToResponse(),
	})
}

