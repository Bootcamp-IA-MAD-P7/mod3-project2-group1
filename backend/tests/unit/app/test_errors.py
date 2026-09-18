from app.core.errors import ErrorEnvelope, _validation_details


def test_error_envelope_requires_error_fields():
    """ErrorEnvelope exige code, message, request_id y details."""
    envelope = ErrorEnvelope(
        error={
            "code": "VALIDATION_ERROR",
            "message": "Input validation failed",
            "request_id": "11111111-1111-4111-8111-111111111111",
            "details": [{"path": "text", "reason": "must contain a non-whitespace character"}],
        }
    )

    assert envelope.error.code == "VALIDATION_ERROR"
    assert envelope.error.request_id != ""
    assert envelope.error.details[0].path == "text"


def test_error_envelope_details_have_path_and_reason():
    """Cada detail del ErrorEnvelope expone path y reason seguros."""
    envelope = ErrorEnvelope(
        error={
            "code": "VALIDATION_ERROR",
            "message": "Input validation failed",
            "request_id": "11111111-1111-4111-8111-111111111111",
            "details": [{"path": "text", "reason": "too long"}],
        }
    )

    assert envelope.error.details[0].model_dump() == {"path": "text", "reason": "too long"}


def test_unknown_extra_fields_rejected():
    """El ErrorEnvelope rechaza campos extra para mantener el contrato estricto."""
    import pytest
    from pydantic import ValidationError

    with pytest.raises(ValidationError):
        ErrorEnvelope(
            error={
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed",
                "request_id": "11111111-1111-4111-8111-111111111111",
                "details": [],
                "unexpected": "field",
            }
        )


def test_validation_details_maps_without_echoing_input():
    """_validation_details extrae path y reason sin eco del contenido original."""
    pydantic_errors = [
        {
            "loc": ("body", "text"),
            "type": "value_error",
            "msg": "Value error, text must contain a non-whitespace character",
            "ctx": {"error": "text must contain a non-whitespace character"},
        }
    ]

    details = _validation_details(pydantic_errors)

    assert details == [("body.text", "value_error")]
    assert all(isinstance(d[0], str) and isinstance(d[1], str) for d in details)