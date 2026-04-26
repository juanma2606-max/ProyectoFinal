import { Planta } from '../modelos/planta.model';
import { Amenaza } from '../modelos/amenaza.model';

export const PLANTAS_SEED: Planta[] = [
  new Planta(
    'Tomate',
    'Planta de clima cálido muy popular en huertos urbanos. Produce frutos rojos jugosos ricos en vitaminas.',
    'hortaliza',
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
    'primavera, verano',
    90,
    'moderado',
    'pleno-sol',
    'Rico en potasio y fósforo. Aplicar compost o humus de lombriz cada 15 días durante la floración.',
    [], // incompatibilidades (se pueden añadir IDs después)
    [], // amenazas (se pueden añadir IDs después)
    undefined,
    'Solanum lycopersicum'
  ),
  new Planta(
    'Lechuga',
    'Hortaliza de hoja verde de crecimiento rápido. Ideal para principiantes.',
    'hortaliza',
    'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400',
    'primavera, otoño',
    60,
    'alto',
    'semi-sombra',
    'Ligero. Compost bien descompuesto al preparar el suelo. Evitar exceso de nitrógeno.',
    [],
    [],
    undefined,
    'Lactuca sativa'
  ),
  new Planta(
    'Albahaca',
    'Planta aromática mediterránea muy versátil en cocina. Aroma intenso y fresco.',
    'hierba',
    'https://images.unsplash.com/photo-1618375569909-3c8616cf7de3?w=400',
    'primavera, verano',
    75,
    'moderado',
    'pleno-sol',
    'Moderado. Humus de lombriz o compost cada 20-30 días para mantener vigor.',
    [],
    [],
    undefined,
    'Ocimum basilicum'
  ),
  new Planta(
    'Pimiento',
    'Planta que produce frutos dulces o picantes según la variedad. Muy nutritivo.',
    'hortaliza',
    'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400',
    'primavera, verano',
    120,
    'moderado',
    'pleno-sol',
    'Rico en calcio y magnesio. Compost al trasplantar y fertilizante orgánico cada 15 días.',
    [],
    [],
    undefined,
    'Capsicum annuum'
  ),
  new Planta(
    'Zanahoria',
    'Raíz comestible rica en betacaroteno. Cultivo sencillo en suelo profundo.',
    'hortaliza',
    'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    'primavera, otoño',
    90,
    'moderado',
    'pleno-sol',
    'Bajo. Evitar abonos frescos que deformen las raíces. Compost bien maduro al preparar suelo.',
    [],
    [],
    undefined,
    'Daucus carota'
  ),
  new Planta(
    'Perejil',
    'Aromática mediterránea muy utilizada en cocina. Bienal de fácil cultivo.',
    'hierba',
    'https://images.unsplash.com/photo-1615485500834-bc10199bc727?w=400',
    'todo el año',
    80,
    'moderado',
    'semi-sombra',
    'Moderado. Humus de lombriz o compost cada mes. Prefiere suelos ricos en materia orgánica.',
    [],
    [],
    undefined,
    'Petroselinum crispum'
  ),
  new Planta(
    'Calabacín',
    'Planta muy productiva que produce abundantes frutos. Ocupa mucho espacio.',
    'hortaliza',
    'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400',
    'primavera, verano',
    60,
    'alto',
    'pleno-sol',
    'Alto. Gran consumidor de nutrientes. Compost abundante y fertilizante orgánico semanal.',
    [],
    [],
    undefined,
    'Cucurbita pepo'
  ),
  new Planta(
    'Espinaca',
    'Hortaliza de hoja rica en hierro. Resistente al frío.',
    'hortaliza',
    'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    'otoño, invierno',
    50,
    'moderado',
    'semi-sombra',
    'Moderado en nitrógeno. Compost al sembrar y un aporte a mitad del cultivo.',
    [],
    [],
    undefined,
    'Spinacia oleracea'
  ),
  new Planta(
    'Cebolla',
    'Bulbo aromático básico en cocina. Cultivo de larga duración.',
    'hortaliza',
    'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
    'otoño, invierno',
    150,
    'bajo',
    'pleno-sol',
    'Bajo. Evitar nitrógeno excesivo que favorece hojas sobre bulbo. Compost al plantar.',
    [],
    [],
    undefined,
    'Allium cepa'
  ),
  new Planta(
    'Romero',
    'Arbusto aromático mediterráneo muy resistente. Perenne.',
    'hierba',
    'https://images.unsplash.com/photo-1583406000514-3e9c6cd0552e?w=400',
    'todo el año',
    365,
    'bajo',
    'pleno-sol',
    'Muy bajo. Planta rústica que no necesita abono. En maceta, compost ligero anual.',
    [],
    [],
    undefined,
    'Rosmarinus officinalis'
  ),
  new Planta(
    'Rúcula',
    'Hoja verde picante de crecimiento rápido. Excelente en ensaladas.',
    'hortaliza',
    'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=400',
    'primavera, otoño',
    40,
    'moderado',
    'semi-sombra',
    'Ligero. Compost al preparar suelo. Crece bien en suelos pobres.',
    [],
    [],
    undefined,
    'Eruca sativa'
  ),
  new Planta(
    'Fresa',
    'Planta perenne que produce frutos dulces. Ideal para macetas.',
    'fruta',
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
    'primavera',
    90,
    'moderado',
    'pleno-sol',
    'Moderado en potasio. Compost al plantar y fertilizante para frutales cada mes.',
    [],
    [],
    undefined,
    'Fragaria × ananassa'
  ),
  new Planta(
    'Calabaza',
    'Planta rastrera que produce grandes frutos. Necesita mucho espacio.',
    'hortaliza',
    'https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=400',
    'primavera, verano',
    120,
    'moderado',
    'pleno-sol',
    'Alto. Gran consumidor. Compost abundante al plantar y fertilizante cada 15 días.',
    [],
    [],
    undefined,
    'Cucurbita maxima'
  ),
  new Planta(
    'Cilantro',
    'Hierba aromática con sabor intenso. Todas sus partes son comestibles.',
    'hierba',
    'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400',
    'primavera, otoño',
    60,
    'moderado',
    'semi-sombra',
    'Ligero. Compost al sembrar. No necesita mucho abono.',
    [],
    [],
    undefined,
    'Coriandrum sativum'
  ),
  new Planta(
    'Berenjena',
    'Planta de frutos morados de textura carnosa. Requiere calor.',
    'hortaliza',
    'https://images.unsplash.com/photo-1659261200833-ec6fd6ad3d79?w=400',
    'primavera, verano',
    100,
    'moderado',
    'pleno-sol',
    'Rico en potasio. Compost al trasplantar y fertilizante cada 2 semanas.',
    [],
    [],
    undefined,
    'Solanum melongena'
  )
];

export const AMENAZAS_SEED: Amenaza[] = [
  new Amenaza(
    'Pulgón',
    'Pequeños insectos de 1-3mm que se alimentan de la savia de las plantas. Pueden ser verdes, negros, amarillos o marrones.',
    'plaga',
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400',
    [
      'Colonias visibles en brotes tiernos y hojas nuevas',
      'Hojas enrolladas, arrugadas o deformadas',
      'Presencia de melaza pegajosa en hojas',
      'Aparición de hormigas (cultivan pulgones)',
      'Hojas amarillentas y debilitamiento general'
    ],
    'Eliminar con chorro de agua a presión. Aplicar jabón potásico diluido (1-2%). Introducir mariquitas o crisopas como control biológico. Pulverizar infusión de ajo.'
  ),
  new Amenaza(
    'Mosca blanca',
    'Pequeñas moscas blancas de 1-2mm que viven en el envés de las hojas y debilitan las plantas.',
    'plaga',
    'https://images.unsplash.com/photo-1594504962896-abf5795fd4c5?w=400',
    [
      'Nubes de pequeñas moscas blancas al mover la planta',
      'Hojas amarillentas y marchitas',
      'Presencia de melaza pegajosa',
      'Fumagina (hongo negro) sobre la melaza',
      'Crecimiento ralentizado'
    ],
    'Colocar trampas cromáticas amarillas adhesivas. Aplicar aceite de neem o jabón potásico. Introducir Encarsia formosa (parasitoide). Eliminar malas hierbas cercanas.'
  ),
  new Amenaza(
    'Araña roja',
    'Ácaro microscópico que prolifera en ambientes secos y calurosos. Forma telarañas características.',
    'plaga',
    'https://images.unsplash.com/photo-1577909781183-013e25efea53?w=400',
    [
      'Punteado amarillento en hojas',
      'Telarañas finas en el envés de las hojas',
      'Hojas que se secan y caen',
      'Decoloración generalizada',
      'Ácaros rojos visibles con lupa'
    ],
    'Aumentar humedad ambiental. Pulverizar con agua. Aplicar azufre mojable o aceite de neem. Introducir ácaros depredadores (Phytoseiulus). Eliminar hojas muy afectadas.'
  ),
  new Amenaza(
    'Caracoles y babosas',
    'Moluscos que se alimentan de noche dejando rastros de baba plateada. Muy voraces con plantas tiernas.',
    'plaga',
    'https://images.unsplash.com/photo-1589395937772-9c5fb8e5e12f?w=400',
    [
      'Agujeros irregulares en hojas',
      'Rastros de baba plateada',
      'Plántulas completamente devoradas',
      'Daños nocturnos (aparecen por la mañana)',
      'Presencia de caracoles o babosas al anochecer'
    ],
    'Recolección manual nocturna. Barreras físicas (ceniza, cáscaras de huevo, cobre). Trampas con cerveza. Refugios de madera para capturarlos. Patos como control biológico.'
  ),
  new Amenaza(
    'Oruga de la col',
    'Larvas de mariposa blanca que devoran hojas de crucíferas (col, brócoli, coliflor).',
    'plaga',
    'https://images.unsplash.com/photo-1589669673287-6ba25e3c96c5?w=400',
    [
      'Agujeros grandes en hojas',
      'Orugas verdes visibles',
      'Excrementos oscuros en las hojas',
      'Hojas completamente devoradas',
      'Mariposas blancas volando alrededor'
    ],
    'Recolección manual de orugas y huevos. Aplicar Bacillus thuringiensis (bacteria específica). Cubrir plantas con malla anti-insectos. Plantar aromáticas repelentes (romero, tomillo).'
  ),
  new Amenaza(
    'Mildiu',
    'Hongo que afecta principalmente a tomates, patatas, cucurbitáceas y vid. Favorecido por humedad alta.',
    'enfermedad',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    [
      'Manchas irregulares amarillas o marrones en hojas',
      'Moho grisáceo en el envés de las hojas',
      'Marchitamiento rápido de hojas afectadas',
      'Manchas en tallos y frutos',
      'Olor característico a humedad'
    ],
    'Eliminar hojas afectadas inmediatamente. Aplicar fungicida ecológico a base de cobre (caldo bordelés). Mejorar ventilación entre plantas. Regar sin mojar hojas. Tratamientos preventivos con cola de caballo.'
  ),
  new Amenaza(
    'Oidio',
    'Hongo que forma polvo blanco sobre hojas. También llamado blanquilla o cenicilla.',
    'enfermedad',
    'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=400',
    [
      'Polvo blanco harinoso en hojas y tallos',
      'Hojas que se enrollan y deforman',
      'Crecimiento atrofiado',
      'Hojas que amarillean y caen',
      'Afecta principalmente hojas jóvenes'
    ],
    'Eliminar partes afectadas. Pulverizar con leche diluida (1:10 con agua). Azufre en polvo o mojable. Bicarbonato sódico diluido. Mejorar aireación. Evitar exceso de nitrógeno.'
  ),
  new Amenaza(
    'Roya',
    'Hongo que produce pústulas naranjas o marrones en hojas. Común en judías, ajos y cebollas.',
    'enfermedad',
    'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400',
    [
      'Pústulas naranjas, marrones o negras en hojas',
      'Manchas amarillas en el haz',
      'Hojas que se secan y caen prematuramente',
      'Debilitamiento general de la planta',
      'Se propaga rápidamente'
    ],
    'Eliminar hojas infectadas. Aplicar caldo bordelés o azufre. No mojar follaje al regar. Rotar cultivos. Plantar variedades resistentes. Desinfectar herramientas.'
  ),
  new Amenaza(
    'Fusarium',
    'Hongo del suelo que causa marchitamiento vascular. Persiste años en el suelo.',
    'enfermedad',
    'https://images.unsplash.com/photo-1585411241865-7fed208d0d87?w=400',
    [
      'Marchitamiento de la planta a pesar del riego',
      'Amarilleamiento de hojas bajas',
      'Oscurecimiento de vasos conductores (corte de tallo)',
      'Muerte progresiva de la planta',
      'Afecta un lado de la planta primero'
    ],
    'No hay cura una vez infectada. Arrancar y destruir plantas afectadas. Solarización del suelo. Rotación de cultivos de 4-5 años. Usar variedades resistentes. Mejorar drenaje del suelo.'
  ),
  new Amenaza(
    'Botrytis',
    'Hongo que causa podredumbre gris en flores, frutos y tallos. Favorecido por humedad y poca ventilación.',
    'enfermedad',
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400',
    [
      'Manchas marrones acuosas en hojas y frutos',
      'Moho gris aterciopelado',
      'Flores que se pudren',
      'Frutos momificados',
      'Tallos que se rompen fácilmente'
    ],
    'Eliminar partes afectadas. Mejorar ventilación. Reducir humedad ambiental. Evitar regar por aspersión. Aplicar fungicidas ecológicos. Mantener plantas secas durante la noche.'
  ),
  new Amenaza(
    'Trips',
    'Insectos diminutos que raspan hojas y flores. Transmiten virus a las plantas.',
    'plaga',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400',
    [
      'Manchas plateadas o bronceadas en hojas',
      'Deformación de hojas y flores',
      'Puntos negros (excrementos)',
      'Flores deformadas o manchadas',
      'Insectos alargados muy pequeños'
    ],
    'Trampas adhesivas azules. Eliminar flores afectadas. Aceite de neem. Introducir ácaros depredadores. Mantener humedad ambiental alta.'
  ),
  new Amenaza(
    'Cochinilla',
    'Insectos con caparazón que se adhieren a tallos y hojas. Succionan savia.',
    'plaga',
    'https://images.unsplash.com/photo-1581578017426-677370209555?w=400',
    [
      'Bultos marrones o blancos en tallos',
      'Melaza pegajosa',
      'Debilitamiento de la planta',
      'Hojas amarillentas',
      'Presencia de hormigas'
    ],
    'Retirar manualmente con cepillo. Alcohol diluido con jabón. Aceite de parafina. Introducir mariquitas. Podar partes muy afectadas.'
  )
];