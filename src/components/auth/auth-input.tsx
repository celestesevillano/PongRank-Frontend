import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { Brand, Spacing } from '@/constants/theme';

export function AuthInput(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={Brand.textSecondary}
      style={styles.input}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Brand.border,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    color: Brand.text,
    fontSize: 16,
    backgroundColor: Brand.surface,
  },
});
