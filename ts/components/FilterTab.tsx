
import React, { useCallback, useEffect, useState } from 'react'
import type { LocalizerType } from '../types/I18N'
import { NavSidebar, NavSidebarActionButton } from './NavSidebar'
import type { ConversationType } from '../state/ducks/conversations'
import type {
  CallHistoryFilterOptions,
  CallHistoryGroup,
  CallHistoryPagination,
} from '../types/CallDisposition'
import { CallsNewCall } from './CallsNewCallButton'
import { useEscapeHandling } from '../hooks/useEscapeHandling'
import type {
  ActiveCallStateType,
  PeekNotConnectedGroupCallType,
<<<<<<< HEAD
} from '../state/ducks/calling';
import { ContextMenu } from './ContextMenu';
import { ConfirmationDialog } from './ConfirmationDialog';
import type { UnreadStats } from '../util/countUnreadStats';
import type { WidthBreakpoint } from './_util';
import type { CallLinkType } from '../types/CallLink';
import type { CallStateType } from '../state/selectors/calling';
import type { StartCallData } from './ConfirmLeaveCallModal';
import { I18n } from './I18n';

<<<<<<< HEAD
enum FilterTabSidebarView {
   View,
=======
// Make sure this path matches your project structure:
import { FilterTabView } from './FilterTabView';
=======
} from '../state/ducks/calling'
import { ContextMenu } from './ContextMenu'
import { ConfirmationDialog } from './ConfirmationDialog'
import type { UnreadStats } from '../util/countUnreadStats'
import type { WidthBreakpoint } from './_util'
import type { CallLinkType } from '../types/CallLink'
import type { CallStateType } from '../state/selectors/calling'
import type { StartCallData } from './ConfirmLeaveCallModal'
import { I18n } from './I18n'
import { FilterTabView } from './FilterTabView'
// import { t } from '../util/t'
>>>>>>> 5d9dcc506 (Message)

enum FilterTabSidebarView {
  View,
>>>>>>> 48e9ad314 (bootstrap)
  NewCallView,
}

type FilterTabProps = Readonly<{
<<<<<<< HEAD
  activeCall: ActiveCallStateType | undefined;
  allConversations: ReadonlyArray<ConversationType>;
  otherTabsUnreadStats: UnreadStats;
<<<<<<< HEAD
  getCallHistoryGroupsCount: (
    options: CallHistoryFilterOptions
  ) => Promise<number>;
  getCallHistoryGroups: (
    options: CallHistoryFilterOptions,
    pagination: CallHistoryPagination
  ) => Promise<Array<CallHistoryGroup>>;
=======
  getCallHistoryGroupsCount: (options: CallHistoryFilterOptions) => Promise<number>;
  getCallHistoryGroups: (
    options: CallHistoryFilterOptions,
    pagination: CallHistoryPagination
  ) => Promise<CallHistoryGroup[]>;
>>>>>>> 48e9ad314 (bootstrap)
  callHistoryEdition: number;
  getAdhocCall: (roomId: string) => CallStateType | undefined;
  getCall: (id: string) => CallStateType | undefined;
  getCallLink: (id: string) => CallLinkType | undefined;
  getConversation: (id: string) => ConversationType | void;
  hangUpActiveCall: (reason: string) => void;
  hasAnyAdminCallLinks: boolean;
  hasFailedStorySends: boolean;
  hasPendingUpdate: boolean;
  i18n: LocalizerType;
  navTabsCollapsed: boolean;
  onClearCallHistory: () => void;
  onMarkCallHistoryRead: (conversationId: string, callId: string) => void;
<<<<<<< HEAD
  onToggleNavTabsCollapse: (navTabsCollapsed: boolean) => void;
  onCreateCallLink: () => void;
  onOutgoingAudioCallInConversation: (conversationId: string) => void;
  onOutgoingVideoCallInConversation: (conversationId: string) => void;
  peekNotConnectedGroupCall: (options: PeekNotConnectedGroupCallType) => void;
  preferredLeftPaneWidth: number;
  renderCallLinkDetails: (
    roomId: string,
    callHistoryGroup: CallHistoryGroup,
=======
  onToggleNavTabsCollapse: (collapsed: boolean) => void;
  onCreateCallLink: () => void;
  onOutgoingAudioCallInConversation: (conversationId: string) => void;
  onOutgoingVideoCallInConversation: (conversationId: string) => void;
  peekNotConnectedGroupCall: (
    options: PeekNotConnectedGroupCallType
  ) => void;
  preferredLeftPaneWidth: number;
=======
  activeCall?: ActiveCallStateType
  allConversations: readonly ConversationType[]
  otherTabsUnreadStats: UnreadStats
  getCallHistoryGroupsCount: (opts: CallHistoryFilterOptions) => Promise<number>
  getCallHistoryGroups: (
    opts: CallHistoryFilterOptions,
    pag: CallHistoryPagination
  ) => Promise<CallHistoryGroup[]>
  callHistoryEdition: number
  getAdhocCall: (roomId: string) => CallStateType | undefined
  getCall: (id: string) => CallStateType | undefined
  getCallLink: (id: string) => CallLinkType | undefined
  getConversation: (id: string) => ConversationType | void
  hangUpActiveCall: (reason: string) => void
  hasAnyAdminCallLinks: boolean
  hasFailedStorySends: boolean
  hasPendingUpdate: boolean
  i18n: LocalizerType
  navTabsCollapsed: boolean
  onClearCallHistory: () => void
  onMarkCallHistoryRead: (convId: string, callId: string) => void
  onToggleNavTabsCollapse: (collapsed: boolean) => void
  onCreateCallLink: () => void
  onOutgoingAudioCallInConversation: (convId: string) => void
  onOutgoingVideoCallInConversation: (convId: string) => void
  peekNotConnectedGroupCall: (opts: PeekNotConnectedGroupCallType) => void
  preferredLeftPaneWidth: number
>>>>>>> 5d9dcc506 (Message)
  renderCallLinkDetails: (
    roomId: string,
    group: CallHistoryGroup,
>>>>>>> 48e9ad314 (bootstrap)
    onClose: () => void
  ) => JSX.Element
  renderConversationDetails: (
<<<<<<< HEAD
    conversationId: string,
<<<<<<< HEAD
    callHistoryGroup: CallHistoryGroup | null
  ) => JSX.Element;
  renderToastManager: (_: {
    containerWidthBreakpoint: WidthBreakpoint;
  }) => JSX.Element;
  regionCode: string | undefined;
  savePreferredLeftPaneWidth: (preferredLeftPaneWidth: number) => void;
  startCallLinkLobbyByRoomId: (options: { roomId: string }) => void;
  toggleConfirmLeaveCallModal: (options: StartCallData | null) => void;
=======
    group: CallHistoryGroup | null
  ) => JSX.Element;
  renderToastManager: (opts: {
    containerWidthBreakpoint: WidthBreakpoint;
  }) => JSX.Element;
  regionCode: string | undefined;
  savePreferredLeftPaneWidth: (width: number) => void;
  startCallLinkLobbyByRoomId: (opts: { roomId: string }) => void;
  toggleConfirmLeaveCallModal: (opts: StartCallData | null) => void;
>>>>>>> 48e9ad314 (bootstrap)
  togglePip: () => void;
}>;
=======
    convId: string,
    group: CallHistoryGroup | null
  ) => JSX.Element
  renderToastManager: (opts: { containerWidthBreakpoint: WidthBreakpoint }) => JSX.Element
  regionCode?: string
  savePreferredLeftPaneWidth: (width: number) => void
  startCallLinkLobbyByRoomId: (opts: { roomId: string }) => void
  toggleConfirmLeaveCallModal: (opts: StartCallData | null) => void
  togglePip: () => void
}>
>>>>>>> 5d9dcc506 (Message)

export type FilterTabSelectedView =
<<<<<<< HEAD
  | {
      type: 'conversation';
      conversationId: string;
      callHistoryGroup: CallHistoryGroup | null;
    }
  | {
      type: 'callLink';
      roomId: string;
      callHistoryGroup: CallHistoryGroup;
    };
=======
  | { type: 'conversation'; conversationId: string; callHistoryGroup: CallHistoryGroup | null }
<<<<<<< HEAD
  | { type: 'callLink'; roomId: string; callHistoryGroup: CallHistoryGroup };
>>>>>>> 48e9ad314 (bootstrap)
=======
  | { type: 'callLink'; roomId: string; callHistoryGroup: CallHistoryGroup }
  | null
>>>>>>> 5d9dcc506 (Message)

export function FilterTab({
  activeCall,
  allConversations,
  otherTabsUnreadStats,
  getCallHistoryGroupsCount,
  getCallHistoryGroups,
  callHistoryEdition,
  getAdhocCall,
  getCall,
  getCallLink,
  getConversation,
  hangUpActiveCall,
  hasAnyAdminCallLinks,
  hasFailedStorySends,
  hasPendingUpdate,
  i18n,
  navTabsCollapsed,
  onClearCallHistory,
  onMarkCallHistoryRead,
  onToggleNavTabsCollapse,
  onCreateCallLink,
  onOutgoingAudioCallInConversation,
  onOutgoingVideoCallInConversation,
  peekNotConnectedGroupCall,
  preferredLeftPaneWidth,
  renderCallLinkDetails,
  renderConversationDetails,
  renderToastManager,
  regionCode,
  savePreferredLeftPaneWidth,
  startCallLinkLobbyByRoomId,
  toggleConfirmLeaveCallModal,
  togglePip,
}: FilterTabProps): JSX.Element {
<<<<<<< HEAD
<<<<<<< HEAD
  const [sidebarView, setSidebarView] = useState(
    FilterTabSidebarView. View
  );
  const [selectedView, setSelectedViewInner] =
    useState<FilterTabSelectedView | null>(null);
  const [selectedViewKey, setSelectedViewKey] = useState(() => 1);

  const [
    confirmClearCallHistoryDialogOpen,
    setConfirmClearCallHistoryDialogOpen,
  ] = useState(false);

  const updateSelectedView = useCallback(
    (nextSelected: FilterTabSelectedView | null) => {
      setSelectedViewInner(nextSelected);
      setSelectedViewKey(key => key + 1);
=======
  const [sidebarView, setSidebarView] = useState(FilterTabSidebarView.View);
  const [selectedView, setSelectedViewInner] = useState<FilterTabSelectedView | null>(null);
  const [selectedViewKey, setSelectedViewKey] = useState(() => 1);
  const [confirmClearCallHistoryDialogOpen, setConfirmClearCallHistoryDialogOpen] = useState(false);

  const updateSelectedView = useCallback(
    (next: FilterTabSelectedView | null) => {
      setSelectedViewInner(next);
      setSelectedViewKey((k) => k + 1);
>>>>>>> 48e9ad314 (bootstrap)
    },
    []
=======
  const [sidebarView, setSidebarView] = useState(FilterTabSidebarView.View)
  const [selectedView, setSelectedView] = useState<FilterTabSelectedView>(null)
  const [selectedViewKey, setSelectedViewKey] = useState(0)
  const [confirmClearCallHistoryDialogOpen, setConfirmClearCallHistoryDialogOpen] =
    useState(false)

  const updateSelectedView = useCallback((next: FilterTabSelectedView) => {
    setSelectedView(next)
    setSelectedViewKey(k => k + 1)
  }, [])

  const i18nString = useCallback(
    (key: string) => i18n(key as any, {}), 
    [i18n],
>>>>>>> 5d9dcc506 (Message)
  );

  const updateSidebarView = useCallback(
<<<<<<< HEAD
    (newSidebarView: FilterTabSidebarView) => {
      setSidebarView(newSidebarView);
=======
    (view: FilterTabSidebarView) => {
<<<<<<< HEAD
      setSidebarView(view);
>>>>>>> 48e9ad314 (bootstrap)
      updateSelectedView(null);
=======
      setSidebarView(view)
      updateSelectedView(null)
>>>>>>> 5d9dcc506 (Message)
    },
    [updateSelectedView]
  )

<<<<<<< HEAD
<<<<<<< HEAD
  const onCloseSelectedView = useCallback(() => {
    updateSelectedView(null);
  }, [updateSelectedView]);

  useEscapeHandling(
    sidebarView === FilterTabSidebarView.NewCallView
      ? () => {
          updateSidebarView(FilterTabSidebarView. View);
        }
      : undefined
  );

  const handleOpenClearCallHistoryDialog = useCallback(() => {
    setConfirmClearCallHistoryDialogOpen(true);
  }, []);

  const handleCloseClearCallHistoryDialog = useCallback(() => {
    setConfirmClearCallHistoryDialogOpen(false);
  }, []);

  const handleOutgoingAudioCallInConversation = useCallback(
    (conversationId: string) => {
      onOutgoingAudioCallInConversation(conversationId);
      updateSidebarView(FilterTabSidebarView. View);
    },
    [updateSidebarView, onOutgoingAudioCallInConversation]
  );

  const handleOutgoingVideoCallInConversation = useCallback(
    (conversationId: string) => {
      onOutgoingVideoCallInConversation(conversationId);
      updateSidebarView(FilterTabSidebarView. View);
    },
    [updateSidebarView, onOutgoingVideoCallInConversation]
=======
  const onCloseSelectedView = useCallback(() => updateSelectedView(null), [updateSelectedView]);
=======
  const handleOpenClearCallHistoryDialog = useCallback(() => {
    setConfirmClearCallHistoryDialogOpen(true)
  }, [])
  const handleCloseClearCallHistoryDialog = useCallback(() => {
    setConfirmClearCallHistoryDialogOpen(false)
  }, [])
>>>>>>> 5d9dcc506 (Message)

  useEscapeHandling(
    sidebarView === FilterTabSidebarView.NewCallView
      ? () => updateSidebarView(FilterTabSidebarView.View)
      : undefined
<<<<<<< HEAD
  );

  const handleOpenClearCallHistoryDialog = useCallback(
    () => setConfirmClearCallHistoryDialogOpen(true),
    []
  );
  const handleCloseClearCallHistoryDialog = useCallback(
    () => setConfirmClearCallHistoryDialogOpen(false),
    []
  );

  const handleOutgoingAudioCall = useCallback(
    (cid: string) => {
      onOutgoingAudioCallInConversation(cid);
      updateSidebarView(FilterTabSidebarView.View);
    },
    [onOutgoingAudioCallInConversation, updateSidebarView]
  );

  const handleOutgoingVideoCall = useCallback(
    (cid: string) => {
      onOutgoingVideoCallInConversation(cid);
      updateSidebarView(FilterTabSidebarView.View);
    },
    [onOutgoingVideoCallInConversation, updateSidebarView]
>>>>>>> 48e9ad314 (bootstrap)
  );

  useEffect(() => {
    if (selectedView?.type === 'conversation') {
<<<<<<< HEAD
      selectedView.callHistoryGroup?.children.forEach(child => {
        onMarkCallHistoryRead(selectedView.conversationId, child.callId);
      });
=======
      selectedView.callHistoryGroup?.children.forEach((c) =>
        onMarkCallHistoryRead(selectedView.conversationId, c.callId)
      );
>>>>>>> 48e9ad314 (bootstrap)
=======
  )

  useEffect(() => {
    if (selectedView?.type === 'conversation') {
      selectedView.callHistoryGroup?.children.forEach(c =>
        onMarkCallHistoryRead(selectedView.conversationId, c.callId)
      )
>>>>>>> 5d9dcc506 (Message)
    }
  }, [selectedView, onMarkCallHistoryRead])

  return (
    <>
      <div className="FilterTab">
      <NavSidebar
          i18n={i18n}
          title={
<<<<<<< HEAD
            sidebarView === FilterTabSidebarView. View
              ? i18n('icu:FilterTab__HeaderTitle')
=======
            sidebarView === FilterTabSidebarView.View
              ? i18n('icu:FilterTab__HeaderTitle' as any, {})
              : ''
>>>>>>> 48e9ad314 (bootstrap)
          }
          otherTabsUnreadStats={otherTabsUnreadStats}
          hasFailedStorySends={hasFailedStorySends}
          hasPendingUpdate={hasPendingUpdate}
          navTabsCollapsed={navTabsCollapsed}
          onBack={
            sidebarView === FilterTabSidebarView.NewCallView
<<<<<<< HEAD
              ? () => {
                  updateSidebarView(FilterTabSidebarView. View);
                }
=======
              ? () => updateSidebarView(FilterTabSidebarView.View)
<<<<<<< HEAD
>>>>>>> 48e9ad314 (bootstrap)
              : null
=======
              : undefined
>>>>>>> 5d9dcc506 (Message)
          }
          onToggleNavTabsCollapse={onToggleNavTabsCollapse}
          requiresFullWidth
          preferredLeftPaneWidth={preferredLeftPaneWidth}
          savePreferredLeftPaneWidth={savePreferredLeftPaneWidth}
          renderToastManager={renderToastManager}
          actions={
<<<<<<< HEAD
            <>
              {sidebarView === FilterTabSidebarView. View && (
                <>
                  <NavSidebarActionButton
                    icon={<span className="FilterTab__NewCallActionIcon" />}
                    label={i18n('icu:FilterTab__NewCallActionLabel')}
                    onClick={() => {
                      updateSidebarView(FilterTabSidebarView.NewCallView);
                    }}
                  />
                  <ContextMenu
                    i18n={i18n}
                    menuOptions={[
                      {
                        icon: 'FilterTab__ClearCallHistoryIcon',
                        label: i18n('icu:FilterTab__ClearCallHistoryLabel'),
                        onClick: handleOpenClearCallHistoryDialog,
                      },
                    ]}
                    popperOptions={{
                      placement: 'bottom',
                      strategy: 'absolute',
                    }}
                    portalToRoot
                  >
                    {({ onClick, onKeyDown, ref }) => {
                      return (
                        <NavSidebarActionButton
                          ref={ref}
                          onClick={onClick}
                          onKeyDown={onKeyDown}
                          icon={<span className="FilterTab__MoreActionsIcon" />}
                          label={i18n('icu:FilterTab__MoreActionsLabel')}
                        />
                      );
                    }}
                  </ContextMenu>
                </>
              )}
            </>
          }
        >
          {sidebarView === FilterTabSidebarView. View && (
            < 
              key={FilterTabSidebarView. View}
=======
            sidebarView === FilterTabSidebarView.View && (
              <>
                <NavSidebarActionButton
                  icon={<span className="FilterTab__NewCallActionIcon" />}
                  label={i18n('icu:FilterTab__NewCallActionLabel' as any, {})}
                  onClick={() => updateSidebarView(FilterTabSidebarView.NewCallView)}
                />
                <ContextMenu
                  i18n={i18n}
                  menuOptions={[
                    {
                      icon: 'FilterTab__ClearCallHistoryIcon',
                      label: i18n('icu:FilterTab__ClearCallHistoryLabel' as any, {}),
                      onClick: handleOpenClearCallHistoryDialog,
                    },
                  ]}
                  popperOptions={{ placement: 'bottom', strategy: 'absolute' }}
                  portalToRoot
                >
                  {({ onClick, onKeyDown, ref }) => (
                    <NavSidebarActionButton
                      ref={ref}
                      onClick={onClick}
                      onKeyDown={onKeyDown}
                      icon={<span className="FilterTab__MoreActionsIcon" />}
                      label={i18n('icu:FilterTab__MoreActionsLabel' as any, {})}
                    />
                  )}
                </ContextMenu>
              </>
            )
          }
        >
          {sidebarView === FilterTabSidebarView.View ? (
            <FilterTabView
<<<<<<< HEAD
              key={FilterTabSidebarView.View}
>>>>>>> 48e9ad314 (bootstrap)
=======
>>>>>>> 5d9dcc506 (Message)
              activeCall={activeCall}
              getCallHistoryGroupsCount={getCallHistoryGroupsCount}
              getCallHistoryGroups={getCallHistoryGroups}
              callHistoryEdition={callHistoryEdition}
              getAdhocCall={getAdhocCall}
              getCall={getCall}
              getCallLink={getCallLink}
              getConversation={getConversation}
              hangUpActiveCall={hangUpActiveCall}
              i18n={i18nString}
              selectedCallHistoryGroup={selectedView?.callHistoryGroup || null}
              onChangeFilterTabSelectedView={updateSelectedView}
              onCreateCallLink={onCreateCallLink}
<<<<<<< HEAD
<<<<<<< HEAD
              onOutgoingAudioCallInConversation={
                handleOutgoingAudioCallInConversation
              }
              onOutgoingVideoCallInConversation={
                handleOutgoingVideoCallInConversation
              }
=======
              onOutgoingAudioCallInConversation={handleOutgoingAudioCall}
              onOutgoingVideoCallInConversation={handleOutgoingVideoCall}
>>>>>>> 48e9ad314 (bootstrap)
=======
              onOutgoingAudioCallInConversation={onOutgoingAudioCallInConversation}
              onOutgoingVideoCallInConversation={onOutgoingVideoCallInConversation}
>>>>>>> 5d9dcc506 (Message)
              peekNotConnectedGroupCall={peekNotConnectedGroupCall}
              startCallLinkLobbyByRoomId={startCallLinkLobbyByRoomId}
              toggleConfirmLeaveCallModal={toggleConfirmLeaveCallModal}
              togglePip={togglePip}
            />
          ) : (
            <CallsNewCall
<<<<<<< HEAD
              key={FilterTabSidebarView.NewCallView}
<<<<<<< HEAD
              hasActiveCall={activeCall != null}
              allConversations={allConversations}
              i18n={i18n}
              regionCode={regionCode}
              onChangeFilterTabSelectedView={updateSelectedView}
              onOutgoingAudioCallInConversation={
                handleOutgoingAudioCallInConversation
              }
              onOutgoingVideoCallInConversation={
                handleOutgoingVideoCallInConversation
              }
            />
          )}
        </NavSidebar>
        {selectedView == null ? (
=======
=======
>>>>>>> 5d9dcc506 (Message)
              hasActiveCall={!!activeCall}
              allConversations={allConversations}
              i18n={i18n}
              regionCode={regionCode}
              onChangeCallsTabSelectedView={updateSelectedView}
              onOutgoingAudioCallInConversation={onOutgoingAudioCallInConversation}
              onOutgoingVideoCallInConversation={onOutgoingVideoCallInConversation}
            />
          )}
        </NavSidebar>

        {selectedView === null ? (
>>>>>>> 48e9ad314 (bootstrap)
          <div className="FilterTab__EmptyState">
            <div className="FilterTab__EmptyStateIcon" />
            <p className="FilterTab__EmptyStateLabel">
              <I18n
                i18n={i18n}
<<<<<<< HEAD
                id="icu:FilterTab__EmptyStateText--with-icon-2"
<<<<<<< HEAD
                components={{
                  // eslint-disable-next-line react/no-unstable-nested-components
                  newCallButtonIcon: () => {
                    return (
                      <span
                        className="FilterTab__EmptyState__ActionIcon"
                        aria-label={i18n('icu:FilterTab__NewCallActionLabel')}
                      />
                    );
                  },
                }}
=======
                components={{ newCallButtonIcon: () => <span className="FilterTab__EmptyState__ActionIcon" aria-label={i18n('icu:FilterTab__NewCallActionLabel')} />} }
>>>>>>> 48e9ad314 (bootstrap)
=======
                id={'icu:FilterTab__EmptyStateText--with-icon-2' as any}
                components={{
                  newCallButtonIcon: () => (
                    <span
                      className="FilterTab__EmptyState__ActionIcon"
                      aria-label={i18n('icu:FilterTab__NewCallActionLabel' as any, {})}
                    />
                  ),
                }}
>>>>>>> 5d9dcc506 (Message)
              />
            </p>
          </div>
        ) : (
<<<<<<< HEAD
          <div
            className="FilterTab__ConversationCallDetails"
            // Force scrolling to top when selection changes
            key={selectedViewKey}
          >
            {selectedView.type === 'conversation' &&
              renderConversationDetails(
                selectedView.conversationId,
                selectedView.callHistoryGroup
              )}
            {selectedView.type === 'callLink' &&
              renderCallLinkDetails(
                selectedView.roomId,
                selectedView.callHistoryGroup,
                onCloseSelectedView
              )}
          </div>
        )}
      </div>
=======
          <div className="FilterTab__ConversationCallDetails" key={selectedViewKey}>
            {selectedView.type === 'conversation'
              ? renderConversationDetails(selectedView.conversationId, selectedView.callHistoryGroup)
              : renderCallLinkDetails(
                  selectedView.roomId,
                  selectedView.callHistoryGroup,
                  () => updateSelectedView(null)
                )}
          </div>
        )}
      </div>

<<<<<<< HEAD
>>>>>>> 48e9ad314 (bootstrap)
      {confirmClearCallHistoryDialogOpen && (
        <ConfirmationDialog
          dialogName="FilterTab__ConfirmClearCallHistory"
          i18n={i18n}
          onClose={handleCloseClearCallHistoryDialog}
          title={i18n('icu:FilterTab__ConfirmClearCallHistory__Title')}
<<<<<<< HEAD
          actions={[
            {
              style: 'negative',
              text: i18n(
                'icu:FilterTab__ConfirmClearCallHistory__ConfirmButton'
              ),
              action: onClearCallHistory,
            },
          ]}
=======
          actions={[{
            style: 'negative',
            text: i18n('icu:FilterTab__ConfirmClearCallHistory__ConfirmButton'),
            action: onClearCallHistory
          }]}
>>>>>>> 48e9ad314 (bootstrap)
        >
          {hasAnyAdminCallLinks
            ? i18n('icu:FilterTab__ConfirmClearCallHistory__Body--call-links')
            : i18n('icu:FilterTab__ConfirmClearCallHistory__Body')}
        </ConfirmationDialog>
      )}
    </>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 48e9ad314 (bootstrap)
=======
      <ConfirmationDialog
        dialogName="FilterTab__ConfirmClearCallHistory"
        i18n={i18n}
        title={i18n('icu:FilterTab__ConfirmClearCallHistory__Title' as any, {})}
        onClose={handleCloseClearCallHistoryDialog}
        actions={[
          {
            style: 'negative',
            text: i18n('icu:FilterTab__ConfirmClearCallHistory__ConfirmButton' as any, {}),
            action: onClearCallHistory,
          },
        ]}
      >
        {hasAnyAdminCallLinks
          ? i18n('icu:FilterTab__ConfirmClearCallHistory__Body--call-links' as any, {})
          : i18n('icu:FilterTab__ConfirmClearCallHistory__Body' as any, {})}
      </ConfirmationDialog>
    </>
  )
}
>>>>>>> 5d9dcc506 (Message)
