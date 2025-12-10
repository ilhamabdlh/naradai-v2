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

type RiskHandler struct {
	service *service.RiskService
}

func NewRiskHandler(svc *service.RiskService) *RiskHandler {
	return &RiskHandler{service: svc}
}

func (h *RiskHandler) GetAll(c *gin.Context) {
	isActive := c.Query("is_active")
	severity := c.Query("severity")
	limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "100"), 10, 64)
	offset, _ := strconv.ParseInt(c.DefaultQuery("offset", "0"), 10, 64)

	filter := bson.M{}
	if isActive == "true" {
		filter["is_active"] = true
	} else if isActive == "false" {
		filter["is_active"] = false
	}
	if severity != "" {
		filter["severity"] = severity
	}

	risks, total, err := h.service.GetAll(c.Request.Context(), filter, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch risks",
		})
		return
	}

	data := make([]map[string]interface{}, len(risks))
	for i, risk := range risks {
		data[i] = risk.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"total":   total,
	})
}

func (h *RiskHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	risk, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Risk not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch risk",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    risk.ToResponse(),
	})
}

func (h *RiskHandler) Create(c *gin.Context) {
	var risk models.Risk
	if err := c.ShouldBindJSON(&risk); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Validate(&risk); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Create(c.Request.Context(), &risk); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create risk",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Risk created successfully",
		"data":    risk.ToResponse(),
	})
}

func (h *RiskHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var risk models.Risk
	if err := c.ShouldBindJSON(&risk); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Validate(&risk); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Update(c.Request.Context(), id, &risk); err != nil {
		if err.Error() == "risk not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Risk not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update risk",
		})
		return
	}

	updatedRisk, _ := h.service.GetByID(c.Request.Context(), id)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Risk updated successfully",
		"data":    updatedRisk.ToResponse(),
	})
}

func (h *RiskHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err.Error() == "risk not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Risk not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete risk",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Risk deleted successfully",
	})
}



