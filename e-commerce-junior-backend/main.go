package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"gorm/handlers"
	"gorm/middleware"
	"gorm/models"

	"github.com/gorilla/mux"
)

func main() {


	models.MigrateRoles()
	models.MigrateCategory()
	models.MigrateProduct()
	models.MigrateUser()

	mux := mux.NewRouter()

	// Roles Service
	mux.Handle("/api/role/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetRoles), "admin")).Methods(http.MethodGet)
	mux.Handle("/api/role/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetRole), "admin")).Methods(http.MethodGet)
	mux.Handle("/api/role/userByRole/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetRoleComplete), "admin")).Methods(http.MethodGet)
	mux.Handle("/api/role/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.CreateRole), "admin")).Methods(http.MethodPost)
	mux.Handle("/api/role/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.UpdateRole), "admin")).Methods(http.MethodPut)
	mux.Handle("/api/role/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.DeleteRole), "admin")).Methods(http.MethodDelete)

	// User Service
	mux.HandleFunc("/api/user/", handlers.CreateUser).Methods(http.MethodPost)
	mux.Handle("/api/user/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetUser), "admin","seller","shooper")).Methods(http.MethodGet)
	mux.Handle("/api/user/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetUsers),"admin")).Methods(http.MethodGet)
	mux.Handle("/api/user/userByRole/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetUsersByRole),"admin")).Methods(http.MethodGet)
	mux.Handle("/api/user/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.UpdateUser),"admin")).Methods(http.MethodPut)
	mux.Handle("/api/user/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.DeleteUser),"admin")).Methods(http.MethodDelete)

	// Category Service
	mux.Handle("/api/category/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetCategories), "admin","seller")).Methods(http.MethodGet)
	mux.Handle("/api/category/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetCategory), "admin","seller","shooper")).Methods(http.MethodGet)
	mux.Handle("/api/category/productsByCategory/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetCategoryComplete),"admin","seller","shooper")).Methods(http.MethodGet)
	mux.Handle("/api/category/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.CreateCategory),"admin","seller")).Methods(http.MethodPost)
	mux.Handle("/api/category/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.UpdateCategory),"admin","seller")).Methods(http.MethodPut)
	mux.Handle("/api/category/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.DeleteCategory),"admin")).Methods(http.MethodDelete)

	// Product Service
	mux.Handle("/api/product/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetProducts),"admin","seller","shooper")).Methods(http.MethodGet)
	mux.Handle("/api/product/productByCategory/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetProductsByCategory),"admin","seller","shooper")).Methods(http.MethodGet)
	mux.Handle("/api/product/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetProduct),"admin","seller","shooper")).Methods(http.MethodGet)
	mux.Handle("/api/product/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.CreateProduct),"admin","seller")).Methods(http.MethodPost)
	mux.Handle("/api/product/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.UpdateProduct),"admin","seller")).Methods(http.MethodPut)
	mux.Handle("/api/product/{id:[0-9]+}", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.DeleteProduct),"admin","seller")).Methods(http.MethodDelete)
	
	// ShopingCar Service
	mux.Handle("/api/shoppingcart/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetShopingCar),"admin","seller","shooper")).Methods(http.MethodGet)
	mux.Handle("/api/shoppingcart/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.SaveShopingCar),"admin","seller", "shooper")).Methods(http.MethodPost)
	// Chat service
	

    // Chatbot Service (existente)
    mux.Handle("/api/chatbot/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.GetChatMessagesHandler), "admin", "seller", "shooper")).Methods(http.MethodGet)
    mux.Handle("/api/chatbot/", middleware.JWTAuthMiddleware(http.HandlerFunc(handlers.CreateChatMessageHandler), "admin", "seller", "shooper")).Methods(http.MethodPost)

    // Nuevo endpoint para el chatbot compatible con el frontend
    mux.Handle("/api/chat", middleware.JWTAuthMiddleware(http.HandlerFunc(ChatbotHandler), "admin", "seller", "shooper")).Methods(http.MethodPost)

    // Session Service
    mux.HandleFunc("/api/session/", handlers.GetSessionUser).Methods(http.MethodPost)
    mux.HandleFunc("/api/healt/", handlers.Healt).Methods(http.MethodGet)

	// Sesion Service
	mux.HandleFunc("/api/session/", handlers.GetSessionUser).Methods(http.MethodPost)
	mux.HandleFunc("/api/healt/", handlers.Healt).Methods(http.MethodGet)
	
	//Aplica el middleware de CORS
	wrappedMux := middleware.EnableCORS(mux)
	log.Fatal(http.ListenAndServe(":3000", wrappedMux))
}




// ChatbotHandler con integración de AI/ML API
func ChatbotHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Recibida solicitud en /api/chat")

	// Estructura para recibir el cuerpo de la solicitud
	type ChatRequest struct {
		Messages []struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"messages"`
	}

	// Estructura para la respuesta (compatible con el frontend)
	type ChatResponse struct {
		Choices []struct {
			Message struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}

	// Decodificar la solicitud del frontend
	var req ChatRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decodificando solicitud: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	log.Printf("Solicitud decodificada: %+v", req)

	// Preparar la solicitud para AI/ML API
	aimlRequest := map[string]interface{}{
		"model":      "gpt-3.5-turbo",
		"messages":   req.Messages,
		"max_tokens": 200,
		"temperature": 0.8,
	}
	aimlRequestBody, err := json.Marshal(aimlRequest)
	if err != nil {
		log.Printf("Error marshaling aimlRequest: %v", err)
		http.Error(w, "Failed to prepare AI request", http.StatusInternalServerError)
		return
	}
	log.Printf("Solicitud a AI/ML API: %s", string(aimlRequestBody))

	// Hacer la solicitud a AI/ML API
	client := &http.Client{}
	aimlReq, err := http.NewRequest("POST", "https://api.aimlapi.com/v1/chat/completions", bytes.NewBuffer(aimlRequestBody))
	if err != nil {
		log.Printf("Error creando solicitud a AI/ML API: %v", err)
		http.Error(w, "Failed to create AI request", http.StatusInternalServerError)
		return
	}
	aimlReq.Header.Set("Content-Type", "application/json")
	aimlReq.Header.Set("Authorization", "Bearer 77ecffffdb5c47088e776191799cfff5") // Usa tu clave API de aimlapi.com
	log.Println("Enviando solicitud a AI/ML API")

	resp, err := client.Do(aimlReq)
	if err != nil {
		log.Printf("Error conectando a AI/ML API: %v", err)
		http.Error(w, "Failed to connect to AI/ML API: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()
	log.Printf("Respuesta recibida de AI/ML API con status: %d", resp.StatusCode)

	// Leer la respuesta de AI/ML API
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error leyendo respuesta de AI/ML API: %v", err)
		http.Error(w, "Failed to read AI response", http.StatusInternalServerError)
		return
	}
	log.Printf("Cuerpo de la respuesta de AI/ML API: %s", string(body))

	// Parsear la respuesta de AI/ML API
	var aimlResponse struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(body, &aimlResponse); err != nil {
		log.Printf("Error parseando respuesta de AI/ML API: %v", err)
		http.Error(w, "Failed to parse AI response", http.StatusInternalServerError)
		return
	}

	// Verificar que hay una respuesta válida
	if len(aimlResponse.Choices) == 0 {
		log.Println("No hay choices en la respuesta de AI/ML API")
		http.Error(w, "No response from AI/ML API", http.StatusInternalServerError)
		return
	}
	log.Printf("Respuesta parseada de AI/ML API: %+v", aimlResponse)

	// Construir la respuesta para el frontend
	response := ChatResponse{
		Choices: []struct {
			Message struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"message"`
		}{
			{
				Message: struct {
					Role    string `json:"role"`
					Content string `json:"content"`
				}{
					Role:    "assistant",
					Content: aimlResponse.Choices[0].Message.Content,
				},
			},
		},
	}

	// Enviar la respuesta al frontend
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error codificando respuesta para el frontend: %v", err)
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
	log.Println("Respuesta enviada al frontend con éxito")
}
