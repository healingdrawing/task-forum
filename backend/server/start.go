package server

import (
	"database/sql"
	"forum/database"
	"log"
	"net/http"
	"strings"
)

type Server struct {
	DB database.DB
}

// Connect returns Server with connected database
func Connect(db *sql.DB) *Server {
	return &Server{DB: database.DB{DB: db}}
}

// Start returns http.Handler with all routes
func (srv *Server) Start() http.Handler {
	router := http.NewServeMux()

	// Master-handler for:
	// /api/posts/{id}, /api/posts/{id}/like, /api/posts/{id}/dislike
	// /api/posts/{id}/comment, /api/posts/{id}/comment/{id}/like, /api/posts/{id}/comment/{id}/dislike
	router.HandleFunc("/api/posts/", srv.apiPostsMasterHandler)

	// /api/posts handler
	router.HandleFunc("/api/posts", srv.postsHandler)

	// Master-handler for:
	// /api/user/{id}, /api/user/{id}/posts, /api/user/{id}
	router.HandleFunc("/api/user/", srv.apiUserMasterHandler)

	router.HandleFunc("/api/me", srv.apiMeHandler)
	router.HandleFunc("/api/me/posts", srv.apiMePostsHandler)
	router.HandleFunc("/api/me/posts/liked", srv.apiMePostsLikedHandler)

	router.HandleFunc("/api/login", srv.loginHandler)
	router.HandleFunc("/api/signup", srv.signupHandler)
	router.HandleFunc("/api/logout", srv.logoutHandler)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			// TODO uncomment in production
			if err := recover(); err != nil {
				log.Printf("ERROR %d. %v\n", http.StatusInternalServerError, err)
				errorResponse(w, http.StatusInternalServerError) // 500 ERROR
			}
		}()
		r.URL.Path = strings.TrimSpace(r.URL.Path)
		switch {
		case GetRegexp.MatchString(r.URL.Path):
			if r.Method != http.MethodGet {
				errorResponse(w, http.StatusMethodNotAllowed)
				return
			}
		case PostRegexp.MatchString(r.URL.Path):
			if r.Method != http.MethodPost {
				errorResponse(w, http.StatusMethodNotAllowed)
				return
			}
		default:
			errorResponse(w, http.StatusNotFound)
			return
		}
		router.ServeHTTP(w, r)
	})
}
