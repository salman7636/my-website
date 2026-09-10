export async function startCamera() {
  if (
    !navigator.mediaDevices?.getUserMedia
  ) {
    throw new Error(
      "This browser does not support camera access."
    );
  }

  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: {
        ideal: "environment",
      },
    },
    audio: false,
  });
}

export function stopCamera(stream) {
  stream?.getTracks?.().forEach(
    (track) => track.stop()
  );
}

export function captureFrame(video) {
  if (!video?.videoWidth) {
    throw new Error(
      "Camera is still starting. Please wait."
    );
  }

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width =
    video.videoWidth;

  canvas.height =
    video.videoHeight;

  const context =
    canvas.getContext("2d");

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL(
    "image/jpeg",
    0.85
  );
}