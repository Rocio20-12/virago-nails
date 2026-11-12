export const WA_NUMBER = "5493410000000"; // TODO: reemplazar por el número real
export const waLink = (msg = "Hola! Quiero reservar un turno en Virago Nails") =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
export const INSTAGRAM = "https://instagram.com/viragonails"; // TODO
export const ADDRESS = "Rosario, Santa Fe, Argentina"; // TODO: dirección exacta
export const tones = ["from-nude to-rose/60","from-beige to-nude","from-mist to-nude","from-rose/50 to-beige","from-ink/80 to-rose/70","from-nude to-mist"];
export const services = [
  { slug: "semipermanente", name: "Esmaltado Semipermanente", desc: "Color impecable y brillo intenso hasta 3 semanas, con preparación cuidada de la uña.", dur: "60 min", price: "Desde $18.000" },
  { slug: "nail-art", name: "Nail Art", desc: "Diseños exclusivos hechos a mano: minimal, french, glitter, efecto espejo y más.", dur: "30–90 min", price: "Desde $6.000" },
  { slug: "soft-gel", name: "Soft Gel", desc: "Uñas livianas y naturales con fórmula flexible. Ideal para largo y resistencia sin daño.", dur: "120 min", price: "Desde $32.000" },
  { slug: "kapping-gel", name: "Kapping Gel", desc: "Refuerzo sobre uña natural para ganar fortaleza y acompañar su crecimiento.", dur: "90 min", price: "Desde $26.000" },
  { slug: "extensiones", name: "Extensiones", desc: "Esculpidas a medida en la forma y el largo que elijas, con acabado perfecto.", dur: "150 min", price: "Desde $40.000" },
  { slug: "estetica-manos", name: "Estética de Manos", desc: "Manicura de spa: limpieza de cutículas, exfoliación e hidratación profunda.", dur: "45 min", price: "Desde $14.000" },
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
