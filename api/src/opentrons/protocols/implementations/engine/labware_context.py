"""Module containing labware interface that works with Protocol Engine."""
from typing import Any, Dict, List

from opentrons.protocol_engine import StateView
from opentrons.protocols.geometry.labware_geometry import LabwareGeometry
from opentrons.protocols.implementations.tip_tracker import TipTracker
from opentrons.protocols.implementations.well import WellImplementation
from opentrons.protocols.implementations.well_grid import WellGrid
from opentrons.types import Point
from opentrons_shared_data.labware.dev_types import (
    LabwareDefinition, LabwareParameters
)
from opentrons.protocols.implementations.interfaces.labware\
    import LabwareInterface


class LabwareContext(LabwareInterface):
    """LabwareInterface implementation that works with the Protocol Engine."""

    def __init__(self, labware_id: str, state_view: StateView):
        self._id = labware_id
        self._state_view = state_view

    def __eq__(self, other: Any) -> bool:
        return isinstance(other, LabwareContext) and other._id == self._id

    def get_uri(self) -> str:
        """Get the labware uri."""
        return self._state_view.labware.get_definition_uri(labware_id=self._id)

    def get_display_name(self) -> str:
        """Get the display name."""
        lw = self._state_view.labware.get_labware_data_by_id(labware_id=self._id)
        # TODO AL 20210225 - this is not consistent with reference
        #  implementation. It is either the supplied label or displayName in
        #  definition on the location, which is either a slot or module.
        return f"{lw.definition['metadata']['displayName']} on {lw.location.slot}"

    def get_name(self) -> str:
        """Get the name."""
        # TODO AL 20210225 - this is not consistent with reference
        #  implementation. It is either the supplied label or loadName in
        #  definition.
        return self.get_parameters()['loadName']

    def set_name(self, new_name: str) -> None:
        raise NotImplementedError()

    def get_definition(self) -> LabwareDefinition:
        """Get the labware definition."""
        return self._state_view.labware.get_labware_data_by_id(
            labware_id=self._id).definition

    def get_parameters(self) -> LabwareParameters:
        """Get the labware definition parameters."""
        return self.get_definition()['parameters']

    def get_quirks(self) -> List[str]:
        """Get the labware quirks."""
        return self.get_parameters()['quirks']

    def set_calibration(self, delta: Point) -> None:
        raise NotImplementedError()

    def get_calibrated_offset(self) -> Point:
        """Get the calibrated offset."""
        x, y, z = self._state_view.labware.get_labware_data_by_id(
            labware_id=self._id).calibration
        return Point(x=x, y=y, z=z)

    def is_tiprack(self) -> bool:
        """Return whether this labware is a tiprack."""
        return self.get_parameters()['isTiprack']

    def get_tip_length(self) -> float:
        """Get the tip length."""
        return self._state_view.labware.get_tip_length(labware_id=self._id)

    def set_tip_length(self, length: float):
        raise NotImplementedError()

    def reset_tips(self) -> None:
        raise NotImplementedError()

    def get_tip_tracker(self) -> TipTracker:
        raise NotImplementedError()

    def get_well_grid(self) -> WellGrid:
        raise NotImplementedError()

    def get_wells(self) -> List[WellImplementation]:
        raise NotImplementedError()

    def get_wells_by_name(self) -> Dict[str, WellImplementation]:
        raise NotImplementedError()

    def get_geometry(self) -> LabwareGeometry:
        raise NotImplementedError()

    @property
    def highest_z(self):
        raise NotImplementedError()

    @property
    def separate_calibration(self) -> bool:
        raise NotImplementedError()

    @property
    def load_name(self) -> str:
        """Get the load name."""
        return self.get_parameters()['loadName']
