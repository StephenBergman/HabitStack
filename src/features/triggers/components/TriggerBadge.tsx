import { Text, View } from 'react-native';

import { appColors } from 'shared/constants/colors';

type TriggerBadgeProps = {
  label: string;
};

export function TriggerBadge({ label }: TriggerBadgeProps) {
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: appColors.accentSoft,
      }}
    >
      <Text style={{ color: appColors.accent, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}
