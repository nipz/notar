import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import React, { FC, useCallback, useEffect, useMemo } from 'react';

import { useConfig } from '../hooks/useConfig';

const DEFAULT_NETWORKS = {
  ethereum: {
    rpc: 'https://rpc.ankr.com/eth',
  },
};

export interface SelectedNetwork {
  rpc: string;
  name: string;
}

interface NetworkSelectProps {
  onSuccess: (item: SelectedNetwork) => void;
  network?: string;
}

const NetworkSelect: FC<NetworkSelectProps> = ({ onSuccess, network }) => {
  const config = useConfig();
  const items = useMemo(() => {
    return Object.entries({
      ...DEFAULT_NETWORKS,
      ...config,
    })
      .filter(
        ([_, value]) =>
          typeof value === 'object' && typeof value.rpc === 'string'
      )
      .map(([networkName, networkConfig]) => ({
        key: networkName,
        label: networkName,
        value: { name: networkName, ...networkConfig },
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [config]);

  useEffect(
    function selectOnlyNetwork() {
      if (items.length === 1 && items[0]) {
        onSuccess(items[0].value);
      }
    },
    [items]
  );

  const handleSelect = useCallback(
    (item: any) => {
      onSuccess(item.value as SelectedNetwork);
    },
    [onSuccess]
  );

  useEffect(
    function selectNetworkArgument() {
      if (network && items) {
        const networkItem = items.find((item) => item.label === network);
        if (networkItem) {
          handleSelect(networkItem);
        }
      }
    },
    [network, items, handleSelect]
  );

  return (
    <Box flexDirection="column">
      <Text bold>Network:</Text>

      {items && (
        <SelectInput items={items} onSelect={handleSelect} limit={10} />
      )}
    </Box>
  );
};

export default NetworkSelect;
