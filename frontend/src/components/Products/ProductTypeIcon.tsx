import {
  FiCpu,
  FiHeadphones,
  FiMonitor,
  FiMousePointer,
} from "react-icons/fi";
import {
  HiMiniRectangleGroup,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import { LuArmchair, LuCable, LuGamepad2, LuKeyboard } from "react-icons/lu";

export interface ProductTypeIconProps {
  className?: string;
  deviceType: string;
}

export function ProductTypeIcon({ className, deviceType }: ProductTypeIconProps) {
  if (deviceType === "mouse") {
    return <FiMousePointer aria-hidden="true" className={className} />;
  }
  if (deviceType === "keyboard") {
    return <LuKeyboard aria-hidden="true" className={className} />;
  }
  if (deviceType === "headset") {
    return <FiHeadphones aria-hidden="true" className={className} />;
  }
  if (deviceType === "monitor") {
    return <FiMonitor aria-hidden="true" className={className} />;
  }
  if (deviceType === "chair") {
    return <LuArmchair aria-hidden="true" className={className} />;
  }
  if (deviceType === "component") {
    return <FiCpu aria-hidden="true" className={className} />;
  }
  if (deviceType === "accessory") {
    return <LuCable aria-hidden="true" className={className} />;
  }
  if (deviceType === "mousepad") {
    return <HiMiniRectangleGroup aria-hidden="true" className={className} />;
  }
  if (deviceType === "controller") {
    return <LuGamepad2 aria-hidden="true" className={className} />;
  }

  return <HiOutlineSquares2X2 aria-hidden="true" className={className} />;
}
