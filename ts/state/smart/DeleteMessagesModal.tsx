// Copyright 2023 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { StateType } from '../reducer';
import { getIntl } from '../selectors/user';
import { useGlobalModalActions } from '../ducks/globalModals';
import DeleteMessagesModal from '../../components/DeleteMessagesModal';
import { strictAssert } from '../../util/assert';
import { canDeleteMessagesForEveryone } from '../selectors/message';
import { useConversationsActions } from '../ducks/conversations';
import { useToastActions } from '../ducks/toast';
import {
  getConversationSelector,
  getLastSelectedMessage,
} from '../selectors/conversations';
import { getDeleteMessagesProps } from '../selectors/globalModals';

export const SmartDeleteMessagesModal = memo(
  function SmartDeleteMessagesModal() {
    const deleteMessagesProps = useSelector(getDeleteMessagesProps);
    strictAssert(
      deleteMessagesProps != null,
      'Cannot render delete messages modal without messages'
    );
    const { conversationId, messageIds, onDelete } = deleteMessagesProps;
    const conversationSelector = useSelector(getConversationSelector);
    const conversation = conversationSelector(conversationId);
    const { isMe } = conversation;

    const getCanDeleteForEveryone = useCallback(
      (state: StateType) => {
        return canDeleteMessagesForEveryone(state, { messageIds, isMe });
      },
      [messageIds, isMe]
    );
    const canDeleteForEveryone = useSelector(getCanDeleteForEveryone);
    const lastSelectedMessage = useSelector(getLastSelectedMessage);
    const i18n = useSelector(getIntl);
    const { toggleDeleteMessagesModal } = useGlobalModalActions();
    const { deleteMessages, deleteMessagesForEveryone } =
      useConversationsActions();
    const { showToast } = useToastActions();

    return (
      <DeleteMessagesModal
        isMe={isMe}
        canDeleteForEveryone={canDeleteForEveryone}
        i18n={i18n}
        messageCount={deleteMessagesProps.messageIds.length}
        onClose={() => {
          toggleDeleteMessagesModal(undefined);
        }}
        onDeleteForMe={() => {
          deleteMessages({
            conversationId,
            messageIds,
            lastSelectedMessage,
          });
          onDelete?.();
        }}
        onDeleteForEveryone={() => {
          deleteMessagesForEveryone(messageIds);
          onDelete?.();
        }}
        showToast={showToast}
      />
    );
  }
);
