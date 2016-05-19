
import {
  INIT_LIGHTBOX,
  ON_SWIPE,
  ON_CLOSE
} from './action-types';


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
  return {
    ...state,
    slides: action.payload.scope.state.gallery.map(image => {
      return {
        id: image.id,
        src: image.src,
        active: image.id === action.payload.e.currentTarget.parentElement.id ? true : false
      };
    }),
    show: true
  };
}

function onSwipe(state, action) {
  const direction = action.payload.direction;
  const slides = state.slides;
  const activeSlideIndex = state.slides.findIndex(slide => {
    return slide.active ? true : false;
  });
  let nextSlide = direction === 'left' ? state.slides[activeSlideIndex - 1] : state.slides[activeSlideIndex + 1];

  if (!nextSlide && direction === 'right') {
    nextSlide = slides[0];
  }
  else if (!nextSlide && direction === 'left') {
    nextSlide = state.slides.slice(slides.length - 1, slides.length)[0];
  }

  return {
    ...state,
    slides: slides.map(slide => {
      return {
        ...slide,
        active: slide.id === nextSlide.id ? true : false
      };
    })
  };
}

function onClose(state) {
  return {
    ...state,
    slides: {},
    show: false
  };
}
