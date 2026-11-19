export const WA_NUMBER = "5493413742508"; // TODO: reemplazar por el número real
export const waLink = (msg = "Hola! Quiero reservar un turno en Virago Nails") =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
export const INSTAGRAM = "https://www.instagram.com/virago.nails"; // TODO
export const ADDRESS = "Blvd. Rondeau 364, Rosario, Santa Fe, Argentina"; // TODO: dirección exacta
export const tones = ["from-nude to-rose/60","from-beige to-nude","from-mist to-nude","from-rose/50 to-beige","from-ink/80 to-rose/70","from-nude to-mist"];
export const services = [
  { slug: "semipermanente-liso",name: "Esmaltado semipermanente liso", desc: "Esmaltado semipermanente sobre uña natural. Resultado prolijo y brillo intenso.", dur: "90 min", price: "$29.000 ARS",},
  { slug: "semipermanente-nail-art-french", name: "Esmaltado semipermanente + Nail Art/French", desc: "Esmaltado semipermanente sobre uña natural. Incluye francesitas, polvos, brillos, strass y dibujos simples.",
    dur: "90 min", price: "$31.000 ARS",},
  { slug: "estetica-de-manos", name: "Estética de manos", desc: "Incluye preparación cuidadosa de uñas y cutículas, limado y perfeccionamiento de la forma, logrando una apariencia limpia, prolija y armónica. Finaliza con hidratación mediante aceite de cutículas y crema humectante, brindando una experiencia de bienestar y manos visiblemente cuidadas.",
    dur: "30 min", price: "$25.000 ARS",},
  { slug: "extensiones-soft-gel-liso", name: "Extensiones Soft Gel liso", desc: "Extensión sobre uñas mediante tips de gel. Permite lograr el largo y la forma deseada con una apariencia natural.", dur: "120 min", price: "$36.000 ARS",},
  { slug: "extensiones-soft-gel-nail-art-french", name: "Extensiones Soft Gel + Nail Art/French", desc: "Extensión sobre uñas mediante tips de gel. Incluye francesitas, polvos, brillos, strass y dibujos basicos.", dur: "120 min", price: "$38.000 ARS",},
  { slug: "kapping-gel-liso", name: "Kapping gel liso", desc: "Refuerzo de gel sobre uña natural para aportar resistencia, acompañar la flexibilidad natural de la uña y favorecer su protección.", dur: "90 min", price: "$33.000 ARS",},
  { slug: "kapping-gel-nail-art-french", name: "Kapping gel + Nail Art/French", desc: "Refuerzo de gel sobre uña natural. Incluye francesitas, polvos, brillos, strass o dibujos simples.", dur: "120 min", price: "$35.000 ARS",},
  { slug: "retiro-otro-salon-kapping-diseno", name: "Retiro semi/kapping/softgel de otro salón + Kapping Gel con diseño", desc: "Retiro cuidadoso de trabajo de otro salón seguido de Kapping Gel con diseño.",dur: "90 min",price: "$39.000 ARS",},
  { slug: "retiro-virago-kapping-nail-art-french", name: "Retiro semi/kapping/softgel de Virago + Kapping Gel + Nail Art/French", desc: "El precio varía según diseño.", dur: "120 min", price: "$35.000 ARS",},
  { slug: "retiro-virago-soft-gel-nail-art-french", name: "Retiro semi/kapping/softgel de Virago + Soft Gel + Nail Art/French", desc: "El precio varía según diseño.", dur: "120 min", price: "$38.000 ARS",},
  { slug: "retiro-otro-salon-kapping-liso", name: "Retiro semi/kapping/softgel de otro salón + Kapping Gel liso",desc: "Retiro cuidadoso de trabajo de otro salón seguido de Kapping Gel liso.", dur: "120 min", price: "$37.000 ARS",},
  { slug: "retiro-otro-salon-semipermanente-liso",name: "Retiro semi/kapping/softgel de otro salón + Semipermanente liso", desc: "Retiro cuidadoso de trabajo de otro salón seguido de esmaltado semipermanente liso.", dur: "90 min", price: "$33.000 ARS",},
  { slug: "retiro-otro-salon-soft-gel-liso", name: "Retiro semi/kapping/softgel de otro salón + Soft Gel liso", desc: "Retiro cuidadoso de trabajo de otro salón seguido de Extensiones Soft Gel liso.", dur: "120 min", price: "$40.000 ARS",},
  { slug: "retiro-virago-kapping-liso", name: "Retiro semi/kapping/softgel de Virago + Kapping Gel liso", desc: "Retiro cuidadoso de trabajo realizado en Virago seguido de Kapping Gel liso.", dur: "90 min",price: "$33.000 ARS",},
  { slug: "retiro-virago-semipermanente-liso", name: "Retiro semi/kapping/softgel de Virago + Semipermanente liso", desc: "Retiro cuidadoso de trabajo realizado en Virago seguido de esmaltado semipermanente liso.", dur: "90 min", price: "$29.000 ARS",},
  { slug: "retiro-virago-semipermanente-nail-art-french", name: "Retiro semi/kapping/softgel de Virago + semipermanente + Nail Art/French", desc: "El precio varía según diseño.", dur: "90 min", price: "$31.000 ARS",},
  { slug: "retiro-virago-soft-gel-liso", name: "Retiro semi/kapping/softgel de Virago + Soft Gel liso", desc: "Retiro cuidadoso de trabajo realizado en Virago seguido de Extensiones Soft Gel liso.", dur: "120 min", price: "$36.000 ARS",},
  { slug: "solo-retiro-acabado-prolijo", name: "Solo retiro de semipermanente/kapping/soft gel + acabado prolijo de uñas", desc: "Retiro seguro del sistema y terminación prolija de las uñas naturales.", dur: "30 min", price: "$25.000 ARS",},
];
export const categories = ["Todos", "Semipermanente", "Nail Art", "Soft Gel", "Extensiones"];
export const gallery = Array.from({ length: 12 }, (_, i) => ({
  id: i, cat: categories[1 + (i % 4)], tone: tones[i % tones.length], ratio: ["aspect-[3/4]", "aspect-square", "aspect-[4/5]"][i % 3],
}));
export const testimonials = [
  { name: "Camila R.", text: "Los diseños son una obra de arte y la higiene es impecable. Mis uñas duran semanas perfectas." },
  { name: "Lucía M.", text: "Me atendieron súper personalizado. Fui por Soft Gel y salí enamorada del resultado." },
  { name: "Agustina P.", text: "El mejor lugar de Rosario. Reservar por WhatsApp fue rapidísimo y el ambiente es hermoso." },
];
export const benefits = [
  ["Higiene certificada", "Instrumental esterilizado y material descartable en cada turno."],
  ["Diseño a medida", "Cada set se piensa para tus manos y tu estilo."],
  ["Productos premium", "Geles y esmaltes de primeras marcas, sin compromisos."],
  ["Reserva en segundos", "Elegí tu servicio y confirmamos por WhatsApp."],
];
