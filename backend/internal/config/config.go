package config

import (
	"os"
	"strings"
)

type Config struct {
	Port               string
	GinMode            string
	MongoDBURI         string
	MongoDBDatabase    string
	CORSAllowedOrigins []string
	CORSAllowedMethods []string
	CORSAllowedHeaders []string
}

func Load() *Config {
	return &Config{
		Port:               getEnv("PORT", "8000"),
		GinMode:            getEnv("GIN_MODE", "debug"),
		MongoDBURI:         getEnv("MONGODB_URI", "mongodb://localhost:27017"),
		MongoDBDatabase:    getEnv("MONGODB_DATABASE", "naradai"),
		CORSAllowedOrigins: strings.Split(getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173,https://staging.teoremaintelligence.com,https://teoremaintelligence.com,http://127.0.0.1:8000,http://127.0.0.1:8080,https://api.staging.teoremaintelligence.com"), ","),
		CORSAllowedMethods: strings.Split(getEnv("CORS_ALLOWED_METHODS", "GET,POST,PUT,PATCH,DELETE,OPTIONS"), ","),
		CORSAllowedHeaders: strings.Split(getEnv("CORS_ALLOWED_HEADERS", "Content-Type,Authorization"), ","),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
