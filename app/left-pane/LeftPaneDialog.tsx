<<<<<<< HEAD
// Add this to the existing LeftPaneDialog.tsx file to include the filter tab

// Add this import
import { SmartFilterTab } from "./LeftPaneFilterTab"

// Add this to the LeftPaneDialog component's render method, in the tabs section
// Look for the existing tabs like INBOX_ARCHIVE, MESSAGE_REQUESTS, etc.

// Add this case to the switch statement that renders different tabs\
case LeftPaneMode.FILTER:
return (
    <SmartFilterTab
      i18n={i18n}
    />
  );
=======
// app/left-pane/LeftPaneDialog.tsx

import React from 'react';
import { LeftPaneMode } from '../constants/LeftPaneMode'; // adjust to your real path
import { SmartFilterTab } from './LeftPaneFilterTab';
import { InboxArchiveTab } from './InboxArchiveTab';
import { MessageRequestsTab } from './MessageRequestsTab';
// … other imports …

export interface LeftPaneDialogProps {
  mode: LeftPaneMode;
  i18n: (key: string) => string;
  // … any other props you already have …
}

export function LeftPaneDialog({
  mode,
  i18n,
  // … rest of your props …
}: LeftPaneDialogProps) {
  switch (mode) {
    case LeftPaneMode.INBOX_ARCHIVE:
      return <InboxArchiveTab /* pass needed props */ />;
  
    case LeftPaneMode.MESSAGE_REQUESTS:
      return <MessageRequestsTab /* … */ />;

    // ← your new filter case goes here
    case LeftPaneMode.FILTER:
      return (
        <SmartFilterTab
          i18n={i18n}
          // … pass any other props SmartFilterTab needs …
        />
      );

    // … other cases …

    default:
      return null;
  }
}
>>>>>>> 48e9ad314 (bootstrap)
