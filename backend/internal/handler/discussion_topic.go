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

type DiscussionTopicHandler struct {
	service *service.DiscussionTopicService
}

func NewDiscussionTopicHandler(svc *service.DiscussionTopicService) *DiscussionTopicHandler {
	return &DiscussionTopicHandler{service: svc}
}

func (h *DiscussionTopicHandler) GetAll(c *gin.Context) {
	isActive := c.Query("is_active")
	limit, _ := strconv.ParseInt(c.DefaultQuery("limit", "100"), 10, 64)
	offset, _ := strconv.ParseInt(c.DefaultQuery("offset", "0"), 10, 64)

	filter := bson.M{}
	if isActive == "true" {
		filter["is_active"] = true
	} else if isActive == "false" {
		filter["is_active"] = false
	}

	topics, total, err := h.service.GetAll(c.Request.Context(), filter, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch discussion topics",
		})
		return
	}

	data := make([]map[string]interface{}, len(topics))
	for i, topic := range topics {
		data[i] = topic.ToResponse()
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    data,
		"total":   total,
	})
}

func (h *DiscussionTopicHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	topic, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Discussion topic not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch discussion topic",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    topic.ToResponse(),
	})
}

func (h *DiscussionTopicHandler) Create(c *gin.Context) {
	var topic models.DiscussionTopic
	if err := c.ShouldBindJSON(&topic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Create(c.Request.Context(), &topic); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to create discussion topic: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Discussion topic created successfully",
		"data":    topic.ToResponse(),
	})
}

func (h *DiscussionTopicHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var topic models.DiscussionTopic
	if err := c.ShouldBindJSON(&topic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body: " + err.Error(),
		})
		return
	}

	if err := h.service.Update(c.Request.Context(), id, &topic); err != nil {
		if err.Error() == "discussion topic not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Discussion topic not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to update discussion topic: " + err.Error(),
		})
		return
	}

	updatedTopic, _ := h.service.GetByID(c.Request.Context(), id)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Discussion topic updated successfully",
		"data":    updatedTopic.ToResponse(),
	})
}

func (h *DiscussionTopicHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err.Error() == "discussion topic not found" {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"error":   "Discussion topic not found",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to delete discussion topic",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Discussion topic deleted successfully",
	})
}

