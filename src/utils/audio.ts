export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to start recording. Please check microphone permissions.');
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // 停止所有音频轨道
        if (this.mediaRecorder?.stream) {
          this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;

  // 支持Blob和data URI两种格式
  async playAudio(audioSource: Blob | string): Promise<void> {
    return new Promise((resolve, reject) => {
      let audioUrl: string;
      let shouldRevokeUrl = false;

      if (typeof audioSource === 'string') {
        // 如果是字符串，假设是data URI或URL
        audioUrl = audioSource;
      } else {
        // 如果是Blob，创建Object URL
        audioUrl = URL.createObjectURL(audioSource);
        shouldRevokeUrl = true;
      }

      this.audio = new Audio(audioUrl);

      this.audio.onended = () => {
        if (shouldRevokeUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        resolve();
      };

      this.audio.onerror = (error) => {
        if (shouldRevokeUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        reject(new Error('Failed to play audio'));
      };

      this.audio.play().catch(reject);
    });
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }
} 