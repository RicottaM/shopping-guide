import React, { useEffect, useState } from 'react';
import { Svg, Rect } from 'react-native-svg';
import { useGetAppData } from '@/app/hooks/useGetAppData';
import PathFindingService from '@/app/services/PathFindingService';
import { Section } from '@/app/models/section.model';
import { theme } from '@/app/utils/theme';
import { CartModel } from '@/app/models/cart.model';

interface MapSvgProps {
  currentLocation: number | null;
}

const MapSvg: React.FC<MapSvgProps> = ({ currentLocation }) => {
  const [traceSections, setTraceSections] = useState<number[]>();
  const getAppData = useGetAppData();

  useEffect(() => {
    const getEdges = async () => {
      try {
        const storeId = await getAppData('selectedStoreId');
        const userId = await getAppData('userId');

        const edges = await fetch(`http://172.20.10.3:3000/edges/${storeId}`);
        const edgesData = await edges.json();
        const pathFindingService = new PathFindingService(storeId, edgesData);

        const carts = await fetch(`http://172.20.10.3:3000/carts`);
        const cartsData = await carts.json();
        const userCart: CartModel = cartsData.find((cart: CartModel) => cart.user_id === userId);

        const userSections = await fetch(`http://172.20.10.3:3000/carts/${userCart.cart_id}/sections`);
        const userSectionsData = await userSections.json();

        const sectionNumbers = userSectionsData.map((section: Section) => section.section_id);

        setTraceSections(pathFindingService.getPath(sectionNumbers, currentLocation || 1));
      } catch (error) {
        if (error instanceof Error) {
          console.error('An error occured while getting data: ', error.message);
        } else {
          console.error('An error occured while getting data.');
        }
      }
    };

    getEdges();
  }, []);

  const getSectionColor = (sectionId: number) => {
    if (currentLocation === sectionId) {
      // pole usera
      return theme.light;
    } else if (traceSections?.includes(sectionId)) {
      // trasa
      return theme.sharpGreen;
    } else {
      // pole sekcji
      return theme.darkGreen;
    }
  };

  return (
    traceSections && (
      <Svg viewBox="0 0 200 500" preserveAspectRatio="xMidYMid meet" width="100%" height="100%">
        <Rect width="100%" height="100%" fill="#a0cbb3" />
        <Rect x="50" y="10" width="80" height="80" rx="15" fill={getSectionColor(1)} />
        <Rect x="50" y="110" width="80" height="80" rx="15" fill={getSectionColor(2)} />
        <Rect x="50" y="210" width="80" height="80" rx="15" fill={getSectionColor(3)} />
        <Rect x="50" y="310" width="80" height="80" rx="15" fill={getSectionColor(4)} />
        <Rect x="50" y="410" width="80" height="80" rx="15" fill={getSectionColor(5)} />
      </Svg>
    )
  );
};

export default MapSvg;
