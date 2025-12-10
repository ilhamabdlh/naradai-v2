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

type OpportunityHandler struct {
	service *service.OpportunityService
}

func NewOpportunityHandler(svc *service.OpportunityService) *OpportunityHandler {
	return &OpportunityHandler{service: svc}
}

func (h *OpportunityHandler) GetAll(c *gin.Context) {
	isActive := c.Query("is_active")
	potential := c.Query("potential")
	limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "100"), 10, 64)
	offset, _ := strconv.ParseInt(c.DefaultQuery("offset", "0"), 10, 64)

	filter := bson.M{}
	if isActive == "true" {
		filter["is_active"] = true
	} else if isActive == "false" {
		filter["is_active"] = false
	}
	if potential != "" {
		filter["potential"] = potential
	}

	opportunities, total, err := h.service.GetAll(c.Request.Context(), filter, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch opportunities",
		})
		return
	}

	data := make([]map[string]interface{}, len(opportunities))
	for i, opp := range opportunities {
		data[i] = opp.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"total":   total,
	})
}

func (h *OpportunityHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	opp, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Opportunity not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch opportunity",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    opp.ToResponse(),
	})
}

func (h *OpportunityHandler) Create(c *gin.Context) {
	var opp models.Opportunity
	if err := c.ShouldBindJSON(&opp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Validate(&opp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Create(c.Request.Context(), &opp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create opportunity",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Opportunity created successfully",
		"data":    opp.ToResponse(),
	})
}

func (h *OpportunityHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var opp models.Opportunity
	if err := c.ShouldBindJSON(&opp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Validate(&opp); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Validation failed: " + err.Error(),
		})
		return
	}

	if err := h.service.Update(c.Request.Context(), id, &opp); err != nil {
		if err.Error() == "opportunity not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Opportunity not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update opportunity",
		})
		return
	}

	updatedOpp, _ := h.service.GetByID(c.Request.Context(), id)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Opportunity updated successfully",
		"data":    updatedOpp.ToResponse(),
	})
}

func (h *OpportunityHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err.Error() == "opportunity not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Opportunity not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete opportunity",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Opportunity deleted successfully",
	})
}



