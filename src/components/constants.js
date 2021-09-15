const uri = 'http://localhost:3001';
const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const tableReportFormat = [
  { label: 'Fecha', key: 'date' },
  { label: 'Dimensión', key: 'dimension' },
  { label: 'Descripción', key: 'event_desc' },
  { label: 'Nombre', key: 'nombre' },
  { label: 'Apellido', key: 'apellido' },
  { label: 'Tipo de documento', key: 'tipo_doc' },
  { label: 'Número de documento', key: 'num_identificacion' },
  { label: 'Sexo', key: 'sexo' },
  { label: 'Tipo beneficiario', key: 'tipo_beneficiario' },
  { label: 'Programa o dependencia', key: 'programa' },
];

const genre = {
  M: 'Masculino',
  F: 'Femenino',
};

module.exports = {
  genre,
  months,
  tableReportFormat,
  uri,
};
