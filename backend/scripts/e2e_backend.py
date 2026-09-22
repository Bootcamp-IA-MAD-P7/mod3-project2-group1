"""Backend helper for E2E: dumps resolved Settings and runs uvicorn on PORT."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

import uvicorn

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


def main() -> None:
    from app.core.config import Settings
    from app.main import create_app

    settings = Settings()
    marker = os.environ.get("E2E_MARKER")
    if marker:
        Path(marker).write_text(
            json.dumps(
                {
                    "app_env": settings.app_env,
                    "model_path": settings.model_path,
                    "cors_origins": settings.cors_origins,
                }
            ),
            encoding="utf-8",
        )
    uvicorn.run(
        create_app(settings),
        host="127.0.0.1",
        port=int(os.environ.get("PORT", "8000")),
        log_level="info",
    )


if __name__ == "__main__":
    main()