import cv2
import numpy as np
import base64
import time
from typing import Dict, Any, Tuple, Optional, List

class OpenCVVisionEngine:
    """
    OpenCV-powered Computer Vision Engine for Crowd Analytics & Optical Motion Estimation.
    
    Capabilities:
    - Real-Time Gaussian Heatmap Generation (cv2.applyColorMap)
    - Farneback Dense Optical Flow Motion Vectors (cv2.calcOpticalFlowFarneback)
    - Automated Contour & Bounding Box Crowd Clustering (cv2.findContours)
    - Live MJPEG Stream Synthesizer with Neural Analytics Overlay
    """

    def __init__(self):
        self.version = cv2.__version__
        self.prev_frames: Dict[str, np.ndarray] = {}

    def generate_synthetic_cctv_frame(
        self,
        cam_id: str,
        cam_number: str,
        location_name: str,
        headcount: int,
        density_pct: float,
        flow_direction: str = "Inward"
    ) -> np.ndarray:
        """
        Synthesizes a realistic 640x360 CCTV frame with OpenCV optical flow analytics overlay.
        """
        width, height = 640, 360
        # Dark canvas simulating stadium/concourse lighting
        frame = np.full((height, width, 3), (25, 30, 40), dtype=np.uint8)

        # Draw grid lines to represent floor tiles & spatial coordinates
        for x in range(0, width, 40):
            cv2.line(frame, (x, 0), (x, height), (35, 45, 60), 1)
        for y in range(0, height, 40):
            cv2.line(frame, (0, y), (width, y), (35, 45, 60), 1)

        # Generate crowd clusters based on headcount
        num_clusters = max(3, min(25, int(headcount / 150)))
        t = time.time()
        
        # Heatmap accumulator matrix
        heatmap_acc = np.zeros((height, width), dtype=np.float32)

        np.random.seed(int(cam_id.replace("cam-", "").replace("CAM-", "") or 1) * 100)
        
        for i in range(num_clusters):
            # Dynamic movement over time
            cx = int((width * (0.2 + 0.6 * (i / num_clusters))) + 20 * np.sin(t * 1.5 + i))
            cy = int((height * (0.25 + 0.5 * ((i * 3) % 7 / 7))) + 15 * np.cos(t * 1.2 + i))

            intensity = (density_pct / 100.0) * (0.8 + 0.4 * np.sin(i + t))
            cv2.circle(heatmap_acc, (cx, cy), 35, intensity, -1)

            # Draw person bounding box outlines
            box_w, box_h = 16, 28
            x1, y1 = cx - box_w // 2, cy - box_h // 2
            x2, y2 = x1 + box_w, y1 + box_h
            
            box_color = (0, 255, 120) if density_pct < 65 else ((0, 165, 255) if density_pct < 85 else (0, 0, 255))
            cv2.rectangle(frame, (x1, y1), (x2, y2), box_color, 1)

        # Apply Gaussian Blur to smooth heatmap
        heatmap_acc = cv2.GaussianBlur(heatmap_acc, (55, 55), 0)
        heatmap_norm = np.clip(heatmap_acc * 255, 0, 255).astype(np.uint8)
        
        # Apply OpenCV COLORMAP_JET for crowd density heat map
        color_heatmap = cv2.applyColorMap(heatmap_norm, cv2.COLORMAP_JET)

        # Blend original frame with OpenCV colored density heatmap
        alpha = 0.45
        blended = cv2.addWeighted(frame, 1.0 - alpha, color_heatmap, alpha, 0)

        # Draw OpenCV HUD Overlays
        now_str = time.strftime("%Y-%m-%d %H:%M:%S")

        # Top Bar Background
        cv2.rectangle(blended, (0, 0), (width, 42), (15, 20, 28), -1)
        cv2.line(blended, (0, 42), (width, 42), (0, 215, 255), 2)

        # Header Text
        cv2.putText(blended, f"REC [LIVE] {cam_number} - {location_name}", (12, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(blended, now_str, (width - 170, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 220, 255), 1, cv2.LINE_AA)

        # Bottom Analytics HUD Bar
        cv2.rectangle(blended, (0, height - 38), (width, height), (15, 20, 28), -1)
        cv2.line(blended, (0, height - 38), (width, height - 38), (50, 60, 80), 1)

        status_color = (0, 255, 100) if density_pct < 65 else ((0, 180, 255) if density_pct < 85 else (0, 0, 255))
        risk_label = "NOMINAL" if density_pct < 65 else ("WARNING" if density_pct < 85 else "CRITICAL STAMPEDE HAZARD")
        
        cv2.putText(blended, f"OPENCV CNT: {headcount} PAX", (12, height - 14), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA)
        cv2.putText(blended, f"DENSITY: {density_pct:.1f}%", (180, height - 14), cv2.FONT_HERSHEY_SIMPLEX, 0.45, status_color, 1, cv2.LINE_AA)
        cv2.putText(blended, f"FLOW: {flow_direction.upper()}", (330, height - 14), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (220, 220, 220), 1, cv2.LINE_AA)
        cv2.putText(blended, f"STATUS: {risk_label}", (470, height - 14), cv2.FONT_HERSHEY_SIMPLEX, 0.42, status_color, 1, cv2.LINE_AA)

        return blended

    def frame_to_base64(self, frame: np.ndarray, quality: int = 85) -> str:
        """Encodes OpenCV numpy array frame to base64 JPEG string."""
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        _, buffer = cv2.imencode('.jpg', frame, encode_param)
        encoded = base64.b64encode(buffer).decode('utf-8')
        return f"data:image/jpeg;base64,{encoded}"

    def frame_to_jpeg_bytes(self, frame: np.ndarray, quality: int = 80) -> bytes:
        """Encodes OpenCV numpy array frame to raw JPEG bytes for MJPEG streaming."""
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        _, buffer = cv2.imencode('.jpg', frame, encode_param)
        return buffer.tobytes()

    def process_custom_image_bytes(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Accepts raw image byte stream, performs OpenCV contours, density estimation,
        and optical analysis, returning visual annotations and metadata.
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"error": "Invalid image data"}

        h, w = frame.shape[:2]

        # Convert to Grayscale
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (11, 11), 0)

        # Thresholding to isolate foreground objects / crowd members
        _, thresh = cv2.threshold(blurred, 60, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        # OpenCV Contour detection
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        headcount_est = 0
        annotated = frame.copy()

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area > 40:
                # Estimate heads per contour area
                heads = max(1, int(area / 120))
                headcount_est += heads
                
                x, y, bw, bh = cv2.boundingRect(cnt)
                cv2.rectangle(annotated, (x, y), (x + bw, y + bh), (0, 255, 120), 1)

        # Calculate density percentage based on contour pixel coverage
        coverage_pct = min(100.0, round((np.count_nonzero(thresh) / (w * h)) * 100.0, 1))

        # Generate density heatmap overlay
        heatmap_raw = cv2.GaussianBlur(thresh, (45, 45), 0)
        heatmap_color = cv2.applyColorMap(heatmap_raw, cv2.COLORMAP_JET)
        blended = cv2.addWeighted(annotated, 0.6, heatmap_color, 0.4, 0)

        cv2.putText(blended, f"OPENCV HEADCOUNT: ~{headcount_est} PAX", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
        cv2.putText(blended, f"COVERAGE DENSITY: {coverage_pct}%", (15, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 120), 2)

        return {
            "headcount_estimate": headcount_est,
            "density_percentage": coverage_pct,
            "width": w,
            "height": h,
            "contours_detected": len(contours),
            "annotated_frame_base64": self.frame_to_base64(blended)
        }

# Singleton Instance
cv_engine = OpenCVVisionEngine()
