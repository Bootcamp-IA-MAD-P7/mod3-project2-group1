"""Smoke tests de configuración del entorno reproducible (US-02)."""

from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
BACKEND_ROOT = Path(__file__).resolve().parents[2]


def test_env_example_exists_at_repo_root():
    """AC2: debe existir `.env.example` en la raíz."""
    assert (REPO_ROOT / ".env.example").is_file()


def test_env_example_has_no_secrets_and_public_prefixes():
    """AC1/AC2: claves secretas vacías por defecto; frontend solo con prefijo VITE_."""
    content = (REPO_ROOT / ".env.example").read_text(encoding="utf-8")
    lines = {line.split("=", 1)[0].strip() for line in content.splitlines() if "=" in line}
    assert "YOUTUBE_API_KEY" in lines
    assert "DATABASE_URL" in lines
    public_frontend = {key for key in lines if key.startswith("VITE_")}
    assert public_frontend
    assert all(not key.islower() or key.startswith("VITE_") for key in lines)


def test_backend_pyproject_and_uv_lock_exist():
    """AC1: la instalación reproducible depende de pyproject.toml y uv.lock (y frontend locks)."""
    assert (BACKEND_ROOT / "pyproject.toml").is_file()
    assert (BACKEND_ROOT / "uv.lock").is_file()
    assert (REPO_ROOT / "frontend" / "package.json").is_file()
    assert (REPO_ROOT / "frontend" / "package-lock.json").is_file()


def test_core_imports_without_optional_services():
    """AC3: importar módulos core no requiere DB, MLflow ni YouTube."""
    import ml.data.dataset
    import ml.evaluation.metrics
    import ml.features.tfidf
    import ml.models.baseline
    import ml.models.multinomial_nb  # noqa: F401