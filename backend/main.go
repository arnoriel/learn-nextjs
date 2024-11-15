package main

import (
    "database/sql"
    "log"
    "net/http"
    "time"
    "strings"

    "github.com/google/uuid"
    "github.com/golang-jwt/jwt/v4"
    "github.com/labstack/echo/v4"
    "github.com/labstack/echo/v4/middleware"
    _ "github.com/lib/pq"
    "golang.org/x/crypto/bcrypt"
)

var jwtSecret = []byte("your_jwt_secret_key")

type User struct {
    ID       string `json:"id"`
    Username string `json:"username"`
    Email    string `json:"email"`
    Password string `json:"-"`
}

// Fungsi untuk migrasi tabel user
func migrateUsers(db *sql.DB) error {
    query := `
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
    )`
    _, err := db.Exec(query)
    return err
}

// Fungsi untuk registrasi user
func registerUser(c echo.Context) error {
    db := c.Get("db").(*sql.DB)

    u := new(User)
    if err := c.Bind(u); err != nil {
        return err
    }

    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }

    u.ID = uuid.New().String()
    _, err = db.Exec("INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)", u.ID, u.Username, u.Email, hashedPassword)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Failed to register"})
    }
    return c.JSON(http.StatusCreated, echo.Map{"message": "User registered successfully"})
}

// Fungsi untuk login user
func loginUser(c echo.Context) error {
    db := c.Get("db").(*sql.DB)

    u := new(User)
    if err := c.Bind(u); err != nil {
        return err
    }

    var user User
    err := db.QueryRow("SELECT id, username, email, password FROM users WHERE email = $1", u.Email).Scan(&user.ID, &user.Username, &user.Email, &user.Password)
    if err != nil {
        return echo.ErrUnauthorized
    }

    if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(u.Password)); err != nil {
        return echo.ErrUnauthorized
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": user.ID,
        "exp":     time.Now().Add(time.Hour * 24).Unix(),
    })

    tokenString, err := token.SignedString(jwtSecret)
    if err != nil {
        return c.JSON(http.StatusInternalServerError, echo.Map{"message": "Could not login"})
    }

    return c.JSON(http.StatusOK, echo.Map{"token": tokenString})
}

// Middleware untuk autentikasi
func jwtMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
    return func(c echo.Context) error {
        user := c.Get("user").(*jwt.Token)
        if user == nil {
            return echo.ErrUnauthorized
        }
        return next(c)
    }
}

func isAuthenticated(next echo.HandlerFunc) echo.HandlerFunc {
    return func(c echo.Context) error {
        authHeader := c.Request().Header.Get("Authorization")
        if authHeader == "" {
            return next(c) // Jika tidak ada header, lanjutkan ke halaman yang diakses
        }

        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            // Replace dengan kunci rahasia Anda
            return []byte("your_secret_key"), nil
        })

        if err == nil && token.Valid {
            return c.Redirect(http.StatusFound, "/dashboard") // Redirect ke dashboard jika sudah login
        }

        return next(c) // Jika token tidak valid atau ada error, lanjutkan ke halaman login
    }
}

func main() {
    e := echo.New()
    e.Use(middleware.CORS())

    db, err := sql.Open("postgres", "user=postgres password=arnoarno dbname=echonext sslmode=disable")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    if err := migrateUsers(db); err != nil {
        log.Fatal(err)
    }

    e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            c.Set("db", db)
            return next(c)
        }
    })

    e.POST("/api/register", registerUser, isAuthenticated)
    e.POST("/api/login", loginUser, isAuthenticated)

    r := e.Group("/api/restricted")
    r.Use(middleware.JWTWithConfig(middleware.JWTConfig{
        SigningKey: jwtSecret,
    }))
    r.GET("/dashboard", func(c echo.Context) error {
        return c.JSON(http.StatusOK, echo.Map{"message": "Welcome to the dashboard"})
    })

    e.Logger.Fatal(e.Start(":8080"))
}
