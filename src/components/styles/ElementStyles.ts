import {
  interactionEffects,
  textInteractions,
  shadowEffects,
  transitions,
  fontStyles,
  colorTheme,
  combineStyles,
} from "../styles/WeatherTunesStyles";

/**
 * Element style factory - creates consistent style combinations
 * Centralizes all element styling logic for maximum maintainability
 */
export const createElementStyles = () => ({
  // Weather section elements
  weatherLocation: combineStyles(
    fontStyles.locationText,
    colorTheme.primaryText,
    transitions.standard,
    interactionEffects.elementHover,
    "w-full text-left",
  ),

  weatherTemperature: combineStyles(
    fontStyles.temperatureDisplay,
    colorTheme.temperatureText,
    shadowEffects.base,
    shadowEffects.baseHover,
    transitions.standard,
    interactionEffects.elementHover,
    "-mt-[0.025em] mb-[0.035em] -ml-[0.1em] w-full text-left",
  ),

  weatherCondition: combineStyles(
    fontStyles.conditionText,
    colorTheme.conditionText,
    transitions.standard,
    interactionEffects.elementHover,
    "mb-[0.2em] w-full text-left",
  ),

  // Time display elements
  timeContainer: combineStyles(
    fontStyles.timeDisplay,
    "w-full max-w-full overflow-hidden text-left",
  ),

  timeElement: combineStyles(
    transitions.standard,
    interactionEffects.elementHover,
    "inline-flex items-center",
  ),

  // Music section elements
  albumContainer: combineStyles(
    transitions.standard,
    "group/album relative mb-[0.2em] h-[8em] w-[8em]",
  ),

  albumImage: combineStyles(
    shadowEffects.image,
    shadowEffects.imageHover,
    transitions.standard,
    interactionEffects.enhancedHover,
    "h-full w-full rounded-lg object-cover",
  ),

  musicInfo: combineStyles(
    transitions.standard,
    interactionEffects.containerHover,
    "w-full pt-1 text-center text-[0.8em]",
  ),

  musicTitle: combineStyles(
    fontStyles.musicTitle,
    colorTheme.primaryText,
    transitions.standard,
    textInteractions.primaryHover,
    "truncate",
  ),

  musicArtist: combineStyles(
    fontStyles.musicArtist,
    colorTheme.artistText,
    transitions.standard,
    textInteractions.secondaryHover,
    "mt-[0.1em] truncate",
  ),
});
