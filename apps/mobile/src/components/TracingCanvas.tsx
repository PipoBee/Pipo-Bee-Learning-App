import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  useWindowDimensions,
} from 'react-native';
import { TracingPathData, StrokeGuide } from '@phonicsquest/shared';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';

interface TracingCanvasProps {
  data: TracingPathData;
  onComplete: (accuracy: number) => void;
}

interface Point {
  x: number;
  y: number;
}

export const TracingCanvas: React.FC<TracingCanvasProps> = ({ data, onComplete }) => {
  const { width, height } = useWindowDimensions();
  const [currentStrokeIdx, setCurrentStrokeIdx] = useState<number>(0);
  const [userPoints, setUserPoints] = useState<Point[]>([]);
  const [completedStrokes, setCompletedStrokes] = useState<Point[][]>([]);
  const [strokeSuccess, setStrokeSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Touch the glowing start dot and trace!');

  // Responsive canvas size that dynamically fits both mobile and desktop viewports
  const canvasDim = Math.max(240, Math.min(320, width - 48, height * 0.36));

  const activeStroke: StrokeGuide | undefined = data.guideStrokes[currentStrokeIdx];
  const totalStrokes = data.guideStrokes.length;

  // Scale factor between SVG viewBox (300x300) and actual rendered layout
  const scale = canvasDim / data.viewBox.width;

  const pointsRef = useRef<Point[]>([]);

  const checkAccuracy = (drawn: Point[], guide: StrokeGuide): number => {
    if (drawn.length < 5) return 0;

    // Checkpoints from guide stroke scaled to screen
    const guidePoints = guide.points.map((p) => ({
      x: p.x * scale,
      y: p.y * scale,
    }));

    // Start point tolerance
    const startGuide = guidePoints[0];
    const startDrawn = drawn[0];
    const startDist = Math.hypot(startDrawn.x - startGuide.x, startDrawn.y - startGuide.y);

    if (startDist > 70) {
      return 20; // Started too far from start point
    }

    // Check how many guide checkpoints were visited within tolerance
    let visitedCount = 0;
    const tolerance = 60;

    for (const gp of guidePoints) {
      const reached = drawn.some((dp) => Math.hypot(dp.x - gp.x, dp.y - gp.y) < tolerance);
      if (reached) {
        visitedCount++;
      }
    }

    const accuracyPercent = Math.round((visitedCount / guidePoints.length) * 100);
    return accuracyPercent;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        pointsRef.current = [{ x: locationX, y: locationY }];
        setUserPoints([{ x: locationX, y: locationY }]);
      },
      onPanResponderMove: (evt: GestureResponderEvent, _gestureState: PanResponderGestureState) => {
        const { locationX, locationY } = evt.nativeEvent;
        const newPoint = { x: locationX, y: locationY };
        pointsRef.current.push(newPoint);
        setUserPoints([...pointsRef.current]);
      },
      onPanResponderRelease: () => {
        if (!activeStroke) return;

        const accuracy = checkAccuracy(pointsRef.current, activeStroke);

        if (accuracy >= 60) {
          SoundEffects.playSuccess();
          setStrokeSuccess(true);
          const finishedStroke = [...pointsRef.current];
          setCompletedStrokes((prev) => [...prev, finishedStroke]);
          setUserPoints([]);
          pointsRef.current = [];

          if (currentStrokeIdx + 1 < totalStrokes) {
            setMessage(`Great job! Now trace stroke ${currentStrokeIdx + 2}!`);
            setTimeout(() => {
              setCurrentStrokeIdx((prev) => prev + 1);
              setStrokeSuccess(false);
            }, 600);
          } else {
            setMessage('🌟 Fantastic tracing! Star earned!');
            SoundEffects.playFanfare();
            setTimeout(() => {
              onComplete(accuracy);
            }, 1000);
          }
        } else {
          SoundEffects.playRetry();
          setMessage('Try again! Follow the glowing dot smoothly!');
          setUserPoints([]);
          pointsRef.current = [];
        }
      },
    })
  ).current;

  const handleReset = () => {
    SoundEffects.playClick();
    setUserPoints([]);
    pointsRef.current = [];
    setCompletedStrokes([]);
    setCurrentStrokeIdx(0);
    setStrokeSuccess(false);
    setMessage('Touch the glowing start dot and trace!');
  };

  const startDot = activeStroke
    ? {
      x: activeStroke.startPoint.x * scale,
      y: activeStroke.startPoint.y * scale,
    }
    : null;

  return (
    <View style={styles.container}>
      {/* Guidance Banner */}
      <View style={[styles.instructionBox, strokeSuccess && styles.instructionSuccess]}>
        <Text style={styles.instructionText}>{message}</Text>
      </View>

      {/* Tracing Canvas Area */}
      <View
        style={[
          styles.canvasContainer,
          {
            width: canvasDim,
            height: canvasDim,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Big Guide Letter Outline */}
        <View style={styles.guideLetterLayer}>
          <Text style={[styles.guideLetterText, { fontSize: canvasDim * 0.72 }]}>
            {data.grapheme}
          </Text>
        </View>

        {/* Completed Strokes */}
        {completedStrokes.map((stroke, sIdx) => (
          <React.Fragment key={`completed-${sIdx}`}>
            {stroke.map((pt, pIdx) => (
              <View
                key={`comp-pt-${sIdx}-${pIdx}`}
                style={[
                  styles.completedPoint,
                  {
                    left: pt.x - 9,
                    top: pt.y - 9,
                  },
                ]}
              />
            ))}
          </React.Fragment>
        ))}

        {/* Current Drawn Stroke Points */}
        {userPoints.map((pt, idx) => (
          <View
            key={`pt-${idx}`}
            style={[
              styles.drawnPoint,
              {
                left: pt.x - 8,
                top: pt.y - 8,
              },
            ]}
          />
        ))}

        {/* Start Point Glowing Indicator */}
        {startDot && (
          <View
            style={[
              styles.startDotGlow,
              {
                left: startDot.x - 20,
                top: startDot.y - 20,
              },
            ]}
          >
            <View style={styles.startDotInner}>
              <Text style={styles.startDotNumber}>{currentStrokeIdx + 1}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.footerRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleReset}>
          <Text style={styles.actionBtnText}>🔄 Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.soundBtn]}
          onPress={() => {
            SoundEffects.speakPhonics(data.phoneme);
          }}
        >
          <Text style={styles.actionBtnText}>🔊 Hear {data.phoneme}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.nextBtn]}
          onPress={() => onComplete(95)}
        >
          <Text style={[styles.actionBtnText, styles.nextBtnText]}>Next ➡️</Text>
        </TouchableOpacity>
      </View>

      {/* Sample Words Pills */}
      <View style={styles.sampleWordsRow}>
        {data.sampleWords.map((word, idx) => (
          <TouchableOpacity
            key={word + idx}
            style={styles.wordPill}
            onPress={() => {
              SoundEffects.playClick();
              SoundEffects.speakPhonics(word);
            }}
          >
            <Text style={styles.wordPillText}>🔊 {word}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  instructionBox: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#BFDBFE',
    marginBottom: 10,
    width: '94%',
    maxWidth: 500,
    alignItems: 'center',
  },
  instructionSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  instructionText: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  canvasContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 3.5,
    borderColor: '#BAE6FD',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
    cursor: 'crosshair' as unknown as undefined,
  },
  guideLetterLayer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.15,
    userSelect: 'none' as unknown as undefined,
  },
  guideLetterText: {
    fontWeight: '900',
    color: '#0369A1',
    textAlign: 'center',
  },
  startDotGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(234, 179, 8, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  startDotInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAB308',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startDotNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  drawnPoint: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0284C7',
  },
  completedPoint: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
    width: '94%',
    maxWidth: 500,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  soundBtn: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  nextBtn: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textDark,
  },
  nextBtnText: {
    color: '#FFFFFF',
  },
  sampleWordsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  wordPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  wordPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});
