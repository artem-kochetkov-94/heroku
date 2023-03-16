export const VaultControllerAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'oldValue', type: 'address' },
      { indexed: false, internalType: 'address', name: 'newValue', type: 'address' },
    ],
    name: 'UpdateController',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'address', name: 'oldValue', type: 'address' },
      { indexed: false, internalType: 'address', name: 'newValue', type: 'address' },
    ],
    name: 'UpdatedAddressSlot',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'string', name: 'name', type: 'string' },
      { indexed: false, internalType: 'uint256', name: 'oldValue', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'newValue', type: 'uint256' },
    ],
    name: 'UpdatedUint256Slot',
    type: 'event',
  },
  {
    inputs: [],
    name: 'VERSION',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_vaults', type: 'address[]' },
      { internalType: 'address', name: '_rt', type: 'address' },
    ],
    name: 'addRewardTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_targets', type: 'address[]' },
      { internalType: 'bool', name: '_value', type: 'bool' },
    ],
    name: 'changePpfsDecreasePermissions',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_targets', type: 'address[]' },
      { internalType: 'bool[]', name: '_statuses', type: 'bool[]' },
    ],
    name: 'changeVaultsStatuses',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'controller',
    outputs: [{ internalType: 'address', name: 'adr', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'created',
    outputs: [{ internalType: 'uint256', name: 'ts', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_controller', type: 'address' }],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_controller', type: 'address' }],
    name: 'initializeControllable',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initializeVaultControllerStorage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_adr', type: 'address' }],
    name: 'isController',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_adr', type: 'address' }],
    name: 'isGovernance',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: '_vaults', type: 'address[]' },
      { internalType: 'address', name: '_rt', type: 'address' },
    ],
    name: 'removeRewardTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardBoostDuration',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardRatioWithoutBoost',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'duration', type: 'uint256' }],
    name: 'setRewardBoostDuration',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'ratio', type: 'uint256' }],
    name: 'setRewardRatioWithoutBoost',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_vault', type: 'address' }],
    name: 'stopVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address[]', name: '_vaults', type: 'address[]' }],
    name: 'stopVaultsBatch',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]