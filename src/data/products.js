import { images } from './images';

export const PRODUCTS = [
  {
    id: 'centrifugal-sieving',
    name: 'CENTRIFUGAL SIEVING SYSTEM',
    category: 'SIFTING & SEPARATION',
    image: images.products.homogenizer, // using the sifter image
    highlights: [
      'Uses a set of high-speed rotating paddles',
      'Offered in 3 sizes: 90-C, 180-C, and 360-C',
      'High-throughput check screening',
      'Tool-free screen changing design',
      'Dust-tight sanitary execution'
    ],
    overview: 'High-performance centrifugal sifter designed for gravity-fed check screening, de-dusting, and grading. Utilizes paddles to fluidize material and screen fragile powders without degradation.',
    features: [
      'Cantilever shaft allows screen changes in under 60 seconds.',
      'Tool-free disassembly for rapid hygiene washdown.',
      'Quiet operation under 70 dBA at maximum load.',
      'Dual-action seal design for dust protection.',
      'Robust direct earthing kit included as standard.'
    ],
    industries: [
      'Dairy Processing',
      'Bakery & Flour Mills',
      'Pharmaceuticals',
      'Additive Manufacturing'
    ],
    applications: [
      'Bag emptying check screening',
      'Raw material ingredient sifting',
      'Fines removal from granules',
      'Delumping processed material'
    ],
    brochure: '/brochures/sievmaster_rota_screener.pdf',
    options: [
      { name: 'Ultrasonic Deblinding System', desc: 'Prevents screen blinding on sticky or high-fat powders.' },
      { name: 'Mobile Wheeled Support Frame', desc: 'C-frame design for mobile integration in tight spaces.' },
      { name: 'Underscreen Magnet Drawer', desc: 'Rare-earth magnets rated at 12,000 Gauss.' },
      { name: 'Weir Flow Inlet', desc: 'Controls feed rate to protect screening mesh.' }
    ],
    specs: [
      { label: 'Throughput Capacity', value: 'Up to 35,000 kg/hr' },
      { label: 'Basket Models', value: '90-C / 180-C / 360-C' },
      { label: 'Mesh Range', value: '100µm to 8mm' },
      { label: 'Motor Power', value: '1.1kW - 5.5kW' },
      { label: 'Compliance', value: 'FDA, EC 1935/2004, CE' },
      { label: 'Material', value: 'SS316L Contact Parts' }
    ]
  }
];
