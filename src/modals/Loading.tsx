import * as React from 'react';
import { Modal } from 'squiffles-components';

export default function Loading(props: {
  cancelLoad: () => void;
  visible: boolean;
}): JSX.Element {
  const { cancelLoad, visible } = props;

  return (
    <Modal
      actions={[{ label: 'Cancel', onClick: cancelLoad }]}
      centered={true}
      visible={visible}
    >
      <h3>Loading data from Last.fm&hellip;</h3>
    </Modal>
  );
}
