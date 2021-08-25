// Copyright 2020-2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import React from 'react';
import classNames from 'classnames';
import {
  SetLocalAudioType,
  SetLocalPreviewType,
  SetLocalVideoType,
} from '../state/ducks/calling';
import { CallingButton, CallingButtonType } from './CallingButton';
import { TooltipPlacement } from './Tooltip';
import { CallBackgroundBlur } from './CallBackgroundBlur';
import { CallingHeader } from './CallingHeader';
import { CallingPreCallInfo, RingMode } from './CallingPreCallInfo';
import {
  CallingLobbyJoinButton,
  CallingLobbyJoinButtonVariant,
} from './CallingLobbyJoinButton';
import { AvatarColorType } from '../types/Colors';
import { LocalizerType } from '../types/Util';
import { ConversationType } from '../state/ducks/conversations';

export type PropsType = {
  availableCameras: Array<MediaDeviceInfo>;
  conversation: Pick<
    ConversationType,
    | 'acceptedMessageRequest'
    | 'avatarPath'
    | 'color'
    | 'isMe'
    | 'name'
    | 'phoneNumber'
    | 'profileName'
    | 'sharedGroupNames'
    | 'title'
    | 'type'
    | 'unblurredAvatarPath'
  >;
  groupMembers?: Array<Pick<ConversationType, 'id' | 'firstName' | 'title'>>;
  hasLocalAudio: boolean;
  hasLocalVideo: boolean;
  i18n: LocalizerType;
  isGroupCall: boolean;
  isGroupCallOutboundRingEnabled: boolean;
  isCallFull?: boolean;
  maxGroupCallRingSize: number;
  me: {
    avatarPath?: string;
    id: string;
    color?: AvatarColorType;
    uuid: string;
  };
  onCallCanceled: () => void;
  onJoinCall: () => void;
  outgoingRing: boolean;
  peekedParticipants: Array<ConversationType>;
  setLocalAudio: (_: SetLocalAudioType) => void;
  setLocalVideo: (_: SetLocalVideoType) => void;
  setLocalPreview: (_: SetLocalPreviewType) => void;
  setOutgoingRing: (_: boolean) => void;
  showParticipantsList: boolean;
  toggleParticipants: () => void;
  toggleSettings: () => void;
};

export const CallingLobby = ({
  availableCameras,
  conversation,
  groupMembers,
  hasLocalAudio,
  hasLocalVideo,
  i18n,
  isGroupCall = false,
  isGroupCallOutboundRingEnabled,
  isCallFull = false,
  maxGroupCallRingSize,
  me,
  onCallCanceled,
  onJoinCall,
  peekedParticipants,
  setLocalAudio,
  setLocalPreview,
  setLocalVideo,
  setOutgoingRing,
  showParticipantsList,
  toggleParticipants,
  toggleSettings,
  outgoingRing,
}: PropsType): JSX.Element => {
  const localVideoRef = React.useRef<null | HTMLVideoElement>(null);

  const shouldShowLocalVideo = hasLocalVideo && availableCameras.length > 0;

  const toggleAudio = React.useCallback((): void => {
    setLocalAudio({ enabled: !hasLocalAudio });
  }, [hasLocalAudio, setLocalAudio]);

  const toggleVideo = React.useCallback((): void => {
    setLocalVideo({ enabled: !hasLocalVideo });
  }, [hasLocalVideo, setLocalVideo]);

  const toggleOutgoingRing = React.useCallback((): void => {
    setOutgoingRing(!outgoingRing);
  }, [outgoingRing, setOutgoingRing]);

  React.useEffect(() => {
    setLocalPreview({ element: localVideoRef });

    return () => {
      setLocalPreview({ element: undefined });
    };
  }, [setLocalPreview]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      let eventHandled = false;

      if (event.shiftKey && (event.key === 'V' || event.key === 'v')) {
        toggleVideo();
        eventHandled = true;
      } else if (event.shiftKey && (event.key === 'M' || event.key === 'm')) {
        toggleAudio();
        eventHandled = true;
      }

      if (eventHandled) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleVideo, toggleAudio]);

  const [isCallConnecting, setIsCallConnecting] = React.useState(false);

  // eslint-disable-next-line no-nested-ternary
  const videoButtonType = hasLocalVideo
    ? CallingButtonType.VIDEO_ON
    : availableCameras.length === 0
    ? CallingButtonType.VIDEO_DISABLED
    : CallingButtonType.VIDEO_OFF;

  const audioButtonType = hasLocalAudio
    ? CallingButtonType.AUDIO_ON
    : CallingButtonType.AUDIO_OFF;

  const isRingButtonVisible: boolean =
    isGroupCall &&
    isGroupCallOutboundRingEnabled &&
    peekedParticipants.length === 0 &&
    (groupMembers || []).length > 1;

  const preCallInfoRingMode: RingMode =
    isGroupCall && !outgoingRing ? RingMode.WillNotRing : RingMode.WillRing;

  let ringButtonType:
    | CallingButtonType.RING_DISABLED
    | CallingButtonType.RING_ON
    | CallingButtonType.RING_OFF;
  if (isRingButtonVisible) {
    if ((groupMembers || []).length > maxGroupCallRingSize) {
      ringButtonType = CallingButtonType.RING_DISABLED;
    } else if (outgoingRing) {
      ringButtonType = CallingButtonType.RING_ON;
    } else {
      ringButtonType = CallingButtonType.RING_OFF;
    }
  } else {
    ringButtonType = CallingButtonType.RING_DISABLED;
  }

  const canJoin = !isCallFull && !isCallConnecting;

  let callingLobbyJoinButtonVariant: CallingLobbyJoinButtonVariant;
  if (isCallFull) {
    callingLobbyJoinButtonVariant = CallingLobbyJoinButtonVariant.CallIsFull;
  } else if (isCallConnecting) {
    callingLobbyJoinButtonVariant = CallingLobbyJoinButtonVariant.Loading;
  } else if (peekedParticipants.length) {
    callingLobbyJoinButtonVariant = CallingLobbyJoinButtonVariant.Join;
  } else {
    callingLobbyJoinButtonVariant = CallingLobbyJoinButtonVariant.Start;
  }

  return (
    <div className="module-calling__container">
      {shouldShowLocalVideo ? (
        <video
          className="module-CallingLobby__local-preview module-CallingLobby__local-preview--camera-is-on"
          ref={localVideoRef}
          autoPlay
        />
      ) : (
        <CallBackgroundBlur
          className="module-CallingLobby__local-preview module-CallingLobby__local-preview--camera-is-off"
          avatarPath={me.avatarPath}
          color={me.color}
        />
      )}

      <CallingHeader
        i18n={i18n}
        isGroupCall={isGroupCall}
        participantCount={peekedParticipants.length}
        showParticipantsList={showParticipantsList}
        toggleParticipants={toggleParticipants}
        toggleSettings={toggleSettings}
        onCancel={onCallCanceled}
      />

      <CallingPreCallInfo
        conversation={conversation}
        groupMembers={groupMembers}
        i18n={i18n}
        isCallFull={isCallFull}
        me={me}
        peekedParticipants={peekedParticipants}
        ringMode={preCallInfoRingMode}
      />

      <div
        className={classNames(
          'module-CallingLobby__camera-is-off',
          `module-CallingLobby__camera-is-off--${
            shouldShowLocalVideo ? 'invisible' : 'visible'
          }`
        )}
      >
        {i18n('calling__your-video-is-off')}
      </div>

      <div className="module-calling__buttons module-calling__buttons--inline">
        <CallingButton
          buttonType={videoButtonType}
          i18n={i18n}
          onClick={toggleVideo}
          tooltipDirection={TooltipPlacement.Top}
        />
        <CallingButton
          buttonType={audioButtonType}
          i18n={i18n}
          onClick={toggleAudio}
          tooltipDirection={TooltipPlacement.Top}
        />
        <CallingButton
          buttonType={ringButtonType}
          i18n={i18n}
          isVisible={isRingButtonVisible}
          onClick={toggleOutgoingRing}
          tooltipDirection={TooltipPlacement.Top}
        />
      </div>

      <CallingLobbyJoinButton
        disabled={!canJoin}
        i18n={i18n}
        onClick={() => {
          setIsCallConnecting(true);
          onJoinCall();
        }}
        variant={callingLobbyJoinButtonVariant}
      />
    </div>
  );
};
