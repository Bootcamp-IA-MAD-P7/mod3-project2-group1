"""Configuración central del backend mediante Pydantic Settings (D-09)."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Opciones de entorno con defaults seguros para el slice Essential."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "development"
    cors_origins: list[str] = ["http://localhost:5173"]

    max_text_length: int = 5000
    max_body_bytes: int = 32768
    inference_timeout_seconds: int = 10

    model_path: str = ""

    @property
    def fake_predictor_enabled(self) -> bool:
        """El predictor fake solo está disponible fuera de producción."""
        return self.app_env != "production"

    @property
    def model_metadata_path(self) -> str:
        """Metadata sidecar del bundle: mismo nombre base + `.metadata.json`."""
        if not self.model_path:
            return ""
        base = str(Path(self.model_path).with_suffix(""))
        return f"{base}.metadata.json"