import React, { useState } from 'react'
import { UserMediaStream, useVCall, UserRequestJoinResponse } from 'react-vcall'
import VideoBox from './VideoBox';

interface RoomStatus {
  is_joined: boolean
  is_muted: boolean
  is_show_camera: boolean
  is_recording: boolean
  is_share_screen: boolean
}

const my_user_id = `${new Date().getTime()}`;
const App = () => {
  const [room_status, setRoomStatus] = useState<RoomStatus>({
    is_joined: false,
    is_muted: true,
    is_show_camera: false,
    is_recording: false,
    is_share_screen: false
  });
  const { streams, action } = useVCall({
    user_id: my_user_id,
    room: `3f014cb2-e8ca-4589-a0b7-b909d683289e`, // this room should be fetched from API
    name: 'sample-name',
    is_muted: room_status.is_muted,
    is_show_camera: room_status.is_show_camera,
    is_share_screen: room_status.is_share_screen,
  }, {
    onRecordingStarted,
    onRecordingEnded,
    onWaitingRoom,
    onUserRequestToJoinRoom,
    onReady,
    onSharingScreenStarted,
    onSharingScreenEnded
  });

  function onSharingScreenStarted() {
    setRoomStatus({ ...room_status, is_share_screen: true });
  }

  function onSharingScreenEnded() {
    setRoomStatus({ ...room_status, is_share_screen: false });
  }

  function onRecordingStarted() {
    setRoomStatus({ ...room_status, is_recording: true });
  }

  function onRecordingEnded() {
    setRoomStatus({ ...room_status, is_recording: false });
  }
  
  function onUserRequestToJoinRoom(data: UserRequestJoinResponse, accept: () => void, reject: () => void) {
    setTimeout(() => {
      accept();
    }, 3000);
  }

  function onWaitingRoom() {
    // 
  }

  function onReady() {
    // 
  }

  return <div>
    <div> { my_user_id } </div>
    <div>
      <button 
        disabled={room_status.is_share_screen} 
        onClick={() => !room_status.is_share_screen && action.startShareScreen() }>
        Start Share Screen
      </button>
      <button 
        disabled={!room_status.is_share_screen} 
        onClick={() => room_status.is_share_screen && action.stopShareScreen() }>
        Stop Share Screen
      </button>
    </div>
    <div>
      <button 
        disabled={room_status.is_show_camera} 
        onClick={() => {
          !room_status.is_show_camera && action.showCamera();
          setRoomStatus({ ...room_status, is_show_camera: true });
        }}>
        Show Camera
      </button>
      <button 
        disabled={!room_status.is_show_camera} 
        onClick={() => {
          room_status.is_show_camera && action.hideCamera();
          setRoomStatus({ ...room_status, is_show_camera: false });
        }}>
        Hide Camera
      </button>
    </div>
    <div>
      <button 
        onClick={() => {
          room_status.is_muted && action.startMic();
          setRoomStatus({ ...room_status, is_muted: false });
        }}
        disabled={!room_status.is_muted}>
        Start Microphone
      </button>
      <button 
        onClick={() => {
          !room_status.is_muted && action.stopMic();
          setRoomStatus({ ...room_status, is_muted: true });
        }}
        disabled={room_status.is_muted}>
        Stop Microphone
      </button>
    </div>
    <div>
      <button 
        onClick={() => !room_status.is_recording && action.startRecording()}
        disabled={room_status.is_recording}>
        Start Recording
      </button>
      <button 
        onClick={() => room_status.is_recording && action.stopRecording()}
        disabled={!room_status.is_recording}>
        Stop Recording
      </button>
    </div>
    <div>
      {
        streams.map((ums: UserMediaStream, i: number) => (
          <div key={i}>
            <VideoBox 
              isLocal={my_user_id === ums.user_id}
              userId={ums.user_id}
              stream={ums.ms} 
              type={ums.manifest.is_sharing_screen_user ? 'display' : 'camera'}
              muted={ums.manifest.is_muted}
              showCamera={ums.manifest.is_show_camera}
              audioAnalyser={ums.setAudioAnalyser} />
          </div>
        ))
      }
    </div>
  </div>
}

export default App
