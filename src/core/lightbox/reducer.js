
import {
  INIT_LIGHTBOX,
  ON_SWIPE,
  ON_CLOSE
} from './action-types';
import forIn from 'lodash.forin';
import findKey from 'lodash.findkey';

export const initialState = {
  activeSlide: {},
  slides: {},
  show: false
};

export function lightboxReducer(state = initialState, action) {
  switch (action.type) {
    case INIT_LIGHTBOX:
      return initLightBox(state, action);
    case ON_SWIPE:
      return onSwipe(state, action);
    case ON_CLOSE:
      return onClose(state);

    default:
      return state;
  }
}

function initLightBox(state, action) {
  const slides = {};
  forIn(action.payload.scope.state.gallery, (image, id) => {
    slides[id] = {
      id: image.id,
      src: image.src,
      active: image.id === action.payload.e.currentTarget.parentElement.id ? true : false
    };
  });
  return {
    ...state,
    slides: slides,
    show: true
  };
}

function onSwipe(state, action) {
  const direction = action.payload.direction;
  const slides = state.slides;
  const activeSlideId = findKey(state.slides, {active: true});
  const slidesIds = Object.keys(slides);
  const activeSlideIndex = slidesIds.indexOf(activeSlideId);

  let nextSlideIndex = direction === 'left' ? activeSlideIndex - 1 : activeSlideIndex + 1;
  const nextSlideId = slidesIds[nextSlideIndex];
  let nextSlide = slides[nextSlideId];

  if (!nextSlide && direction === 'right') {
    // get first slide id
    nextSlide = slides[slidesIds[0]];
  }
  else if (!nextSlide && direction === 'left') {
    // get last slide id
    const slidesLength = Object.keys(slides).length;
    nextSlide = slides[slidesIds.slice(slidesLength - 1, slidesLength)[0]];
  }

  let newSlides = {};

  forIn(slides, (slide, id) => {
    newSlides[id] = {
      ...slide,
      active: slide.id === nextSlide.id ? true : false
    };
  });

  return {
    ...state,
    slides: newSlides
  };
}

function onClose(state) {
  return {
    ...state,
    slides: {},
    show: false
  };
}
