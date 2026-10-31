import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from backend.app.core.config import settings
from backend.app.api.router import api_router
from backend.app.api.deps import get_container

# Configure structured logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("terraledger-backend")

DEV_AUTH_WARNING = (
    "===================================================================\n"
    " WARNING: DEV AUTH — SPRINT-GRADE AUTHENTICATION IN USE.\n"
    " THIS SYSTEM IS NOT PRODUCTION-READY. DO NOT USE IN PRODUCTION.\n"
    "==================================================================="
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup validation
    logger.warning("\n%s", DEV_AUTH_WARNING)
    settings.validate_production_safety()
    # Initialize container and storage repositories
    get_container()
    logger.info("TerraLedger AI Backend started successfully in '%s' mode (env: %s)", settings.APP_MODE, settings.APP_ENV)
    logger.info(
        "CORS effective configuration: env=%s, allow_origin_regex=%s, explicit_origins=%s",
        settings.APP_ENV,
        settings.CORS_ORIGIN_REGEX,
        settings.CORS_ORIGINS,
    )
    yield
    logger.info("TerraLedger AI Backend shutting down.")

def create_app() -> FastAPI:
    app = FastAPI(
        title="TerraLedger AI Backend API",
        description=(
            "Independent MRV and Agricultural Carbon Evidence Engine.\n\n"
            + "**DEV AUTH WARNING:** This instance is running a sprint-grade demonstration authentication system."
        ),
        version=settings.APP_VERSION,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/api/openapi.json",
    )

    # CORS Middleware Configuration
    cors_kwargs = {
        "allow_origins": settings.CORS_ORIGINS,
        "allow_credentials": True,
        "allow_methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        "allow_headers": ["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
    }
    if settings.CORS_ORIGIN_REGEX:
        cors_kwargs["allow_origin_regex"] = settings.CORS_ORIGIN_REGEX

    app.add_middleware(
        CORSMiddleware,
        **cors_kwargs,
    )

    def attach_cors_headers(response: JSONResponse, request: Request) -> JSONResponse:
        origin = request.headers.get("origin")
        if origin and settings.is_origin_allowed(origin):
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = (
                "Authorization, Content-Type, Accept, Origin, X-Requested-With"
            )
        return response

    # Global Exception Handlers for Frozen Error Envelope
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        code = "HTTP_ERROR"
        details = None
        message = str(exc.detail)
        if isinstance(exc.detail, dict):
            code = exc.detail.get("code", "HTTP_ERROR")
            message = exc.detail.get("message", "An error occurred.")
            details = exc.detail.get("details", None)

        response = JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "code": code,
                    "message": message,
                    "details": details,
                }
            },
        )
        return attach_cors_headers(response, request)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        response = JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "The submitted payload failed schema validation.",
                    "details": exc.errors(),
                }
            },
        )
        return attach_cors_headers(response, request)

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        logger.exception("Unhandled server exception: %s", exc)
        response = JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "An internal error occurred while processing the request.",
                    "details": str(exc) if settings.APP_ENV == "development" else None,
                }
            },
        )
        return attach_cors_headers(response, request)

    # Include API Router
    app.include_router(api_router)

    return app

app = create_app()
