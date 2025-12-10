package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"naradai-backend/internal/config"
	"naradai-backend/internal/handler"
	"naradai-backend/internal/repository"
	"naradai-backend/internal/service"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using default values")
	}

	// Load configuration
	cfg := config.Load()

	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.MongoDBURI))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer client.Disconnect(ctx)

	// Ping database
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	log.Println("Connected to MongoDB successfully")

	db := client.Database(cfg.MongoDBDatabase)

	// Initialize Priority Action layers
	repo := repository.NewPriorityActionRepository(db)
	svc := service.NewPriorityActionService(repo)
	h := handler.NewPriorityActionHandler(svc)

	// Initialize Dashboard Stat layers
	statRepo := repository.NewDashboardStatRepository(db)
	statSvc := service.NewDashboardStatService(statRepo)
	statHandler := handler.NewDashboardStatHandler(statSvc)

	// Initialize Risk layers
	riskRepo := repository.NewRiskRepository(db)
	riskSvc := service.NewRiskService(riskRepo)
	riskHandler := handler.NewRiskHandler(riskSvc)

	// Initialize Opportunity layers
	oppRepo := repository.NewOpportunityRepository(db)
	oppSvc := service.NewOpportunityService(oppRepo)
	oppHandler := handler.NewOpportunityHandler(oppSvc)

	// Initialize Sentiment Trend layers
	sentimentTrendRepo := repository.NewSentimentTrendRepository(db)
	sentimentTrendSvc := service.NewSentimentTrendService(sentimentTrendRepo)
	sentimentTrendHandler := handler.NewSentimentTrendHandler(sentimentTrendSvc)

	// Initialize Discussion Topic layers
	discussionTopicRepo := repository.NewDiscussionTopicRepository(db)
	discussionTopicSvc := service.NewDiscussionTopicService(discussionTopicRepo)
	discussionTopicHandler := handler.NewDiscussionTopicHandler(discussionTopicSvc)

	// Initialize Competitive Analysis layers
	competitiveAnalysisRepo := repository.NewCompetitiveAnalysisRepository(db)
	competitiveAnalysisSvc := service.NewCompetitiveAnalysisService(competitiveAnalysisRepo)
	competitiveAnalysisHandler := handler.NewCompetitiveAnalysisHandler(competitiveAnalysisSvc)

	// Initialize Conversation Cluster layers
	conversationClusterRepo := repository.NewConversationClusterRepository(db)
	conversationClusterSvc := service.NewConversationClusterService(conversationClusterRepo)
	conversationClusterHandler := handler.NewConversationClusterHandler(conversationClusterSvc)

	// Setup Gin router
	if cfg.GinMode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()

	// CORS middleware
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "https://staging.teoremaintelligence.com"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// API routes
	api := router.Group("/api/v1")
	{
		// Priority Actions routes
		api.GET("/priority-actions", h.GetAll)
		api.GET("/priority-actions/:id", h.GetByID)
		api.POST("/priority-actions", h.Create)
		api.PUT("/priority-actions/:id", h.Update)
		api.PUT("/priority-actions/:id/status", h.UpdateStatus)
		api.DELETE("/priority-actions/:id", h.Delete)

		// Dashboard Stats routes
		api.GET("/dashboard-stats", statHandler.GetAll)
		api.GET("/dashboard-stats/:id", statHandler.GetByID)
		api.POST("/dashboard-stats", statHandler.Create)
		api.PUT("/dashboard-stats/:id", statHandler.Update)
		api.DELETE("/dashboard-stats/:id", statHandler.Delete)

		// Risks routes
		api.GET("/risks", riskHandler.GetAll)
		api.GET("/risks/:id", riskHandler.GetByID)
		api.POST("/risks", riskHandler.Create)
		api.PUT("/risks/:id", riskHandler.Update)
		api.DELETE("/risks/:id", riskHandler.Delete)

		// Opportunities routes
		api.GET("/opportunities", oppHandler.GetAll)
		api.GET("/opportunities/:id", oppHandler.GetByID)
		api.POST("/opportunities", oppHandler.Create)
		api.PUT("/opportunities/:id", oppHandler.Update)
		api.DELETE("/opportunities/:id", oppHandler.Delete)

		// Sentiment Trends routes
		api.GET("/sentiment-trends", sentimentTrendHandler.GetAll)
		api.GET("/sentiment-trends/:id", sentimentTrendHandler.GetByID)
		api.POST("/sentiment-trends", sentimentTrendHandler.Create)
		api.PUT("/sentiment-trends/:id", sentimentTrendHandler.Update)
		api.DELETE("/sentiment-trends/:id", sentimentTrendHandler.Delete)

		// Discussion Topics routes
		api.GET("/discussion-topics", discussionTopicHandler.GetAll)
		api.GET("/discussion-topics/:id", discussionTopicHandler.GetByID)
		api.POST("/discussion-topics", discussionTopicHandler.Create)
		api.PUT("/discussion-topics/:id", discussionTopicHandler.Update)
		api.DELETE("/discussion-topics/:id", discussionTopicHandler.Delete)

		// Competitive Analysis routes
		api.GET("/competitive-analyses", competitiveAnalysisHandler.GetAll)
		api.GET("/competitive-analyses/:id", competitiveAnalysisHandler.GetByID)
		api.POST("/competitive-analyses", competitiveAnalysisHandler.Create)
		api.PUT("/competitive-analyses/:id", competitiveAnalysisHandler.Update)
		api.DELETE("/competitive-analyses/:id", competitiveAnalysisHandler.Delete)

		// Conversation Clusters routes
		api.GET("/conversation-clusters", conversationClusterHandler.GetAll)
		api.GET("/conversation-clusters/:id", conversationClusterHandler.GetByID)
		api.POST("/conversation-clusters", conversationClusterHandler.Create)
		api.PUT("/conversation-clusters/:id", conversationClusterHandler.Update)
		api.DELETE("/conversation-clusters/:id", conversationClusterHandler.Delete)
	}

	// Start server
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: router,
	}

	// Graceful shutdown
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Failed to start server:", err)
		}
	}()

	log.Printf("Server started on port %s\n", cfg.Port)

	// Wait for interrupt signal
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")

	ctx, cancel = context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}
