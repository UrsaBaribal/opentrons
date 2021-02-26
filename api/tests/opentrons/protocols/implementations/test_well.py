import pytest
from opentrons.protocols.implementations.well import WellImplementation


@pytest.mark.parametrize(argnames=["name", "row", "col"],
                         argvalues=[
                             ["A1", "A", "1"],
                             ["A10", "A", "10"],
                             ["Z100", "Z", "100"],
                         ])
def test_row_column(name, row, col):
    w = WellImplementation(None, None, None, name=name)
    assert w.get_name() == name
    assert w.get_row_name() == row
    assert w.get_column_name() == col


@pytest.mark.parametrize(argnames=["name"],
                         argvalues=[
                             ["A0"],
                             ["a1"],
                             ["Aa1"],
                             ["A 1"],
                             ["A0100"]
                         ])
def test_row_column_fail(name):
    with pytest.raises(AssertionError, match=f"could not match '{name}'"):
        WellImplementation(None, None, None, name=name)
