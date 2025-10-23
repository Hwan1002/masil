import {
  FaBoxOpen,
  FaCampground,
  FaHome,
  FaTools,
  FaUtensils,
} from "react-icons/fa";

export const category = [
  {
    name: "가전제품",
    icon: <FaHome className="text-xl" />,
  },
  {
    name: "공구",
    icon: <FaTools className="text-xl" />,
  },
  {
    name: "주방용품",
    icon: <FaUtensils className="text-xl" />,
  },
  {
    name: "캠핑용품",
    icon: <FaCampground className="text-xl" />,
  },
  {
    name: "잡동사니",
    icon: <FaBoxOpen className="text-xl" />,
  },
];
