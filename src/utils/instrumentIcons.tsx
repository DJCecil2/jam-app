import React from "react";
import { SvgIconProps } from "@mui/material";
import {
  GuitarElectric,
  MusicClefBass,
  Music,
  Piano,
  Microphone,
  MusicNote,
} from "mdi-material-ui";

const iconMap: Record<string, React.ComponentType<SvgIconProps>> = {
  Guitar: GuitarElectric,
  Bass: MusicClefBass,
  Drums: Music,
  Keys: Piano,
  Vocals: Microphone,
};

export function getInstrumentIcon(
  label: string,
): React.ComponentType<SvgIconProps> {
  return iconMap[label] || MusicNote;
}
