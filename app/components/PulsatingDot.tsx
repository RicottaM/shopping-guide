import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);


interface PulsatingDotProps {
  position: number;
  maxPosition: number;
}

const PulsatingDot: React.FC<PulsatingDotProps> = ({ position, maxPosition }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  const getYPosition = () => {
    const startY = 50;
    const progress = (position - 1) / (maxPosition - 1);
    return startY + (progress * 400);
  };

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      ])
    ).start();
  }, []);

  const yPos = getYPosition();

  const createCirclePath = (cx: number, cy: number, r: number) => {
    return [
      `M ${cx} ${cy - r}`,
      `A ${r} ${r} 0 0 1 ${cx + r} ${cy}`,
      `A ${r} ${r} 0 0 1 ${cx} ${cy + r}`,
      `A ${r} ${r} 0 0 1 ${cx - r} ${cy}`,
      `A ${r} ${r} 0 0 1 ${cx} ${cy - r}`,
      'Z'
    ].join(' ');
  };

  return (
    <G>
      <Defs>
        <RadialGradient id="dotGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <Stop offset="0%" stopColor="#ff6b6b" stopOpacity="1" />
          <Stop offset="100%" stopColor="#ff4444" stopOpacity="0.8" />
        </RadialGradient>
      </Defs>

      <AnimatedPath
        d={createCirclePath(90, yPos, 15)}
        fill="#ff444433"
        opacity={opacityAnim}
      />
      <AnimatedPath
        d={createCirclePath(90, yPos, 12)}
        fill="#ff444466"
        opacity={opacityAnim}
      />
      <AnimatedPath
        d={createCirclePath(90, yPos, 8)}
        fill="url(#dotGradient)"
        opacity={opacityAnim}
      />
      <Path
        d={createCirclePath(88, yPos - 2, 3)}
        fill="#ffffff55"
      />
    </G>
  );
};

export default PulsatingDot;