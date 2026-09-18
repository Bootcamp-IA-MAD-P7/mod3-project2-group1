from app.core.config import Settings


def test_settings_defaults():
    """Los defaults seguros deben activar el slice Essential sin servicios opcionales."""
    settings = Settings(_env_file=None)

    assert settings.app_env == "development"
    assert settings.cors_origins == ["http://localhost:5173"]
    assert settings.max_text_length == 5000
    assert settings.max_body_bytes == 32768
    assert settings.inference_timeout_seconds == 10
    assert settings.model_path == ""


def test_fake_predictor_enabled_in_development():
    """En desarrollo el predictor fake debe estar activo."""
    settings = Settings(_env_file=None)

    assert settings.fake_predictor_enabled is True


def test_fake_predictor_disabled_in_production():
    """En producción el predictor fake nunca debe activarse."""
    settings = Settings(_env_file=None, app_env="production")

    assert settings.fake_predictor_enabled is False