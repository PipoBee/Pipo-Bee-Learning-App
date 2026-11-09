import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, useWindowDimensions } from 'react-native';
import { Colors } from '../theme/colors';
import { SoundEffects } from '../services/soundEffects';

export type MascotMood = 'idle' | 'happy' | 'celebrating' | 'hint';

interface MascotProps {
  mood?: MascotMood;
  message?: string;
  onPress?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  message = "Hi! I'm Pip! Let's explore new sounds together!",
  onPress,
}) => {
  const { width } = useWindowDimensions();
  const isWide = width >= 600;

  const bounceAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mood === 'celebrating') {
      Animated.sequence([
        Animated.timing(bounceAnim, { toValue: -14, duration: 160, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: -10, duration: 140, useNativeDriver: true }),
        Animated.timing(bounceAnim, { toValue: 0, duration: 140, useNativeDriver: true }),
      ]).start();
    } else if (mood === 'hint') {
      Animated.sequence([
        Animated.timing(wiggleAnim, { toValue: -6, duration: 90, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: 6, duration: 90, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: -4, duration: 90, useNativeDriver: true }),
        Animated.timing(wiggleAnim, { toValue: 0, duration: 90, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, { toValue: -3, duration: 1200, useNativeDriver: true }),
          Animated.timing(bounceAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [mood]);

  const handleMascotTap = () => {
    SoundEffects.playClick();
    if (message) {
      SoundEffects.speakPhonics(message);
    }
    onPress?.();
  };

  const getMascotAvatar = () => {
    switch (mood) {
      case 'celebrating':
        return '🦜✨';
      case 'happy':
        return '🦜🎉';
      case 'hint':
        return '🦜💡';
      default:
        return '🦜';
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleMascotTap}
        style={[styles.touchable, isWide && styles.touchableWide]}
        accessibilityLabel={`Pip the mascot says: ${message}`}
      >
        <Animated.View
          style={[
            styles.avatarCircle,
            {
              transform: [
                { translateY: bounceAnim },
                {
                  rotate: wiggleAnim.interpolate({
                    inputRange: [-10, 10],
                    outputRange: ['-10deg', '10deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.avatarEmoji}>{getMascotAvatar()}</Text>
        </Animated.View>

        {message ? (
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{message}</Text>
            <View style={styles.bubbleArrow} />
          </View>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 6,
    alignItems: 'center',
    width: '100%',
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '94%',
    maxWidth: 640,
  },
  touchableWide: {
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FEF08A',
    borderWidth: 3,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarEmoji: {
    fontSize: 28,
  },
  bubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textDark,
    lineHeight: 18,
  },
  bubbleArrow: {
    position: 'absolute',
    left: -8,
    top: 18,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderTopColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: '#FFFFFF',
  },
});
