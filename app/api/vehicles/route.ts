// /app/api/vehicles/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
const vehicleData = {
  // Japanese Brands
  Honda: {
    Sedan: ['Civic', 'Accord', 'City', 'Insight', 'Legend', 'Grace'],
    SUV: ['CR-V', 'HR-V', 'Pilot', 'Passport', 'Element'],
    Hatchback: ['Fit', 'Jazz'],
    Minivan: ['Odyssey', 'Stepwgn'],
    Truck: ['Ridgeline'],
    Coupe: ['Civic Coupe', 'Accord Coupe'],
    Convertible: ['S2000'],
    Sports: ['NSX', 'Type R']
  },
  Toyota: {
    Sedan: ['Corolla', 'Camry', 'Yaris', 'Avalon', 'Crown', 'Mark X'],
    SUV: ['Fortuner', 'RAV4', 'Land Cruiser', 'Highlander', '4Runner', 'Sequoia', 'Prado', 'FJ Cruiser'],
    Hatchback: ['Auris', 'Yaris Hatchback', 'Vitz'],
    Minivan: ['Sienna', 'Alphard', 'Vellfire', 'Noah', 'Voxy'],
    Truck: ['Tundra', 'Hilux', 'Tacoma'],
    Coupe: ['86', 'Supra'],
    Sports: ['GR86', 'GR Supra', 'MR2'],
    Hybrid: ['Prius', 'Prius Prime', 'Mirai']
  },
  Nissan: {
    Sedan: ['Altima', 'Sentra', 'Versa', 'Maxima', 'Skyline', 'Teana'],
    SUV: ['Rogue', 'Murano', 'Pathfinder', 'Armada', 'Kicks', 'X-Trail', 'Patrol'],
    Hatchback: ['Micra', 'Leaf', 'Note'],
    Minivan: ['Quest', 'Serena'],
    Truck: ['Frontier', 'Titan', 'Navara'],
    Coupe: ['370Z', '350Z'],
    Sports: ['GT-R', 'Silvia', '240SX']
  },
  Mazda: {
    Sedan: ['Mazda3', 'Mazda6', 'Axela', 'Atenza'],
    SUV: ['CX-3', 'CX-5', 'CX-9', 'CX-30', 'CX-7'],
    Hatchback: ['Mazda3 Hatchback', 'Mazda2'],
    Truck: ['B-Series'],
    Coupe: ['RX-7', 'RX-8'],
    Sports: ['MX-5 Miata', 'RX-7', 'RX-8'],
    Convertible: ['MX-5 Miata']
  },
  Subaru: {
    Sedan: ['Impreza', 'Legacy', 'WRX'],
    SUV: ['Forester', 'Outback', 'Ascent', 'XV'],
    Hatchback: ['Impreza Hatchback', 'Crosstrek'],
    Coupe: ['BRZ'],
    Sports: ['WRX STI', 'BRZ']
  },
  Mitsubishi: {
    Sedan: ['Lancer', 'Galant', 'Attrage'],
    SUV: ['Outlander', 'Eclipse Cross', 'Pajero', 'ASX', 'Montero'],
    Hatchback: ['Mirage', 'Space Star'],
    Truck: ['L200', 'Triton'],
    Sports: ['Lancer Evolution', '3000GT', 'Eclipse']
  },
  Suzuki: {
    Sedan: ['Dzire', 'Ciaz', 'Baleno'],
    SUV: ['Vitara', 'Grand Vitara', 'S-Cross', 'Jimny'],
    Hatchback: ['Swift', 'Alto', 'Celerio', 'Wagon R'],
    Sports: ['Swift Sport', 'Hayabusa']
  },
  Lexus: {
    Sedan: ['ES', 'IS', 'GS', 'LS'],
    SUV: ['RX', 'GX', 'LX', 'NX', 'UX'],
    Coupe: ['RC', 'LC'],
    Sports: ['LC 500', 'RC F', 'IS F'],
    Convertible: ['IS Convertible', 'SC']
  },
  Infiniti: {
    Sedan: ['Q50', 'Q70', 'G35', 'G37'],
    SUV: ['QX60', 'QX80', 'QX50', 'FX'],
    Coupe: ['Q60', 'G35 Coupe'],
    Sports: ['Q60 Red Sport']
  },
  Acura: {
    Sedan: ['TLX', 'ILX', 'RLX'],
    SUV: ['MDX', 'RDX', 'ZDX'],
    Sports: ['NSX', 'Type S']
  },
  // South Korean Brands
  Hyundai: {
    Sedan: ['Elantra', 'Sonata', 'Accent', 'Ioniq', 'Genesis', 'Azera'],
    SUV: ['Tucson', 'Santa Fe', 'Palisade', 'Venue', 'Kona', 'Creta'],
    Hatchback: ['i20', 'i30', 'Veloster'],
    Minivan: ['Staria', 'H-1'],
    Sports: ['Veloster N', 'i30 N']
  },
  Kia: {
    Sedan: ['Forte', 'Optima', 'Rio Sedan', 'Stinger', 'K5'],
    SUV: ['Sportage', 'Sorento', 'Telluride', 'Seltos', 'Soul', 'Niro'],
    Hatchback: ['Rio Hatchback', 'Ceed', 'Picanto'],
    Minivan: ['Carnival', 'Sedona'],
    Sports: ['Stinger GT']
  },
  Genesis: {
    Sedan: ['G70', 'G80', 'G90'],
    SUV: ['GV70', 'GV80'],
    Coupe: ['G70 Coupe']
  },
  // German Brands
  BMW: {
    Sedan: ['3 Series', '5 Series', '7 Series', '2 Series Gran Coupe', '1 Series'],
    SUV: ['X1', 'X3', 'X5', 'X7', 'X6', 'X2', 'X4'],
    Hatchback: ['i3', '1 Series'],
    Coupe: ['2 Series', '4 Series', '8 Series'],
    Convertible: ['2 Series Convertible', '4 Series Convertible', '8 Series Convertible'],
    Sports: ['M2', 'M3', 'M4', 'M5', 'M8', 'Z4'],
    Electric: ['i3', 'i4', 'iX']
  },
  Mercedes: {
    Sedan: ['C-Class', 'E-Class', 'S-Class', 'A-Class Sedan', 'CLA'],
    SUV: ['GLA', 'GLC', 'GLE', 'GLS', 'G-Class', 'GLB'],
    Hatchback: ['A-Class'],
    Coupe: ['C-Class Coupe', 'E-Class Coupe', 'S-Class Coupe', 'CLS'],
    Convertible: ['C-Class Convertible', 'E-Class Convertible', 'S-Class Convertible'],
    Sports: ['AMG GT', 'SL', 'SLK', 'AMG C63', 'AMG E63'],
    Electric: ['EQC', 'EQS', 'EQA', 'EQB']
  },
  Audi: {
    Sedan: ['A3', 'A4', 'A6', 'A8', 'A5 Sportback'],
    SUV: ['Q3', 'Q5', 'Q7', 'Q8', 'Q2'],
    Hatchback: ['A3 Hatchback'],
    Coupe: ['A5', 'TT'],
    Convertible: ['A5 Convertible', 'TT Convertible'],
    Sports: ['R8', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7'],
    Electric: ['e-tron', 'e-tron GT']
  },
  Volkswagen: {
    Sedan: ['Jetta', 'Passat', 'Arteon'],
    SUV: ['Tiguan', 'Atlas', 'Taos', 'Touareg'],
    Hatchback: ['Golf', 'Golf GTI', 'Golf R', 'Polo', 'Up!'],
    Minivan: ['Multivan', 'Caravelle'],
    Sports: ['Golf GTI', 'Golf R'],
    Electric: ['ID.3', 'ID.4']
  },
  Porsche: {
    SUV: ['Cayenne', 'Macan'],
    Coupe: ['911', 'Cayman'],
    Sedan: ['Panamera'],
    Convertible: ['911 Convertible', 'Boxster'],
    Sports: ['911 Turbo', '718 Cayman', '718 Boxster'],
    Electric: ['Taycan']
  },
  // American Brands
  Ford: {
    Sedan: ['Fusion', 'Taurus', 'Focus Sedan', 'Mustang'],
    SUV: ['Escape', 'Edge', 'Explorer', 'Bronco', 'Expedition', 'EcoSport'],
    Hatchback: ['Focus Hatchback', 'Fiesta'],
    Minivan: ['Transit Connect'],
    Truck: ['F-150', 'Ranger', 'Super Duty', 'Maverick'],
    Sports: ['Mustang GT', 'Mustang Shelby', 'GT'],
    Electric: ['Mustang Mach-E', 'F-150 Lightning']
  },
  Chevrolet: {
    Sedan: ['Malibu', 'Impala', 'Cruze'],
    SUV: ['Trailblazer', 'Equinox', 'Tahoe', 'Traverse', 'Blazer', 'Suburban'],
    Hatchback: ['Spark', 'Sonic'],
    Truck: ['Silverado', 'Colorado', 'Avalanche'],
    Sports: ['Corvette', 'Camaro'],
    Electric: ['Bolt EV', 'Bolt EUV']
  },
  Cadillac: {
    Sedan: ['CT4', 'CT5', 'CT6'],
    SUV: ['XT4', 'XT5', 'XT6', 'Escalade'],
    Coupe: ['ATS Coupe'],
    Sports: ['CTS-V', 'ATS-V'],
    Electric: ['Lyriq']
  },
  GMC: {
    SUV: ['Terrain', 'Acadia', 'Yukon', 'Yukon XL'],
    Truck: ['Sierra', 'Canyon'],
    Electric: ['Hummer EV']
  },
  Buick: {
    Sedan: ['LaCrosse', 'Regal'],
    SUV: ['Encore', 'Envision', 'Enclave']
  },
  Dodge: {
    Sedan: ['Charger', 'Challenger'],
    SUV: ['Durango'],
    Minivan: ['Grand Caravan'],
    Sports: ['Challenger Hellcat', 'Charger Hellcat', 'Viper']
  },
  Chrysler: {
    Sedan: ['300'],
    Minivan: ['Pacifica']
  },
  Ram: {
    Truck: ['1500', '2500', '3500', 'ProMaster']
  },
  Jeep: {
    SUV: ['Wrangler', 'Grand Cherokee', 'Compass', 'Renegade', 'Cherokee', 'Gladiator']
  },
  Tesla: {
    Sedan: ['Model S', 'Model 3'],
    SUV: ['Model X', 'Model Y'],
    Truck: ['Cybertruck'],
    Sports: ['Roadster']
  },
  Lincoln: {
    Sedan: ['Continental'],
    SUV: ['Navigator', 'Aviator', 'Corsair', 'Nautilus']
  },
  // British Brands
  LandRover: {
    SUV: ['Discovery', 'Range Rover', 'Defender', 'Velar', 'Evoque', 'Sport']
  },
  Jaguar: {
    Sedan: ['XE', 'XF', 'XJ'],
    SUV: ['F-Pace', 'E-Pace', 'I-Pace'],
    Coupe: ['F-Type'],
    Sports: ['F-Type R', 'XKR'],
    Electric: ['I-Pace']
  },
  Bentley: {
    Sedan: ['Flying Spur', 'Mulsanne'],
    SUV: ['Bentayga'],
    Coupe: ['Continental GT'],
    Convertible: ['Continental GTC']
  },
  RollsRoyce: {
    Sedan: ['Ghost', 'Phantom'],
    SUV: ['Cullinan'],
    Coupe: ['Wraith'],
    Convertible: ['Dawn']
  },
  AstonMartin: {
    Coupe: ['Vantage', 'DB11', 'DBS'],
    SUV: ['DBX'],
    Convertible: ['Vantage Convertible', 'DB11 Volante']
  },
  McLaren: {
    Sports: ['570S', '720S', 'Artura', 'P1', 'Senna']
  },
  Lotus: {
    Sports: ['Evora', 'Elise', 'Exige', 'Emira']
  },
  Mini: {
    Hatchback: ['Cooper', 'Cooper S', 'Cooper SE'],
    SUV: ['Countryman', 'Clubman'],
    Convertible: ['Cooper Convertible']
  },
  // Italian Brands
  Ferrari: {
    Coupe: ['488', 'F8', 'Roma', '812 Superfast'],
    Convertible: ['488 Spider', 'Portofino'],
    Sports: ['SF90', 'LaFerrari', 'Enzo']
  },
  Lamborghini: {
    Coupe: ['Huracan', 'Aventador'],
    SUV: ['Urus'],
    Convertible: ['Huracan Spyder', 'Aventador Roadster']
  },
  Maserati: {
    Sedan: ['Ghibli', 'Quattroporte'],
    SUV: ['Levante', 'Grecale'],
    Coupe: ['GranTurismo'],
    Convertible: ['GranCabrio']
  },
  Alfa_Romeo: {
    Sedan: ['Giulia'],
    SUV: ['Stelvio'],
    Hatchback: ['Giulietta'],
    Sports: ['4C', 'Giulia Quadrifoglio']
  },
  Fiat: {
    Hatchback: ['500', 'Panda', 'Punto'],
    SUV: ['500X'],
    Convertible: ['500 Convertible']
  },
  // French Brands
  Peugeot: {
    Sedan: ['508'],
    SUV: ['2008', '3008', '5008'],
    Hatchback: ['208', '308', '207']
  },
  Citroen: {
    Sedan: ['C4'],
    SUV: ['C3 Aircross', 'C5 Aircross'],
    Hatchback: ['C3', 'C1'],
    Minivan: ['Berlingo', 'SpaceTourer']
  },
  Renault: {
    Sedan: ['Megane Sedan', 'Fluence'],
    SUV: ['Captur', 'Kadjar', 'Koleos'],
    Hatchback: ['Clio', 'Megane', 'Twingo'],
    Sports: ['Megane RS', 'Clio RS']
  },
  Bugatti: {
    Sports: ['Chiron', 'Veyron', 'Divo']
  },
  // Swedish Brands
  Volvo: {
    Sedan: ['S60', 'S90'],
    SUV: ['XC40', 'XC60', 'XC90'],
    Wagon: ['V60', 'V90'],
    Electric: ['XC40 Recharge', 'C40']
  },
  Saab: {
    Sedan: ['9-3', '9-5'],
    Hatchback: ['9-3 SportCombi']
  },
  Koenigsegg: {
    Sports: ['Regera', 'Jesko', 'Gemera']
  },
  // Chinese Brands
  BYD: {
    Sedan: ['Qin', 'Han'],
    SUV: ['Tang', 'Song', 'Yuan'],
    Electric: ['Dolphin', 'Seal', 'Atto 3']
  },
  Geely: {
    Sedan: ['Emgrand', 'Bo Rui'],
    SUV: ['Boyue', 'Xingyue', 'Atlas']
  },
  Chery: {
    Sedan: ['Arrizo'],
    SUV: ['Tiggo', 'Exeed']
  },
  Great_Wall: {
    SUV: ['Haval H6', 'Haval F7', 'WEY VV7'],
    Truck: ['Wingle', 'Poer']
  },
  NIO: {
    SUV: ['ES8', 'ES6', 'EC6'],
    Sedan: ['ET7', 'ET5'],
    Electric: ['ES8', 'ES6', 'EC6', 'ET7', 'ET5']
  },
  Xpeng: {
    Sedan: ['P7'],
    SUV: ['G3', 'G9'],
    Electric: ['P7', 'G3', 'G9']
  },
  Li_Auto: {
    SUV: ['Li ONE', 'L9', 'L8'],
    Electric: ['Li ONE', 'L9', 'L8']
  },
  // Indian Brands
  Tata: {
    Sedan: ['Tigor', 'Zest'],
    SUV: ['Nexon', 'Harrier', 'Safari', 'Hexa'],
    Hatchback: ['Tiago', 'Altroz']
  },
  Mahindra: {
    SUV: ['XUV700', 'XUV300', 'Scorpio', 'Thar', 'Bolero'],
    Truck: ['Pickup']
  },
  Maruti_Suzuki: {
    Sedan: ['Dzire', 'Ciaz'],
    SUV: ['Vitara Brezza', 'S-Cross', 'Grand Vitara'],
    Hatchback: ['Swift', 'Baleno', 'Alto', 'WagonR', 'Celerio']
  },
  // Russian Brands
  Lada: {
    Sedan: ['Vesta', 'Granta'],
    SUV: ['Niva', 'XRAY'],
    Hatchback: ['Kalina']
  },
  // Malaysian Brands
  Proton: {
    Sedan: ['Saga', 'Persona'],
    SUV: ['X70', 'X50'],
    Hatchback: ['Iriz']
  },
  Perodua: {
    Hatchback: ['Myvi', 'Axia', 'Alza'],
    SUV: ['Aruz']
  },
  // Romanian Brands
  Dacia: {
    Sedan: ['Logan'],
    SUV: ['Duster', 'Sandero Stepway'],
    Hatchback: ['Sandero']
  },
  // Czech Brands
  Skoda: {
    Sedan: ['Octavia', 'Superb'],
    SUV: ['Kodiaq', 'Karoq', 'Kamiq'],
    Hatchback: ['Fabia', 'Scala']
  },
  // Spanish Brands
  Seat: {
    Hatchback: ['Ibiza', 'Leon'],
    SUV: ['Ateca', 'Tarraco'],
    Sports: ['Leon Cupra']
  },
  // Australian Brands
  Holden: {
    Sedan: ['Commodore'],
    SUV: ['Acadia', 'Trailblazer'],
    Sports: ['Commodore SS']
  }
};

const services = [
  'Car Wash',
  'Interior Cleaning',
  'Polishing',
  'AC Service',
  'Engine Tuning',
  'Wheel Alignment',
  'Wheel Balancing',
  'Oil Change',
  'Brake Service',
  'Suspension Check',
  'Battery Check',
  'Diagnostic Service',
  'Detailing',
  'Underbody Coating',
  'Paint Protection Film',
  'Ceramic Coating'
];

const spareParts = [
  { partId: '001', partName: 'Engine Oil' },
  { partId: '002', partName: 'Oil Filter' },
  { partId: '003', partName: 'Air Filter' },
  { partId: '004', partName: 'Fuel Filter' },
  { partId: '005', partName: 'Spark Plug' },
  { partId: '006', partName: 'Glow Plug' },
  { partId: '007', partName: 'Timing Belt' },
  { partId: '008', partName: 'Timing Chain' },
  { partId: '009', partName: 'Serpentine Belt' },
  { partId: '010', partName: 'Cylinder Head' },
  { partId: '011', partName: 'Gasket Set' },
  { partId: '012', partName: 'Piston' },
  { partId: '013', partName: 'Crankshaft' },
  { partId: '014', partName: 'Camshaft' },

  { partId: '015', partName: 'Clutch Plate' },
  { partId: '016', partName: 'Pressure Plate' },
  { partId: '017', partName: 'Flywheel' },
  { partId: '018', partName: 'Gearbox' },
  { partId: '019', partName: 'Driveshaft' },
  { partId: '020', partName: 'Differential' },
  { partId: '021', partName: 'Axle Shaft' },
  { partId: '022', partName: 'Transmission Fluid' },

  { partId: '023', partName: 'Brake Pads' },
  { partId: '024', partName: 'Brake Discs' },
  { partId: '025', partName: 'Brake Calipers' },
  { partId: '026', partName: 'Brake Lines' },
  { partId: '027', partName: 'Brake Drum' },
  { partId: '028', partName: 'ABS Sensor' },
  { partId: '029', partName: 'Master Cylinder' },

  { partId: '030', partName: 'Shock Absorber' },
  { partId: '031', partName: 'Struts' },
  { partId: '032', partName: 'Control Arm' },
  { partId: '033', partName: 'Ball Joint' },
  { partId: '034', partName: 'Tie Rod End' },
  { partId: '035', partName: 'Steering Rack' },
  { partId: '036', partName: 'Power Steering Pump' },
  { partId: '037', partName: 'Stabilizer Bar' },

  { partId: '038', partName: 'Radiator' },
  { partId: '039', partName: 'Radiator Fan' },
  { partId: '040', partName: 'Water Pump' },
  { partId: '041', partName: 'Thermostat' },
  { partId: '042', partName: 'Coolant Reservoir' },
  { partId: '043', partName: 'Heater Core' },
  { partId: '044', partName: 'Cooling Hose' },

  { partId: '045', partName: 'Battery' },
  { partId: '046', partName: 'Alternator' },
  { partId: '047', partName: 'Starter Motor' },
  { partId: '048', partName: 'Ignition Coil' },
  { partId: '049', partName: 'Fuse Box' },
  { partId: '050', partName: 'Wiring Harness' },
  { partId: '051', partName: 'ECU (Engine Control Unit)' },
  { partId: '052', partName: 'Relays and Fuses' },

  { partId: '053', partName: 'Headlights' },
  { partId: '054', partName: 'Tail Light' },
  { partId: '055', partName: 'Fog Light' },
  { partId: '056', partName: 'Turn Signal Light' },
  { partId: '057', partName: 'Interior Dome Light' },
  { partId: '058', partName: 'Side Mirror Indicator' },
  { partId: '059', partName: 'Windshield Wiper' },
  { partId: '060', partName: 'Wiper Motor' },
  { partId: '061', partName: 'Washer Pump' },

  { partId: '062', partName: 'AC Compressor' },
  { partId: '063', partName: 'AC Condenser' },
  { partId: '064', partName: 'AC Evaporator' },
  { partId: '065', partName: 'AC Blower Motor' },
  { partId: '066', partName: 'Cabin Air Filter' },
  { partId: '067', partName: 'Climate Control Panel' },

  { partId: '068', partName: 'Fuel Pump' },
  { partId: '069', partName: 'Fuel Injector' },
  { partId: '070', partName: 'Fuel Tank' },
  { partId: '071', partName: 'Throttle Body' },
  { partId: '072', partName: 'Carburetor' },
  { partId: '073', partName: 'Fuel Rail' },

  { partId: '074', partName: 'Muffler' },
  { partId: '075', partName: 'Catalytic Converter' },
  { partId: '076', partName: 'Exhaust Manifold' },
  { partId: '077', partName: 'Oxygen Sensor' },
  { partId: '078', partName: 'Tailpipe' },

  { partId: '079', partName: 'Bumper' },
  { partId: '080', partName: 'Grille' },
  { partId: '081', partName: 'Bonnet (Hood)' },
  { partId: '082', partName: 'Trunk Lid (Boot)' },
  { partId: '083', partName: 'Fender' },
  { partId: '084', partName: 'Door Handle' },
  { partId: '085', partName: 'Side Mirror' },
  { partId: '086', partName: 'Rear View Mirror' },
  { partId: '087', partName: 'Windshield' },
  { partId: '088', partName: 'Windows' },
  { partId: '089', partName: 'Spoiler' },

  { partId: '090', partName: 'Dashboard' },
  { partId: '091', partName: 'Steering Wheel' },
  { partId: '092', partName: 'Gear Knob' },
  { partId: '093', partName: 'Car Seat' },
  { partId: '094', partName: 'Floor Mat' },
  { partId: '095', partName: 'Center Console' },
  { partId: '096', partName: 'Instrument Cluster' },
  { partId: '097', partName: 'Interior Trim' },

  { partId: '098', partName: 'Tire' },
  { partId: '099', partName: 'Wheel Rim' },
  { partId: '100', partName: 'Wheel Hub' },
  { partId: '101', partName: 'Wheel Bearing' },
  { partId: '102', partName: 'Lug Nut' },
  { partId: '103', partName: 'Tire Valve' },

  { partId: '104', partName: 'Airbag' },
  { partId: '105', partName: 'Seat Belt' },
  { partId: '106', partName: 'Parking Sensor' },
  { partId: '107', partName: 'Reverse Camera' },
  { partId: '108', partName: 'Immobilizer' },
  { partId: '109', partName: 'Central Locking System' },

  { partId: '110', partName: 'Hoses & Belts' },
  { partId: '111', partName: 'Clips & Fasteners' },
  { partId: '112', partName: 'Rubber Bushings' },
  { partId: '113', partName: 'Seals and O-Rings' },
  { partId: '114', partName: 'Mounts & Brackets' }
];

  return NextResponse.json({ vehicleData, spareParts, services });
}
