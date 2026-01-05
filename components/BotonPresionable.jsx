import { Pressable } from "react-native";

// components/BotonPresionable.jsx
export const BotonPresionable = ({ onPress, children, style }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [style, pressed && { opacity: 0.6 }]}
  >
    {children}
  </Pressable>
);
