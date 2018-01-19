import { isEmpty } from 'lodash';
// Constants
export const constants = {
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
};

// Action Creators
export const actions = {
  showModal: (ModalComponent, modalComponentProps = {}, modalContainerStyle = {}) => ({
    type: constants.SHOW_MODAL,
    payload: {
      ModalComponent,
      modalComponentProps,
      modalContainerStyle,
    },
  }),
  hideModal: () => ({
    type: constants.HIDE_MODAL,
  }),
};

// Reducer
export const initialState = {
  ModalComponent: null,
  modalComponentProps: {},
  modalContainerStyle: {},
}; // exporting initial state just for testing purposes.
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case constants.SHOW_MODAL:
      return {
        ...state,
        ModalComponent: action.payload.ModalComponent,
        modalComponentProps: action.payload.modalComponentProps,
        modalContainerStyle: action.payload.modalContainerStyle,
      };
    case constants.HIDE_MODAL:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

// Selectors
export const selectors = {
  ModalComponent: state => state.modal.ModalComponent,
  modalComponentProps: state => state.modal.modalComponentProps,
  modalContainerStyle: state => state.modal.modalContainerStyle,
  isShown: state => !isEmpty(state.modal.ModalComponent),
};

export default actions;
