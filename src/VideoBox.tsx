import React, { useState } from "react";
import { useEffect, useRef } from "react";

interface VideoBoxProps {
  isLocal: boolean
  userId: string
  stream?: MediaStream
  muted?: boolean
  type: 'camera' | 'display'
  showCamera?: boolean
  audioAnalyser(interval: number, callback: (value: number) => void): void
}

export default function VideoBox(props: VideoBoxProps) {
  const ref = useRef(null);
  const [sound_level, setSoundLevel] = useState<number>(50);

  useEffect(() => {
    if (!props.stream) {
      return;
    }
    (ref.current as any).srcObject = props.stream;
    props.audioAnalyser(50, setSoundLevel);
  }, [props.stream]);

  useEffect(() => {
    props.audioAnalyser(50, setSoundLevel);
  }, [props.muted]);

  return (
    <div style={{ position: 'relative', width: 300, height: 200, border: 'solid 1px #AAA' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, background: '#EEE', border: 'solid 1px #AAA' }}>
        <div>
          { props.muted ? 'Sound Off' : 'Sound On' }
        </div>
        <div>
          { props.showCamera ? 'Camera On' : 'Camera Off' }
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#CCC' }}>
        <div>
          User ID: { props.userId } ({ props.type })
        </div>
        v: { props.stream?.getVideoTracks().length }({ (props.stream?.getVideoTracks() ?? []).map(x => `${x.kind}-${x.label}`).join(', ') }), a: { props.stream?.getAudioTracks().length }
      </div>
      { !props.muted && <div style={{ position: 'absolute', bottom: 0, left: 0, background: '#9C9', width: 12, height: 100 * (sound_level - 128) / 128 }} /> }
      <video
        style={{ width: '100%', height: '100%', background: '#EEE' }}
        ref={ref}
        muted={(props.isLocal ? true : props.muted)}
        autoPlay
        playsInline />
    </div>
  );
}
