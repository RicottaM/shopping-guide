import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';

// Kolory z palety
// Kolory z palety
const COLORS = {
  background: '#E8FEFD',
  aisle: '#355D5E',
  visitedAisle: '#2E9313',
  entrance: '#A0CBB3',
  exit: '#A0CBB3',
  checkout: '#A0CBB3',
  text: '#000000',
};

// Pozycje sekcji w sklepie - rzut z góry
const SECTIONS: { [key: string]: { x: number; y: number; width: number; height: number; label: string } } = {
  A1: { x: 50, y: 50, width: 40, height: 40, label: 'A1' },
  A2: { x: 100, y: 50, width: 40, height: 40, label: 'A2' },
  A3: { x: 150, y: 50, width: 40, height: 40, label: 'A3' },
  A4: { x: 200, y: 50, width: 40, height: 40, label: 'A4' },
  A5: { x: 250, y: 50, width: 40, height: 40, label: 'A5' },
  A6: { x: 300, y: 50, width: 40, height: 40, label: 'A6' },
  A7: { x: 350, y: 50, width: 40, height: 40, label: 'A7' },
  A8: { x: 400, y: 50, width: 40, height: 40, label: 'A8' },
  A9: { x: 50, y: 100, width: 40, height: 40, label: 'A9' },
  A10: { x: 100, y: 100, width: 40, height: 40, label: 'A10' },
  A11: { x: 150, y: 100, width: 40, height: 40, label: 'A11' },
  A12: { x: 200, y: 100, width: 40, height: 40, label: 'A12' },
  A13: { x: 250, y: 100, width: 40, height: 40, label: 'A13' },
  A14: { x: 300, y: 100, width: 40, height: 40, label: 'A14' },
  A15: { x: 350, y: 100, width: 40, height: 40, label: 'A15' },
  A16: { x: 400, y: 100, width: 40, height: 40, label: 'A16' },
  A17: { x: 50, y: 150, width: 40, height: 40, label: 'A17' },
  A18: { x: 100, y: 150, width: 40, height: 40, label: 'A18' },
  A19: { x: 150, y: 150, width: 40, height: 40, label: 'A19' },
  A20: { x: 200, y: 150, width: 40, height: 40, label: 'A20' },
  A21: { x: 250, y: 150, width: 40, height: 40, label: 'A21' },
  A22: { x: 300, y: 150, width: 40, height: 40, label: 'A22' },
  A23: { x: 350, y: 150, width: 40, height: 40, label: 'A23' },
  A24: { x: 400, y: 150, width: 40, height: 40, label: 'A24' },
  A25: { x: 50, y: 200, width: 40, height: 40, label: 'A25' },
  A26: { x: 100, y: 200, width: 40, height: 40, label: 'A26' },
  A27: { x: 150, y: 200, width: 40, height: 40, label: 'A27' },
  A28: { x: 200, y: 200, width: 40, height: 40, label: 'A28' },
  A29: { x: 250, y: 200, width: 40, height: 40, label: 'A29' },
  A30: { x: 300, y: 200, width: 40, height: 40, label: 'A30' },
  A31: { x: 350, y: 200, width: 40, height: 40, label: 'A31' },
  A32: { x: 400, y: 200, width: 40, height: 40, label: 'A32' },
};

// Połączenia między sekcjami z wagami (przykład)
const EDGES = [
  { start: 'A1', end: 'A2', weight: 1 },
  { start: 'A2', end: 'A3', weight: 1 },
  { start: 'A3', end: 'A4', weight: 1 },
  { start: 'A4', end: 'A5', weight: 1 },
  { start: 'A5', end: 'A6', weight: 1 },
  { start: 'A6', end: 'A7', weight: 1 },
  { start: 'A7', end: 'A8', weight: 1 },
  { start: 'A1', end: 'A9', weight: 1 },
  { start: 'A9', end: 'A17', weight: 1 },
  { start: 'A17', end: 'A25', weight: 1 },
  { start: 'A2', end: 'A10', weight: 1 },
  { start: 'A10', end: 'A18', weight: 1 },
  { start: 'A18', end: 'A26', weight: 1 },
  { start: 'A3', end: 'A11', weight: 1 },
  { start: 'A11', end: 'A19', weight: 1 },
  { start: 'A19', end: 'A27', weight: 1 },
  { start: 'A4', end: 'A12', weight: 1 },
  { start: 'A12', end: 'A20', weight: 1 },
  { start: 'A20', end: 'A28', weight: 1 },
  { start: 'A5', end: 'A13', weight: 1 },
  { start: 'A13', end: 'A21', weight: 1 },
  { start: 'A21', end: 'A29', weight: 1 },
  { start: 'A6', end: 'A14', weight: 1 },
  { start: 'A14', end: 'A22', weight: 1 },
  { start: 'A22', end: 'A30', weight: 1 },
  { start: 'A7', end: 'A15', weight: 1 },
  { start: 'A15', end: 'A23', weight: 1 },
  { start: 'A23', end: 'A31', weight: 1 },
  { start: 'A8', end: 'A16', weight: 1 },
  { start: 'A16', end: 'A24', weight: 1 },
  { start: 'A24', end: 'A32', weight: 1 },
];

type Props = {
  visitedSections: string[];
};

const StoreMap: React.FC<Props> = ({ visitedSections }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const svgWidth = windowWidth * 0.95;
  const svgHeight = windowHeight * 0.8;
  const rectCenterX = 12;
  const rectCenterY = 30;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={svgWidth} height={svgHeight} viewBox="0 0 450 300">
        {/* Store outline */}
        <Rect x="20" y="20" width="410" height="260" fill="none" stroke={COLORS.text} strokeWidth="2" />

        {/* Calculate center of the Rect */}

        {/* Aisles */}
        {Object.entries(SECTIONS).map(([key, section]) => (
          <React.Fragment key={key}>
            <Rect
              x={rectCenterX - (section.width * 0.95) / 2 + section.x * 0.95}
              y={rectCenterY - (section.height * 0.95) / 2 + section.y * 0.9}
              width={section.width * 0.95}
              height={section.height * 0.95}
              fill={visitedSections.includes(key) ? COLORS.visitedAisle : COLORS.aisle}
              stroke={COLORS.text}
            />
            <SvgText
              x={rectCenterX - (section.width * 0.95) / 2 + section.x * 0.95 + (section.width * 0.95) / 2}
              y={rectCenterY - (section.height * 0.95) / 2 + section.y * 0.9 + (section.height * 0.95) / 2 + 5}
              fontSize="10"
              textAnchor="middle"
              fill={COLORS.text}
            >
              {section.label}
            </SvgText>
          </React.Fragment>
        ))}

        {/* Entrance */}
        <Rect x="20" y="280" width="40" height="20" fill={COLORS.entrance} />
        <SvgText x="40" y="295" fontSize="10" textAnchor="middle" fill={COLORS.text}>
          Entrance
        </SvgText>

        {/* Exit */}
        <Rect x="390" y="280" width="40" height="20" fill={COLORS.exit} />
        <SvgText x="410" y="295" fontSize="10" textAnchor="middle" fill={COLORS.text}>
          Exit
        </SvgText>

        {/* Checkout */}
        <Rect x="180" y="250" width="100" height="30" fill={COLORS.checkout} />
        <SvgText x="230" y="270" fontSize="12" textAnchor="middle" fill={COLORS.text}>
          Checkout
        </SvgText>
      </Svg>
    </View>
  );
};

export default StoreMap;
