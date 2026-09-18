"""Adaptador de persistencia nulo para el nivel Essential (D-07)."""

from app.ports.repository import PersistenceKind, PredictionRecord


class NullPredictionRepository:
    """No persiste nada: informa `disabled` sin abrir conexiones externas."""

    def save(self, record: PredictionRecord) -> PersistenceKind:
        return "disabled"