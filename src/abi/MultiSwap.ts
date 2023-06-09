export const MultiSwapAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_controller', type: 'address' },
      { internalType: 'address', name: '_calculator', type: 'address' },
      { internalType: 'address[]', name: '_factories', type: 'address[]' },
      { internalType: 'address[]', name: '_routers', type: 'address[]' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'oldValue', type: 'address' },
      { indexed: false, internalType: 'address', name: 'newValue', type: 'address' },
    ],
    name: 'CalculatorUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'factory', type: 'address' },
      { indexed: false, internalType: 'address', name: 'router', type: 'address' },
    ],
    name: 'RouterUpdated',
    type: 'event',
  },
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
    inputs: [],
    name: 'MAX_ROUTES',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VERSION',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'calculator',
    outputs: [{ internalType: 'contract IPriceCalculator', name: '', type: 'address' }],
    stateMutability: 'view',
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
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'factoryToRouter',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_tokenIn', type: 'address' },
      { internalType: 'address', name: '_tokenOut', type: 'address' },
    ],
    name: 'findLpsForSwaps',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
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
      { internalType: 'address[]', name: 'lps', type: 'address[]' },
      { internalType: 'address', name: 'tokenIn', type: 'address' },
      { internalType: 'address', name: 'tokenOut', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'slippageTolerance', type: 'uint256' },
    ],
    name: 'multiSwap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'pair', type: 'address' }],
    name: 'routerForPair',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: '_token', type: 'address' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
    ],
    name: 'salvage',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_newValue', type: 'address' }],
    name: 'setCalculator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'factory', type: 'address' },
      { internalType: 'address', name: 'router', type: 'address' },
    ],
    name: 'setRouterForFactory',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
