import pandas as pd

from ml.data.dataset import create_holdout_split, prepare_binary_dataset


def test_prepare_binary_dataset_keeps_required_columns():
    """El dataset preparado conserva texto, target y VideoId para controlar el split."""
    df = pd.DataFrame(
        {
            "CommentId": ["c1", "c2"],
            "VideoId": ["v1", "v2"],
            "Text": ["normal comment", "toxic comment"],
            "IsToxic": [False, True],
            "IsAbusive": [False, True],
            "IsHatespeech": [False, True],
            "IsRacist": [False, True],
        }
    )

    result = prepare_binary_dataset(df)

    assert list(result.columns) == ["VideoId", "Text", "IsToxic"]
    assert "CommentId" not in result.columns
    assert "IsAbusive" not in result.columns
    assert "IsHatespeech" not in result.columns
    assert "IsRacist" not in result.columns


def test_prepare_binary_dataset_removes_duplicate_texts():
    """Los textos duplicados deben eliminarse antes del split."""
    df = pd.DataFrame(
        {
            "VideoId": ["v1", "v1", "v2"],
            "Text": [
                "same comment",
                "same comment",
                "different comment",
            ],
            "IsToxic": [True, True, False],
        }
    )

    result = prepare_binary_dataset(df)

    assert len(result) == 2
    assert result["Text"].is_unique


def test_prepare_binary_dataset_removes_duplicates_ignoring_case():
    """Los textos que solo difieren en mayúsculas deben tratarse como duplicados."""
    df = pd.DataFrame(
        {
            "VideoId": ["v1", "v1", "v2"],
            "Text": [
                "RUN THEM OVER",
                "run them over",
                "different comment",
            ],
            "IsToxic": [True, True, False],
        }
    )

    result = prepare_binary_dataset(df)

    assert len(result) == 2


def test_create_holdout_split_separates_test_videos():
    """Los vídeos reservados deben quedar exclusivamente en el conjunto de test."""
    df = pd.DataFrame(
        {
            "VideoId": [
                "train_1",
                "train_1",
                "train_2",
                "4rCweDxDqdw",
                "5vF4si3hoRA",
                "8HB18hZrhXc",
                "TZxEyoplYbI",
            ],
            "Text": [
                "comment 1",
                "comment 2",
                "comment 3",
                "comment 4",
                "comment 5",
                "comment 6",
                "comment 7",
            ],
            "IsToxic": [False, True, False, True, False, True, False],
        }
    )

    dev, test = create_holdout_split(df)

    expected_test_videos = {
        "4rCweDxDqdw",
        "5vF4si3hoRA",
        "8HB18hZrhXc",
        "TZxEyoplYbI",
    }

    assert set(test["VideoId"]) == expected_test_videos
    assert set(dev["VideoId"]).isdisjoint(set(test["VideoId"]))


def test_create_holdout_split_preserves_all_rows():
    """El split no debe perder ni duplicar comentarios."""
    df = pd.DataFrame(
        {
            "VideoId": [
                "train_1",
                "train_2",
                "4rCweDxDqdw",
                "5vF4si3hoRA",
            ],
            "Text": ["a", "b", "c", "d"],
            "IsToxic": [False, True, False, True],
        }
    )

    dev, test = create_holdout_split(df)

    assert len(dev) + len(test) == len(df)