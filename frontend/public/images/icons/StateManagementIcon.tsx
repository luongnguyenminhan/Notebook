import { useColorModeValue } from '@chakra-ui/react';
const StateManagementIcon = () => {
  const fillColor = useColorModeValue('#2563eb', '#60A5FA');
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke={fillColor}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
    </svg>
  );
};
export default StateManagementIcon;
