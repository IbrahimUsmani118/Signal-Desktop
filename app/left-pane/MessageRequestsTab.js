import React from 'react';
import PropTypes from 'prop-types';

/**
 * A stub component for the Message Requests tab.
 * Adapt this skeleton to show your request queue.
 */
export function MessageRequestsTab({ i18n /*, ...otherProps */ }) {
  return (
    <div className="left-pane-tab message-requests-tab">
      <h2>{i18n('leftPane.messageRequests.title')}</h2>
      {/* TODO: render incoming message requests here */}
    </div>
  );
}

MessageRequestsTab.propTypes = {
  i18n: PropTypes.func.isRequired,
  // define other PropTypes here
};
