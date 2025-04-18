import React from 'react';
import PropTypes from 'prop-types';

/**
 * A stub component for the Inbox / Archive tab.
 * Replace the markup below with your actual UI.
 */
export function InboxArchiveTab({ i18n /*, ...otherProps */ }) {
  return (
    <div className="left-pane-tab inbox-archive-tab">
      <h2>{i18n('leftPane.inboxArchive.title')}</h2>
      {/* TODO: render list of inbox/archive items here */}
    </div>
  );
}

InboxArchiveTab.propTypes = {
  i18n: PropTypes.func.isRequired,
  // define other PropTypes here
};
