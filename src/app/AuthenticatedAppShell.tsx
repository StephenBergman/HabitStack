import { useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { ListBulletsIcon, PlusCircleIcon } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CreateRuleScreen, RulesListScreen } from 'features/rules';
import { useAppTheme } from 'shared/theme';
import { AppText } from 'shared/ui';

type MainTab = 'rules' | 'create';

type BottomTabButtonProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  icon: ReactNode;
  labelColor: string;
};

function BottomTabButton({ label, selected, onPress, icon, labelColor }: BottomTabButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        paddingVertical: 9,
        minHeight: 56,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selected ? 'rgba(255,255,255,0.14)' : 'transparent',
        borderRadius: 10,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      <View style={{ alignItems: 'center', gap: 3 }}>
        {icon}
        <AppText style={{ color: labelColor }} variant="caption">
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

/**
 * Signed-in app shell with bottom tab navigation.
 */
export function AuthenticatedAppShell() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<MainTab>('rules');

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1 }}>
        {activeTab === 'rules' ? (
          <RulesListScreen />
        ) : (
          <CreateRuleScreen onCreated={() => setActiveTab('rules')} />
        )}
      </View>

      <View
        style={{
          backgroundColor: theme.colors.accent,
          paddingHorizontal: 0,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 10),
        }}
      >
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'stretch' }}>
          <View style={{ width: '50%', paddingHorizontal: 8 }}>
            <BottomTabButton
              label="Rules"
              selected={activeTab === 'rules'}
              onPress={() => setActiveTab('rules')}
              labelColor={activeTab === 'rules' ? '#FFFFFF' : theme.colors.accentSoft}
              icon={
                <ListBulletsIcon
                  color={activeTab === 'rules' ? '#FFFFFF' : theme.colors.accentSoft}
                  size={18}
                  weight={activeTab === 'rules' ? 'fill' : 'bold'}
                />
              }
            />
          </View>
          <View style={{ width: '50%', paddingHorizontal: 8 }}>
            <BottomTabButton
              label="Create"
              selected={activeTab === 'create'}
              onPress={() => setActiveTab('create')}
              labelColor={activeTab === 'create' ? '#FFFFFF' : theme.colors.accentSoft}
              icon={
                <PlusCircleIcon
                  color={activeTab === 'create' ? '#FFFFFF' : theme.colors.accentSoft}
                  size={18}
                  weight={activeTab === 'create' ? 'fill' : 'bold'}
                />
              }
            />
          </View>
        </View>
      </View>
    </View>
  );
}
