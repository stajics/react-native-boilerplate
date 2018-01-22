import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as modalActions, selectors as modalSelectors } from '../redux/modules/modalModule';
// assets
import globalStyles from '../assets/styles';

const mapStateToProps = state => ({
  ModalComponent: modalSelectors.ModalComponent(state),
  modalComponentProps: modalSelectors.modalComponentProps(state),
  modalContainerStyle: modalSelectors.modalContainerStyle(state),
});

const actionCreators = {
  showModal: modalActions.showModal,
  hideModal: modalActions.hideModal,
};

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators(actionCreators, dispatch) });

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: globalStyles.colors.colorBlack,
    opacity: 0.2,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  dropdownComponentContainer: {
    flex: 1,
  },
});

const ModalManager = ({
  ModalComponent, modalComponentProps, modalContainerStyle, actions,
}) => (
  ModalComponent &&
    <View style={[styles.modalContainer, modalContainerStyle]}>
      <TouchableOpacity style={[styles.overlay]} onPress={actions.hideModal} />
      <View style={[styles.dropdownComponentContainer]}>
        <ModalComponent {...modalComponentProps} />
      </View>
    </View>
);

ModalManager.propTypes = {
  actions: PropTypes.object.isRequired,
  ModalComponent: PropTypes.func,
  modalComponentProps: PropTypes.object,
  modalContainerStyle: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalManager);
