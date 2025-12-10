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

type ConversationClusterHandler struct {
	service *service.ConversationClusterService
}

func NewConversationClusterHandler(svc *service.ConversationClusterService) *ConversationClusterHandler {
	return &ConversationClusterHandler{service: svc}
}

func (h *ConversationClusterHandler) GetAll(c *gin.Context) {
	isActive := c.Query("is_active")
	limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "100"), 10, 64)
	offset, _ := strconv.ParseInt(c.DefaultQuery("offset", "0"), 10, 64)

	filter := bson.M{}
	if isActive == "true" {
		filter["is_active"] = true
	} else if isActive == "false" {
		filter["is_active"] = false
	}

	clusters, total, err := h.service.GetAll(c.Request.Context(), filter, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch conversation clusters",
		})
		return
	}

	data := make([]map[string]interface{}, len(clusters))
	for i, cluster := range clusters {
		data[i] = cluster.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"total":   total,
	})
}

func (h *ConversationClusterHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	cluster, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Conversation cluster not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch conversation cluster",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    cluster.ToResponse(),
	})
}

func (h *ConversationClusterHandler) Create(c *gin.Context) {
	var cluster models.ConversationCluster
	if err := c.ShouldBindJSON(&cluster); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Create(c.Request.Context(), &cluster); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create conversation cluster: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Conversation cluster created successfully",
		"data":    cluster.ToResponse(),
	})
}

func (h *ConversationClusterHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var cluster models.ConversationCluster
	if err := c.ShouldBindJSON(&cluster); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Update(c.Request.Context(), id, &cluster); err != nil {
		if err.Error() == "conversation cluster not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Conversation cluster not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update conversation cluster: " + err.Error(),
		})
		return
	}

	updatedCluster, _ := h.service.GetByID(c.Request.Context(), id)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Conversation cluster updated successfully",
		"data":    updatedCluster.ToResponse(),
	})
}

func (h *ConversationClusterHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err.Error() == "conversation cluster not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Conversation cluster not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete conversation cluster",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Conversation cluster deleted successfully",
	})
}

