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
    "mb-1 sm:mb-2 md:mb-3 w-full text-left",
  ),

  weatherCondition: combineStyles(
    fontStyles.conditionText,
    colorTheme.conditionText,
    transitions.standard,
    interactionEffects.elementHover,
    "mb-2 sm:mb-3 md:mb-4 w-full text-left",
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
    "group/album relative mb-2 sm:mb-3 md:mb-4 h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40",
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
    "w-full pt-2 sm:pt-3 md:pt-4 text-center",
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
    "mt-1 sm:mt-2 truncate",
  ),
});
